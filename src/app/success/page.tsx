'use client'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Success = () => {

    const router=useRouter()
    const searchParams=useSearchParams()
    const paymentIntent=searchParams.get('payment_intent')

    useEffect(()=>{
        const updateOrderInfo = async()=>{
            await axios.patch('/api/booking',{paymentIntent})
            setTimeout(()=>{
                router.push('/my-bookings')
            },3000)
        }
        if(paymentIntent){
            updateOrderInfo()
        }
    },[paymentIntent,router])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center text-gray-800">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-6">You are being redirected to the bookings page...</p>
        <p className="text-sm text-gray-600">Please do not close this window.</p>
      </div>
    </div>
  )
}

export default Success
