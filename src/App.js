import React, { useEffect , useState } from 'react'
import { Route, Routes } from "react-router-dom"
import axios from "axios";

import Home from './Home';
import Audio from './examples/Audio';
import Video from './examples/Videos';
import Image from './examples/Images';
import File from './examples/File';
import Settings from './Settings';

import createUUID from './utils/create-uuid'

function App() {

  const [ip, setIP] = useState("");

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    console.log(res.data);
    setIP(res.data.ip);
  };

  useEffect(() => {
    if (!localStorage.getItem('uuid')) {
      localStorage.setItem('uuid', createUUID())
    }

    if (!localStorage.getItem('ip')) {
      getData();
      localStorage.setItem('ip', sha1(ip))
    }
  }, [])
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
