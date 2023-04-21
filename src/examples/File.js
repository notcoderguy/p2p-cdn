import React, { useState, useEffect } from 'react'
import { Card, Button } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import file from '../samples/file-1.zip'

const File = () => {
    const [hash, setHash] = useState('');

    useEffect(() => {
        async function calculateHash() {
            const response = await fetch(file);

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
                        Real World File Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to download a file.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <Button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded"
                            onClick={() => {
                                window.location.href = file
                            }}
                            integrity={hash}
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