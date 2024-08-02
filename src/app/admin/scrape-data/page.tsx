'use client'
import ScrapingQueue from '@/components/admin/scraping-queue/scraping-queue'
import { apiClient } from '@/lib'
import { Card, CardBody, Input, Listbox, ListboxItem } from '@nextui-org/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CurrentlyScrapingTable from './components/currently-scraping-table/currently-scraping-table'

const ScrapeData = () => {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await apiClient.get('/admin/job-details')
        setJobs(data.data.jobs)
      } catch (error) {
        console.error('Error fetching job details:', error)
      }
    }
    const interval = setInterval(() => getData(), 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const searchCities = async (searchString: string) => {
    try {
      const response = await axios.get(
        `https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=5&username=kishan&style=SHORT`
      )

      const parsed = await response.data?.geonames
      setCities(parsed?.map((city: { name: string }) => city.name) ?? [])
    } catch (error) {
      console.error('Error fetching city data:', error)
    }
  }

  const startScraping = async () => {
    await apiClient.post('/admin/create-job', {
      url: `https://packages.yatra.com/holidays/intl/search.htm?destination=${selectedCity}`,
      jobType: { type: "location" }
    })
    setCities([])
  }

  return (
    <section className="min-h-screen py-8 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div className="flex-1 md:w-2/3 lg:w-3/4">
          <Card className="w-full">
            <CardBody className="space-y-4 p-4">
              <Input
                type="text"
                label="Search for a location"
                onChange={(e) => searchCities(e.target.value)}
                className="w-full"
              />
              <div className="w-full">
                <Listbox onAction={(key) => setSelectedCity(key as string)}>
                  {cities.map((city) => (
                    <ListboxItem key={city}>{city}</ListboxItem>
                  ))}
                </Listbox>
              </div>
            </CardBody>
            <div className="p-4">
              {selectedCity && (
                <h1 className="text-lg font-semibold text-center mb-2">Scrape data for {selectedCity}</h1>
              )}
              <button
                onClick={startScraping}
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
              >
                Scrape
              </button>
            </div>
          </Card>
        </div>
        <div className="flex-1 md:w-1/3 lg:w-1/4">
          <ScrapingQueue />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1">
        <CurrentlyScrapingTable jobs={jobs} />
      </div>
    </section>
  )
}

export default ScrapeData
