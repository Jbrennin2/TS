"use client"
import {useState} from 'react'

export default function Checkout({ImageUrl}) {

  return (
    <div className="flex justify-evenly bg-white rounded shadow-xl mt-[5%] p-4 m-4">
        <div>
            <h1 className="text-2xl font-bold mb-2">Order Information</h1>
            <h2 className="text-lg">Custom Acrrylic Plaque</h2>
            <h3 className="text-xs text-gray-600 mb-2">w/LED Base</h3>
            <h2>Price: $45.99</h2>
        </div>
        <div className="border max-w-[25vh]">
            <img src={ImageUrl} className="w-full h-full object-cover" alt="product"/>
        </div>

    </div>
  );
}