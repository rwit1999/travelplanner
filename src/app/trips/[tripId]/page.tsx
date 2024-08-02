'use client'
import { useAppStore } from '@/store/store'
import { TripType } from '@/types/trips'
import { Button, Input, Tab, Tabs } from '@nextui-org/react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaCalendar, FaRegCheckCircle } from 'react-icons/fa'
import { IoMdPerson, IoMdPricetag } from "react-icons/io";
import Itinerary from './components/itinerary/itinerary'
import { ImageGallery } from './components/images/image'

const Trip = ({ params: { tripId } }: { params: { tripId: string } }) => {
    const router = useRouter()
    const { userInfo } = useAppStore()
    const [tripData, setTripData] = useState<TripType | undefined>(undefined)
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        const fetchTripData = async () => {
            const data = await axios.get(`/api/trips?id=${tripId}`)
            if (data.data.id) setTripData(data.data)
        }
        if (tripId) fetchTripData()
    }, [tripId])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ? new Date(e.target.value) : new Date()
        setDate(newDate)
    }

    const bookTrip = async () => {
        const isoDate=date.toISOString()
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingId:tripData?.id, bookingType:"trips", userId:userInfo?.id, taxes:2000,date:isoDate })
        });
        const data=await response.json();
        if(data.client_secret){
            router.push(`/checkout?client_secret=${data.client_secret}`)
        }
        
        
    }

    return (
        <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-lg shadow-xl">
            {tripData && (
                <>
                    {/* Image Gallery & Payment Section */}
                    <div className="flex flex-col lg:flex-row justify-between mb-8">
                        <div className="lg:w-2/3">
                            <ImageGallery images={tripData.images} />
                        </div>
                        <div className="lg:w-1/3 bg-white p-8 rounded-lg shadow-md lg:ml-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Book Your Trip</h1>
                            <div className="text-lg mb-4">
                                <IoMdPricetag className="inline-block text-gray-600 mr-2" />
                                <span>From</span>
                                <span className="ml-2 text-4xl font-semibold text-gray-800">Rs {tripData.price}</span>
                            </div>
                            <div className="mt-6">
                                <Input
                                    endContent={<FaCalendar className="text-gray-500" />}
                                    type='date'
                                    onChange={handleDateChange}
                                    className="mb-4 w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                />
                                <Input
                                    endContent={<IoMdPerson className="text-gray-500" />}
                                    placeholder='Guests'
                                    type='number'
                                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                                />
                            </div>
                            <ul className="mt-6 space-y-3 text-gray-600">
                                <li className="flex justify-between">
                                    <span>Base Price</span>
                                    <span>Rs {tripData.price}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>State price</span>
                                    <span>Rs 500</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Night price</span>
                                    <span>Rs 400</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Convenience fee</span>
                                    <span>Rs 1100</span>
                                </li>
                                <li className="flex justify-between font-semibold text-gray-800">
                                    <span>Total price</span>
                                    <span>Rs {tripData.price + 2000}</span>
                                </li>
                            </ul>
                            <Button
                                className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                                onClick={() => userInfo && bookTrip()}
                            >
                                {userInfo ? "Book Trip" : "Login to book trip"}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Trip Details Section */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6">{tripData.name}</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Trip Overview</h3>
                                <p className="text-lg text-gray-600 mb-6">{tripData.description}</p>

                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tour Highlights</h3>
                                <ul className="space-y-2">
                                    {tripData.themes.map((theme, index) => (
                                        <li key={index} className="flex items-center text-lg text-gray-600">
                                            <FaRegCheckCircle className="mr-2 text-green-500" />
                                            <span>{theme}</span>
                                        </li>
                                    ))}
                                    {tripData.inclusions.map((inclusion, index) => (
                                        <li key={index} className="flex items-center text-lg text-gray-600">
                                            <FaRegCheckCircle className="mr-2 text-green-500" />
                                            <span>{inclusion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Trip Itinerary</h3>
                                <Itinerary data={tripData.detailedItinerary} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">About the Locations</h3>
                        <Tabs className="mt-4 text-lg text-gray-600">
                            {tripData.destinationDetails.map((city, index) => (
                                <Tab key={index} title={city.name} className="font-medium">
                                    <div className="flex items-start space-x-4 mt-4">
                                        <div className="flex-shrink-0 w-1/2">
                                            <Image
                                                src={city.image}
                                                alt={city.name}
                                                width={500}
                                                height={350}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow w-1/2">
                                            <p>{city.description}</p>
                                        </div>
                                    </div>
                                </Tab>
                            ))}
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    )
}

export default Trip
