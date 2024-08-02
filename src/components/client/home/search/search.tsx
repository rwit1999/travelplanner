import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [dates, setDates] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [cities, setCities] = useState([]);

  const handleSearch = () => {
    if (searchLocation && dates) {
      router.push(`/trips?city=${searchLocation}&dates=${dates}`);
    }
  };

  const searchCities = async (searchString: string) => {
    try {
      const response = await axios.get(
        `https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=5&username=kishan&style=SHORT`
      );

      const parsed = await response.data?.geonames;
      setCities(parsed?.map((city: { name: string }) => city.name) ?? []);
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/bg-main.jpg")',
        height: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1rem",
      }}
    >
      <div className="bg-white bg-opacity-60 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-xl  mb-8 text-center text-gray-900">
          Plan Your Perfect Trip
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="location"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchLocation}
              onChange={(e) => {setSearchLocation(e.target.value); searchCities(e.target.value)}}
              className="p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter location"
            />
            <div className="w-full">
              <Listbox onAction={(key) => { setSearchLocation(key as string); setCities([])}}>
                {cities.map((city) => (
                  <ListboxItem key={city}>{city}</ListboxItem>
                ))}
              </Listbox>
            </div>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <Button
              onPress={handleSearch}
              className="w-full py-3 px-5 border border-transparent rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg font-semibold"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
