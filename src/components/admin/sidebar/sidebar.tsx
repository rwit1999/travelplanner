"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BiSolidCategory } from 'react-icons/bi'
import { FaBookOpen, FaHome, FaHotel } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'
import { MdOutlineDataUsage } from 'react-icons/md'

const Sidebar = () => {
    const router = useRouter()
    const [selectedItem, setSelectedItem] = useState("/admin/dashboard")
    const menuItems = [
        {
            label: "Dashboard",
            icon: <FaHome />,
            link: "/admin/dashboard"
        },
        {
            label: "Trips",
            icon: <BiSolidCategory />,
            link: "/admin/trips"
        },
        {
            label: "Hotels",
            icon: <FaHotel />,
            link: "/admin/hotels"
        },
        {
            label: "Bookings",
            icon: <FaBookOpen />,
            link: "/admin/bookings"
        },
        {
            label: "Scrape data",
            icon: <MdOutlineDataUsage />,
            link: "/admin/scrape-data"
        },
    ]

    const handleItemClick = (link: string) => {
        setSelectedItem(link)
        router.push(link)
    }

    return (
        <div className="h-screen w-64 bg-white text-gray-800 flex flex-col shadow-lg">
            <div className="flex flex-col items-center py-6">
                <Image 
                    src='/logo.jpg' 
                    alt='logo' 
                    height={80} 
                    width={80} 
                    className="cursor-pointer rounded-full mb-4" 
                    onClick={() => router.push('/admin/dashboard')} 
                />
                <span className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Jetsetgo</span>
            </div>
            <nav className="flex-grow">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleItemClick(item.link)}
                        className={`w-full flex items-center px-4 py-2 text-lg transition-colors duration-200 ${selectedItem === item.link ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="px-4 py-2">
                <button
                    onClick={() => handleItemClick('/admin/logout')}
                    className={`w-full flex items-center px-4 py-2 text-lg transition-colors duration-200 ${selectedItem === '/admin/logout' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    <LuLogOut />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
