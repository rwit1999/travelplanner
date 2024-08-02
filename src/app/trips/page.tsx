'use client'
import { TripType } from '@/types/trips'
import { Button, Chip } from '@nextui-org/react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'

const Trips = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchCity = searchParams.get('city')
    const [trips, setTrips] = useState<TripType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get(`http://localhost:3000/api/city-trips?city=${searchCity}`)
            if (data.data.trips) setTrips(data.data.trips)
        }
        if (searchCity) {
            fetchData()
        }
    }, [searchCity])

    return (
        <Suspense fallback={<div>Loading...</div>}>

       
        <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
            <Button 
                className="mb-6" 
                color="primary"   
                size="lg" 
                onClick={() => router.push('/')}
            >
                <FaChevronLeft className="mr-2 text-lg" />
                Go Back
            </Button>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                    <div 
                        key={trip.id} 
                        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                        onClick={() => router.push(`/trips/${trip.id}`)}
                    >
                        <Image 
                            src={trip.images[0]} 
                            width={600} 
                            height={400} 
                            alt='trip' 
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-3">{trip.name}</h2>
                            <div className="mb-3">
                                <ul className="flex flex-wrap gap-2">
                                    {trip.destinationDetails.map((detail, index) => (
                                        <li key={index}>
                                            <Chip 
                                                color="primary" 
                                                variant="flat"
                                                className="text-sm font-medium"
                                            >
                                                {detail.name}
                                            </Chip>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-gray-800 mb-4 line-clamp-3">{trip.description}</p>
                            <div className="flex justify-between mb-4 text-gray-700">
                                <div className="text-sm">{trip.days} days</div>
                                <div className="text-sm">{trip.nights} nights</div>
                            </div>
                            <div className="flex justify-between items-center text-xl font-semibold">
                                <span>Rs {trip.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </Suspense>
    )
}

export default Trips
