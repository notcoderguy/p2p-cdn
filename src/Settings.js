import React from 'react'
import { Card } from "flowbite-react";
import MainNavbar from "./MainNavbar";
import { Buffer } from 'buffer';

const Settings = () => {
    const uuid = localStorage.getItem('uuid');
    const ip = Buffer.from(localStorage.getItem('ip'), 'base64').toString('ascii');
    const city = Buffer.from(localStorage.getItem('city'), 'base64').toString('ascii');
    const country = Buffer.from(localStorage.getItem('country'), 'base64').toString('ascii');
    const region = Buffer.from(localStorage.getItem('region'), 'base64').toString('ascii');
    const swarmid = localStorage.getItem('swarmid');


    return (
        <div>
            <MainNavbar />
            <div className="grid place-content-center min-h-screen">
                <Card className='flex items-center justify-center'>
                    <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                        P2P-CDN Information
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400 content-start justify-start">
                        <span className="font-bold">UUID:</span> {uuid}<br />
                        <span className="font-bold">IP:</span> {ip}<br />
                        <span className="font-bold">City:</span> {city}<br />
                        <span className="font-bold">Country:</span> {country}<br />
                        <span className="font-bold">Region:</span> {region}<br />
                        <span className="font-bold">Swarm ID:</span> {swarmid}<br />
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default Settings