'use client'
import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import CheckoutForm from './components/checkout-form/checkout-form'
import { loadStripe } from '@stripe/stripe-js'
import ClientOnly from '../../components/ClientOnly' // Adjust the path as needed

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const Checkout = () => {
    const [clientSecret, setClientSecret] = useState("")
    const searchParams = useSearchParams()
    const client_secret = searchParams.get('client_secret')

    useEffect(() => {
        if (client_secret) {
            setClientSecret(client_secret)
        }
    }, [client_secret])

    return (
        <ClientOnly>
            <Suspense fallback={<div>Loading...</div>}>
                <div>
                    {
                        clientSecret && (
                            <Elements options={{ clientSecret, appearance: { theme: "stripe" } }} stripe={stripePromise}>
                                <CheckoutForm clientSecret={clientSecret} />
                            </Elements>
                        )
                    }
                </div>
            </Suspense>
        </ClientOnly>
    )
}

export default Checkout
