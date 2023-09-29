"use client"
import Editor from "./editor"
import Header from "../components/header"
import {useState} from 'react';
import NextImage from "next/image";
import Link from 'next/link'

export default function Preview({imageState, savedUrl}) {

    const [renders, setRenders] = useState(null);
    const [savedURL, setSavedURL] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);


    const saveImage = async () => {
        console.log('saving image')
        setLoading(true);
        const base64 = imageState
              // Convert Base64 to Uint8Array (binary)
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
      
        // POST the binary data to /api/upload
        console.log('saving image')

        const response = await fetch(`/api/upload?filename=my-image.png`, {
          method: 'POST',
          body: byteArray.buffer,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });
        console.log('saving image')

      
        const blob = await response.json();
        
        // Set the saved URL
        console.log(blob);
        setSavedURL(blob.url);
        setLoading(false);
        setConfirm(true)
        return blob;
      };

      const continueCheckout = () => {return}


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
            <div className={"flex items-center justify-center w-[50vw]"}>
                {!confirm ? (
                    <img src={`data:image/png;base64,${imageState}`} className="border border-blue-400"/>

                ) : (
                    <img src={savedURL} className="border border-blue-400"/>

                )}
            </div>
            <div className ="flex justify-center w-[30%] border border-blue-400">
            {!confirm ? (
                <button onClick={saveImage} className="text-xl text-center rounded bg-blue-400 hover:bg-blue-600 p-5">Confirm Image</button>

            ) : (
            <Link
                href={{
                    pathname: `/checkout`,
                    query: {
                    id: savedURL, // pass the id 
                    },
                }}
            >
                Checkout
            </Link>            
        )}
            </div>
        </div> 
    )
}