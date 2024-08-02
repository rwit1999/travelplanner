import { apiClient } from '@/lib'
import React, { useEffect, useState } from 'react'

const ScrapingQueue = () => {
    const [onGoingJobs, setOnGoingJobs] = useState(0)

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await apiClient.get('/admin/job-details')
                setOnGoingJobs(data.data.onGoingJobs)
            } catch (error) {
                console.error('Error fetching job details:', error)
            }
        }
        const interval = setInterval(() => getData(), 3000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const getCircleColor = () => {
        if (onGoingJobs <= 5) return "stroke-green-500"
        else if (onGoingJobs <= 10) return "stroke-orange-500"
        else return "stroke-red-500"
    }

    const getCircleProgress = () => {
        const maxJobs = 20 // Maximum number of jobs to represent full circle
        const percentage = (onGoingJobs / maxJobs) * 100
        return percentage
    }

    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Queue</h2>
            <div className="relative w-32 h-32">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray="283" // 2 * π * radius (10 * π)
                        strokeDashoffset={(1 - getCircleProgress() / 100) * 283} // Adjusting the dash offset for progress
                        className={`transition-transform duration-500 ${getCircleColor()}`}
                    />
                </svg>
                <div className="flex items-center justify-center w-full h-full">
                    <h4 className="text-4xl font-bold text-gray-800">{onGoingJobs}</h4>
                </div>
            </div>
        </div>
    )
}

export default ScrapingQueue
