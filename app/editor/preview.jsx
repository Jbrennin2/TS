"use client"
import Editor from "./editor"
import Header from "../components/header"
import {useState} from 'react';
import NextImage from "next/image";
export default function Preview({imageState}) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className={"flex items-center justify-center w-[60%]"}>
                <img src={`data:image/png;base64,${imageState}`} className="border border-blue-400"/>
            </div>
        </div> 
    )
}