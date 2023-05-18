import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';
import MainNavbar from './MainNavbar';

const Home = () => {
    return (
        <div>
            {/* Render the main navigation bar */}
            <MainNavbar />

            <div className="grid place-content-center min-h-screen">
                {/* Render a card with real-world examples */}
                <Card className='flex items-center justify-center'>
                    <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                        Real World Examples
                    </h5>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        These are real world examples of how you can use P2P-CDN.
                    </p>

                    <ul className="my-4 space-y-3">
                        {/* Render a link for streaming audio */}
                        <li>
                            <Link
                                to="/audio"
                                className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-blue-300 hover:shadow"
                            >
                                <span className="ml-3 flex-1 whitespace-nowrap">
                                    Audio
                                </span>
                                <span className="text-base font-normal text-gray-500 group-hover:text-gray-900">
                                    Stream Audio.
                                </span>
                            </Link>
                        </li>
                        {/* Render a link for streaming video */}
                        <li>
                            <Link
                                to="/video"
                                className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-blue-300 hover:shadow"
                            >
                                <span className="ml-3 flex-1 whitespace-nowrap">
                                    Video
                                </span>
                                <span className="text-base font-normal text-gray-500 group-hover:text-gray-900">
                                    Stream Video.
                                </span>
                            </Link>
                        </li>
                        {/* Render a link for loading multiple images */}
                        <li>
                            <Link
                                to="/image"
                                className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-blue-300 hover:shadow"
                            >
                                <span className="ml-3 flex-1 whitespace-nowrap">
                                    Image
                                </span>
                                <span className="text-base font-normal text-gray-500 group-hover:text-gray-900">
                                    Load multiple images.
                                </span>
                            </Link>
                        </li>
                        {/* Render a link for file sharing */}
                        <li>
                            <Link
                                to="/file"
                                className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-blue-300 hover:shadow"
                            >
                                <span className="ml-3 flex-1 whitespace-nowrap">
                                    File
                                </span>
                                <span className="text-base font-normal text-gray-500 group-hover:text-gray-900">
                                    File sharing.
                                </span>
                            </Link>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default Home;
