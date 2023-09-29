"use client"
import { useSearchParams } from 'next/navigation'

export default function Checkout() {

  const ImageUrl = useSearchParams().get('id')


  return (
    <div>
    </div>
  );
}