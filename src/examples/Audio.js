import React, { useState, useEffect } from 'react'
import { Card } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import ReactAudioPlayer from 'react-audio-player'
import audio from '../samples/audio-1.mp3'

const Audio = () => {
    const [hash, setHash] = useState('');

    useEffect(() => {
        async function calculateHash() {
            const response = await fetch(audio);

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
                        Real World Audio Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to stream audio.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <ReactAudioPlayer
                            controls
                        >
                            <source src={audio} type="audio/mpeg" integrity={hash} />
                        </ReactAudioPlayer>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Audio