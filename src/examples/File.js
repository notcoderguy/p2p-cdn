import React, { useState, useEffect } from 'react'
import { Card, Button } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import fileZip from '../samples/file-1.zip'
import { saveFile, getFileByName, fileExistsByName, getFileHashByName } from '../utils/idb'
import { getData } from "../utils/sockets";
import { acceptRequest, sendRequest } from "./../utils/peer";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000");
const File = () => {
    const [fileBlobUrl, setFileBlobUrl] = useState(null);
    const [fileExists, setFileExists] = useState();

    useEffect(() => {
        async function indexedDBFileExists() {
            const exists = await fileExistsByName('file-1.zip');
            setFileExists(exists);
        }

        indexedDBFileExists();
    }, []);

    useEffect(() => {
        async function getIndexedDBFile() {
            const fileZip = await getFileByName('file-1.zip');
            if (fileZip) {
                const blob = new Blob([fileZip.content], { type: 'application/zip' });
                setFileBlobUrl(URL.createObjectURL(blob));
            } else {
                setFileBlobUrl(null);
            }
        }

        async function saveIndexedDBFile() {
            const fileStatus = await fetch(fileZip);
            const blob = await fileStatus.blob();

            const buffer = await blob.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('sha-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            await saveFile('file-1.zip', buffer, `sha-256=${hashHex}`); // `sha-256=${hashHex}`
            const blobURL = new Blob([blob], { type: 'application/zip' });
            setFileBlobUrl(URL.createObjectURL(blobURL));
            setFileExists(true);
        }

        if (fileExists === true) {
            getIndexedDBFile();
        } else if (fileExists === false) {
            let uuid = localStorage.getItem("uuid");
            let swarmid = localStorage.getItem("swarmid");
            let status = getData(swarmid, uuid, "file-1.zip");
            if (status) {
                try {
                    acceptRequest(swarmid, uuid);
                } catch (error) {
                    saveIndexedDBFile();
                }
            } else {
                saveIndexedDBFile();
            }
        }
    }, [fileExists]);

    useEffect(() => {
        socket.on("hasData", (swarmdid, uuid, whichData) => {
            if (uuid !== localStorage.getItem("uuid")) {
                console.log(`${uuid} is requesting ${whichData}`);
                if (whichData === "file-1.zip") {
                    async function getIndexedDBFile() {
                        try {
                            const fileZip = await getFileByName('file-1.zip');
                            if (fileZip) {
                                const blob = new Blob([fileZip.content], { type: 'application/zip' });
                                setFileBlobUrl(URL.createObjectURL(blob));
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
                    getIndexedDBFile();
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
                        Real World File Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to download a file.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <Button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded"
                            onClick={() => {
                                window.location.href = fileBlobUrl;
                            }}
                        >
                            Download
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default File