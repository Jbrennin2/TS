"use client"
import { useSearchParams } from 'next/navigation';

export default function Page() {

    const searchParams = useSearchParams();
    const imageURL = searchParams.get('image');
  
    return (
      <div className="flex flex-col items-center justify-evenly min-h-screen bg-gray-100">
        <img src={imageURL} />
        <button onClick={() => {console.log(imageURL)}}>hello</button>
      </div>
    );
}