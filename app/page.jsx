"use client"
import Image from 'next/image'
import Header from './components/header'
import Banner from './components/banner'
import { useState } from 'react'
import { useRouter } from 'next/router';


export default function Home() {

  const [editor, setEditor] = useState(false)

  const [header, setHeader] = useState(false)

  const [banner, setBanner] = useState(true)
  console.log('process.env.BLOB_READ_WRITE_TOKEN', process.env.BLOB)
console.log('process.env.BLOB_READ_WRITE_TOKEN', process.env.BLOB_READ_WRITE_TOKEN)
console.log('process.env.BLOB_READ_WRITE_TOKEN', process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN)

  return (
    <main className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100">
      <Header/>
      {banner ? <Banner setEditor={setEditor} editor={editor} setBanner={setBanner} banner={banner} /> : <></>}
    </main>
  )
}
