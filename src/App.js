import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";

import Home from "./Home";
import Audio from "./examples/Audio";
import Video from "./examples/Videos";
import Image from "./examples/Images";
import File from "./examples/File";
import Info from "./Info";
import { connect } from "./utils/sockets";
import { acceptRequest, rejectRequest, sendRequest } from "./utils/peer";

import io from "socket.io-client";
import Peer from "simple-peer";

function App() {
  const backend = "http://localhost:8000";

  // State variables for storing fetched data
  const [ip, setIp] = useState("");
  const [uuid, setUuid] = useState("");
  const [country, setCountry] = useState("");
  const [swarmid, setSwarmid] = useState("");

  // Fetch IP address data
  const getData = async () => {
    // Make a request to retrieve the IP address
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data.ip);

    // Store the IP address in localStorage and state variable
    localStorage.setItem("ip", Buffer.from(res.data.ip).toString("base64"));
    setIp(res.data.ip);
  };

  // Fetch UUID data
  const getUUID = async () => {
    // Make a request to retrieve the UUID
    const uuid = await axios.get(`${backend}/users`);
    console.log("UUID: " + uuid.data.uuid);

    // Store the UUID in localStorage and state variable
    localStorage.setItem("uuid", uuid.data.uuid);
    setUuid(uuid.data.uuid);
  };

  // Fetch city data
  const getCity = async () => {
    // Prepare the request body with IP and UUID
    let body = {
      ip: localStorage.getItem("ip"),
      uuid: localStorage.getItem("uuid"),
    };

    // Make a request to retrieve the city data
    const res = await axios.post(`${backend}/users`, body);
    console.log(res.data);

    // Store the city data in localStorage and update the country state variable
    localStorage.setItem("city", Buffer.from(res.data.city).toString("base64"));
    localStorage.setItem(
      "country",
      Buffer.from(res.data.country).toString("base64")
    );
    localStorage.setItem(
      "region",
      Buffer.from(res.data.region).toString("base64")
    );
    setCountry(res.data.country);
  };

  // Fetch swarm ID data
  const getSwarmID = async () => {
    // Prepare the request body with UUID, city, country, and region
    let body = {
      uuid: localStorage.getItem("uuid"),
      city: localStorage.getItem("city"),
      country: localStorage.getItem("country"),
      region: localStorage.getItem("region"),
    };

    // Make a request to retrieve the swarm ID
    const swarmid = await axios.post(`${backend}/swarm`, body);
    console.log("SwarmID: " + swarmid.data.swarm_id);

    // Store the swarm ID in localStorage and update the swarmid state variable
    localStorage.setItem("swarmid", swarmid.data.swarm_id);
    setSwarmid(swarmid.data.swarm_id);
  };

  // Connect to the swarm using sockets
  const connectToSwarm = async () => {
    let uuid = localStorage.getItem("uuid");
    let swarmid = localStorage.getItem("swarmid");
    console.log("Connecting to swarm...");
    connect(uuid, swarmid);
  };

  useEffect(() => {
    // Fetch UUID if it doesn't exist
    if (!localStorage.getItem("uuid")) {
      getUUID();
    }

    // Fetch IP address data if it doesn't exist
    if (!localStorage.getItem("ip")) {
      getData();
    }
  }, []);

  useEffect(() => {
    // Fetch city data if IP address is fetched
    if (
      (!localStorage.getItem("city") || !localStorage.getItem("country")) &&
      localStorage.getItem("ip")
    ) {
      getCity();
    }
  }, [ip]);

  useEffect(() => {
    // Fetch swarm ID if UUID and country are fetched
    if (
      !localStorage.getItem("swarmid") &&
      localStorage.getItem("uuid") &&
      localStorage.getItem("country")
    ) {
      getSwarmID();
    }
  }, [uuid, country]);

  useEffect(() => {
    // Connect to swarm if swarm ID and UUID exist
    if (localStorage.getItem("swarmid") && localStorage.getItem("uuid")) {
      connectToSwarm();
    }
  }, [swarmid, uuid]);

  useEffect(() => {
    // Listen for messages from the swarm
    const socket = io(backend);
    socket.on("hasData", (swarmid, uuid, whichData) => {
      if (swarmid !== localStorage.getItem("swarmid")) return;
      if (uuid !== localStorage.getItem("uuid")) {
        console.log(`${uuid} is requesting ${whichData}`);
      }
    });
  });

  return (
    <div className="App selection:bg-blue-500 scrollbar-hide selection:text-black">
      <Routes>
        {/* Define routes for different components */}
        <Route path="/" element={<Home />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/video" element={<Video />} />
        <Route path="/image" element={<Image />} />
        <Route path="/file" element={<File />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </div>
  );
}

export default App;
