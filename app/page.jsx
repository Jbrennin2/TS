"use client"
import Image from 'next/image'
import Header from './components/header'
import ProductDisplayPage from './components/productDisplayPage'
import { useState } from 'react'
import { useRouter } from 'next/router';

export default function Home() {

  const [editor, setEditor] = useState(false)

  const [header, setHeader] = useState(false)

  const [headerSticky, setHeaderSticky] = useState(false);


  return (
    <main className="h-full w-full">
      {/**<Header /> */}
      <div className=" overflow-y-hidden flex flex-col justify-start items-center min-h-[3000px] bg-white ">
        <ProductDisplayPage />
      </div>
    </main>
  )
}
