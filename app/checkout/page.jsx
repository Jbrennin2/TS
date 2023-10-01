"use client"
import { useSearchParams } from 'next/navigation'
import {useState} from 'react'
import ShippingForm from './shippingForm'
import OrderInfo from './orderInfo'
import Header from '../components/header'
import CheckoutButton from './checkoutButton'

export default function Checkout() {

  const ImageUrl = useSearchParams().get('id')
  const [payment, setPayment] = useState(false)

  return (
    <div className="flex items-center min-h-screen justify-center">
      {!payment ? (<>
      <Header />
      <div className="flex flex-col h-full min-h-screen max-w-[1000px] w-full p-8">
        <OrderInfo ImageUrl={ImageUrl}/>
        <ShippingForm ImageUrl={ImageUrl} setPayment={setPayment}/>
      </div>  
      </>) :
      (<div>
        <h1>Sample Product</h1>
        <p>Price: $10.00</p>
        <CheckoutButton />
      </div>)
      }
    </div>
  );
}