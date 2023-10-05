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

  const [headerSticky, setHeaderSticky] = useState(false);


  return (
    <main className="flex flex-col min-h-[3000px] bg-gray-100">
      {/**<Header /> */}
      {banner ? <Banner setEditor={setEditor} editor={editor} setBanner={setBanner} banner={banner} setHeaderSticky={setHeaderSticky} headerSticky={headerSticky}/> : <></>}
    </main>
  )
}
