import React, { useEffect } from "react";
import { Navbar, Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

function MainNavbar() {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "P2P-CDN";
    }, []);

    return (
        <Navbar
            fluid={true}
            rounded={true}
        >
            <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap text-xl font-bold italic hover:text-blue-500">
                    P2P-CDN
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                {/* Setting Button */}
                <Button
                    onClick={() => navigate('/settings')}
                    className="mr-2"
                    variant="outline"
                    color="primary"
                    size="sm"
                >
                    <span className="text-sm hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </span>
                </Button>
            </div>
        </Navbar>
    );
}

export default MainNavbar;