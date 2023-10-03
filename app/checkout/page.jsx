"use client"
import { useSearchParams } from 'next/navigation'
import {useState} from 'react'
import ShippingForm from './shippingForm'
import OrderInfo from './orderInfo'
import Header from '../components/header'
import CheckoutButton from './checkoutButton'

export default function Checkout() {

  const ImageUrl = useSearchParams().get('id')
  const [orderId, setOrderId] = useState(null)

  return (
    <div className="flex items-center min-h-screen justify-center">
      {!orderId ? (<>
      {/**<Header /> */}
      <div className="flex flex-col h-full min-h-screen max-w-[1000px] w-full p-8 justify-center">
        <OrderInfo ImageUrl={ImageUrl}/>
        <ShippingForm ImageUrl={ImageUrl} setOrderId={setOrderId}/>
      </div>  
      </>) :
      (<div>
        <h1>Sample Product</h1>
        <p>Price: $10.00</p>
      </div>)
      }
    </div>
  );
}