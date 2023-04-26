import React, { useState, useEffect, useRef } from "react";
import { Card } from "flowbite-react";
import MainNavbar from "../MainNavbar";

import image1 from "../samples/image-1.jpg";
import image2 from "../samples/image-2.jpg";
import image3 from "../samples/image-3.jpg";
import image4 from "../samples/image-4.jpg";
import image5 from "../samples/image-5.jpg";
import image6 from "../samples/image-6.jpg";
import image7 from "../samples/image-7.jpg";
import image8 from "../samples/image-8.jpg";
import image9 from "../samples/image-9.jpg";
import image10 from "../samples/image-10.jpg";

const Images = () => {
  const once = useRef(true);
  const images = [
    {
      original: image1,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image2,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image3,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image4,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image5,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image6,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image7,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image8,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image9,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
    {
      original: image10,
      originalHeight: "270px",
      originalWidth: "480px",
      integrity: "",
    },
  ];

  const [hash, setHash] = useState([]);
  const [imageSrc, setimageSrc] = useState();

  useEffect(() => {
    if (once.current) {
      once.current = false;

      async function calculateHash() {
        for (let i = 0; i < images.length; i++) {
          const response = await fetch(images[i].original);
          const buffer = await response.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest("sha-256", buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          setHash((e) => [...e, `sha-256=${hashHex}`]);
        }
      }
      calculateHash();
    }
  }, []);

  // useEffect(() => {
  //   audio(image1);
  // }, []);

  return (
    <div>
      <MainNavbar />
      <div className="grid place-content-center min-h-screen">
        <Card className="flex items-center justify-center">
          <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
            Real World Images Example
          </h5>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            This is a real world example of how you can use P2P-CDN to stream
            images.
          </p>
          <div className="space-y-3 space-x-3 flex flex-wrap items-center justify-center">
            {hash &&
              images.map((e, index) => (
                <img
                  src={images[index].original}
                  alt={`demo${index + 1}`}
                  width={images[index].originalWidth}
                  height={images[index].originalHeight}
                  integrity={hash[index]}
                />
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Images;
