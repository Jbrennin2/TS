"use client"
import Editor from "./editor"
import Header from "../components/header"
import Preview from "./preview"
import {useState} from 'react';
export default function Page() {

    const [editor, setEditor] = useState(true)
    const [preview, setPreview] = useState(false)
    const [imageState, setImageState] = useState(null)

    return (
        <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100">
            <Header/>
            {editor ? <Editor setEditor={setEditor} setPreview={setPreview} setImageState={setImageState}/> : null}
            {preview ? <Preview imageState={imageState}/> : null}
        </div> 
    )
}