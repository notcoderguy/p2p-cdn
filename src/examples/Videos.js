import React, { useState, useEffect } from 'react'
import { Card } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import videojs from 'video.js'
import video from '../samples/video-1.mp4'
import './Videos.css'


const Videos = () => {
    const [hash, setHash] = useState('');

    useEffect(() => {
        async function calculateHash() {
            const response = await fetch(video);

            const buffer = await response.arrayBuffer();

            const hashBuffer = await crypto.subtle.digest('sha-256', buffer);

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setHash(`sha-256=${hashHex}`);
        }

        calculateHash();
    }, []);

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
                        <video
                            className="video-js"
                            id='my-video'
                            controls
                            preload="auto"
                            width="640"
                            height="264"
                            data-setup="{ }"
                        >
                            <source src={video} width="480px" type="video/mp4" integrity={hash} />
                            <p class="vjs-no-js">
                                To view this video please enable JavaScript, and consider upgrading to a
                                web browser that
                                <a href="https://videojs.com/html5-video-support/" target="_blank"
                                >supports HTML5 video</a
                                >
                            </p>
                        </video>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Videos