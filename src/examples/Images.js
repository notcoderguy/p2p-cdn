import React, { useState, useEffect } from 'react'
import { Card } from 'flowbite-react'
import MainNavbar from '../MainNavbar'
import ReactImageGallery from 'react-image-gallery'
import './Images.css'

import image1 from '../samples/image-1.jpg'
import image2 from '../samples/image-2.jpg'
import image3 from '../samples/image-3.jpg'
import image4 from '../samples/image-4.jpg'
import image5 from '../samples/image-5.jpg'
import image6 from '../samples/image-6.jpg'
import image7 from '../samples/image-7.jpg'
import image8 from '../samples/image-8.jpg'
import image9 from '../samples/image-9.jpg'
import image10 from '../samples/image-10.jpg'


const Images = () => {
    const images = [
        {
            original: image1,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image2,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image3,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image4,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image5,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image6,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image7,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image8,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image9,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        },
        {
            original: image10,
            originalHeight: '270px',
            originalWidth: '480px',
            description: '',
            integrity: '',
        }
    ]

    const [hash, setHash] = useState('');

    useEffect(() => {
        for (let i = 0; i < images.length; i++) {
            async function calculateHash() {
                const response = await fetch(images[i].original);

                const buffer = await response.arrayBuffer();

                const hashBuffer = await crypto.subtle.digest('sha-256', buffer);

                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                images[i].description = `sha-256=${hashHex}`;
                images[i].integrity = `sha-256=${hashHex}`;
            }

            calculateHash();
        }
    }, []);

    return (
        <div>
            <MainNavbar />
            <div className="grid place-content-center min-h-screen">
                <Card className='flex items-center justify-center'>
                    <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                        Real World Images Example
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        This is a real world example of how you can use P2P-CDN to stream images.
                    </p>
                    <div className="my-4 space-y-3 flex items-center justify-center">
                        <div className="w-1/2 h-auto">
                            <ReactImageGallery
                                items={images}
                                showPlayButton={true}
                                showFullscreenButton={true}
                                showNav={true}
                                showBullets={true}
                                showThumbnails={false}
                                showIndex={true}
                                lazyLoad={true}
                                integrityCheck={true}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Images