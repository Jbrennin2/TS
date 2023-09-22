"use client"
import Image from 'next/image'
import Header from './components/header'
import Banner from './components/banner'
import Editor from './components/editor'
import { useState } from 'react'

export default function Home() {

  const [editor, setEditor] = useState(false)

  const [header, setHeader] = useState(false)

  const [banner, setBanner] = useState(true)

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100">
      <Header/>
      {banner ? <Banner setEditor={setEditor} editor={editor} setBanner={setBanner} banner={banner} /> : <></>}
      {editor ? <Editor/> : null}
    </main>
  )
}
