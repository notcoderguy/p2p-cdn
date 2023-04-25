import React, { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom"
import axios from "axios";
import { Buffer } from 'buffer';

import Home from './Home';
import Audio from './examples/Audio';
import Video from './examples/Videos';
import Image from './examples/Images';
import File from './examples/File';
import Settings from './Settings';

function App() {
  const backend = "http://localhost:8000"

  const [ip, setIp] = useState('');
  const [uuid, setUuid] = useState('');
  const [country, setCountry] = useState('');

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data.ip);
    localStorage.setItem('ip', Buffer.from(res.data.ip).toString('base64'));
    setIp(res.data.ip);
  };

  const getUUID = async () => {
    const uuid = await axios.get(`${backend}/users`);
    console.log(uuid.data.uuid);
    localStorage.setItem('uuid', uuid.data.uuid);
    setUuid(uuid.data.uuid);
  };

  const getCity = async () => {
    let body = {
      "ip": localStorage.getItem('ip'),
      "uuid": localStorage.getItem('uuid')
    }
    const res = await axios.post(`${backend}/users`, body);
    console.log(res.data);
    localStorage.setItem('city', Buffer.from(res.data.city).toString('base64'));
    localStorage.setItem('country', Buffer.from(res.data.country).toString('base64'));
    localStorage.setItem('region', Buffer.from(res.data.region).toString('base64'));
    setCountry(res.data.country);
  };

  const getSwarmID = async () => {
    let body = {
      "uuid": localStorage.getItem('uuid'),
      "city": localStorage.getItem('city'),
      "country": localStorage.getItem('country'),
      "region": localStorage.getItem('region')
    }
    const swarmid = await axios.post(`${backend}/swarm`, body);
    console.log(swarmid.data.swarm_id);
    localStorage.setItem('swarmid', swarmid.data.swarm_id);
  };

  useEffect(() => {
    if (!localStorage.getItem('uuid')) {
      getUUID();
    }

    if (!localStorage.getItem('ip')) {
      getData();
    }
  }, [])

  useEffect(() => {
    if ((!localStorage.getItem('city') || !localStorage.getItem('country')) && localStorage.getItem('ip')) {
      getCity();
    }
  }, [ip])

  useEffect(() => {
    if ((!localStorage.getItem('swarmid')) && localStorage.getItem('uuid') && localStorage.getItem('country')) {
      getSwarmID();
    }
  }, [uuid, country])

  return (
    <div className="App selection:bg-blue-500 scrollbar-hide selection:text-black">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/video" element={<Video />} />
        <Route path="/image" element={<Image />} />
        <Route path="/file" element={<File />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
