import React, { useState, useEffect } from 'react'
import { Card } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import video from '../samples/video-1.mp4'
import ReactPlayer from 'react-player'
import { saveVideoFile, getVideoFileByName, videoFileExistsByName, getVideoFileHashByName } from '../utils/idb'
import { getData } from "../utils/sockets";
import { acceptRequest, sendRequest } from "./../utils/peer";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000");
const Videos = () => {
    const [videoFileBlobUrl, setVideoFileBlobUrl] = useState(null);
    const [videoFileExists, setVideoFileExists] = useState();

    useEffect(() => {
        async function indexedDBVideoFileExists() {
            const exists = await videoFileExistsByName('video-1.mp4');
            setVideoFileExists(exists);
        }

        indexedDBVideoFileExists();
    }, []);

    useEffect(() => {
        async function getIndexedDBVideoFile() {
            const videoFile = await getVideoFileByName('video-1.mp4');
            if (videoFile) {
                const blob = new Blob([videoFile.content], { type: 'video/mp4' });
                setVideoFileBlobUrl(URL.createObjectURL(blob));
            } else {
                setVideoFileBlobUrl(null);
            }
        }

        async function saveIndexedDBVideoFile() {
            const file = await fetch(video);

            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('sha-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            await saveVideoFile('video-1.mp4', buffer, `sha-256=${hashHex}`); // `sha-256=${hashHex}`
            const blobURL = new Blob([buffer], { type: 'video/mp4' });
            setVideoFileBlobUrl(URL.createObjectURL(blobURL));
            setVideoFileExists(true);
        }

        if (videoFileExists === true) {
            getIndexedDBVideoFile();
        } else if (videoFileExists === false) {
            let uuid = localStorage.getItem("uuid");
            let swarmid = localStorage.getItem("swarmid");
            let status = getData(swarmid, uuid, "video-1.mp4");
            if (status) {
                try {
                    acceptRequest(swarmid, uuid);
                } catch (error) {
                    saveIndexedDBVideoFile();
                }
            } else {
                saveIndexedDBVideoFile();
            }
        }
    }, [videoFileExists]);

    useEffect(() => {
        socket.on("hasData", (swarmdid, uuid, whichData) => {
            if (uuid !== localStorage.getItem("uuid")) {
                console.log(`${uuid} is requesting ${whichData}`);
                if (whichData === "video-1.mp4") {
                    async function getIndexedDBVideoFile() {
                        try {
                            const videoFile = await getVideoFileByName('video-1.mp4');
                            if (videoFile) {
                                const blob = new Blob([videoFile.content], { type: 'video/mp4' });
                                setVideoFileBlobUrl(URL.createObjectURL(blob));
                                console.log("Sending file to peer...");
                                socket.emit("sendData", swarmdid, uuid, blob, true);
                            } else {
                                socket.emit("sendData", swarmdid, uuid, null, false);
                                console.log("The requested file does not exist in the cache.");
                            }
                        } catch (error) {
                            console.log("The requested file does not exist in the cache.");
                        }
                    }
                    getIndexedDBVideoFile();
                }
            }
        });
    });

    return (
        <div>
            <MainNavbar />
            <div className="grid place-content-center min-h-screen">
                <Card className='flex items-center justify-center'>
                    <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                        Real World Video Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to stream video.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <ReactPlayer
                            url={videoFileBlobUrl}
                            controls={true}
                            width="640px"
                            height="264px"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Videos