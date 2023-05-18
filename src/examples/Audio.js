import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import MainNavbar from "../MainNavbar";
import ReactAudioPlayer from "react-audio-player";
import audio from "../samples/audio-1.mp3";
import {
    saveAudioFile,
    getAudioFileByName,
    audioFileExistsByName,
    getAudioFileHashByName,
} from "../utils/idb";
import { getData } from "../utils/sockets";
import { acceptRequest, rejectRequest, sendRequest } from "./../utils/peer";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000");
const Audio = () => {
    const [audioFileBlobUrl, setAudioFileBlobUrl] = useState(null);
    const [audioFileExists, setAudioFileExists] = useState();

    useEffect(() => {
        async function indexedDBAudioFileExists() {
            const exists = await audioFileExistsByName("audio-1.mp3");
            setAudioFileExists(exists);
        }

        indexedDBAudioFileExists();
    }, []);

    useEffect(() => {
        async function getIndexedDBAudioFile() {
            const file = await getAudioFileByName("audio-1.mp3");
            if (file) {
                const blob = new Blob([file.content], { type: "audio/mpeg" });
                setAudioFileBlobUrl(URL.createObjectURL(blob));
            }
        }

        async function saveIndexedDBAudioFile() {
            const file = await fetch(audio);

            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest("sha-256", buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            await saveAudioFile("audio-1.mp3", buffer, `sha-256=${hashHex}`);
            const blobURL = new Blob([buffer], { type: "audio/mpeg" });
            setAudioFileBlobUrl(URL.createObjectURL(blobURL));
            setAudioFileExists(true);
        }

        if (audioFileExists === true) {
            getIndexedDBAudioFile();
        } else if (audioFileExists === false) {
            let uuid = localStorage.getItem("uuid");
            let swarmid = localStorage.getItem("swarmid");
            let status = getData(swarmid, uuid, "audio-1.mp3");
            if (status) {
                try {
                    acceptRequest(swarmid, uuid);
                } catch (error) {
                    saveIndexedDBAudioFile();
                }
            } else {
                saveIndexedDBAudioFile();
            }
        }
    }, [audioFileExists]);

    useEffect(() => {
        socket.on("hasData", (swarmdid, uuid, whichData) => {
            if (uuid !== localStorage.getItem("uuid")) {
                console.log(`${uuid} is requesting ${whichData}`);
                if (whichData === "audio-1.mp3") {
                    async function getIndexedDBAudioFile() {
                        try {
                            const file = await getAudioFileByName("audio-1.mp3");
                            if (file) {
                                console.log("The requested file exists in the cache.");
                                const blob = new Blob([file.content], {
                                    type: "audio/mpeg",
                                });
                                setAudioFileBlobUrl(URL.createObjectURL(blob));
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
                    getIndexedDBAudioFile();
                }
            }
        });
    });

    return (
        <div>
            <MainNavbar />
            <div className="grid place-content-center min-h-screen">
                <Card className="flex items-center justify-center">
                    <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                        Real World Audio Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to stream
                        audio.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <ReactAudioPlayer
                            src={audioFileBlobUrl}
                            controls
                        ></ReactAudioPlayer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Audio;
