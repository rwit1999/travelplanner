import { DetailedItineraryType } from '@/types/trips';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Itinerary = ({ data }: { data: DetailedItineraryType[] }) => {
  const [currentDay, setCurrentDay] = useState(0);

  const handleNextDay = () => {
    if (currentDay < data.length - 1) {
      setCurrentDay(currentDay + 1);
    }
  };

  const handlePreviousDay = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousDay}
          disabled={currentDay === 0}
          className={`flex items-center p-2 bg-blue-500 text-white rounded-full shadow-md transition-colors duration-300 ${currentDay === 0 ? 'cursor-not-allowed bg-gray-300' : ''}`}
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
            <h1 className="text-xl font-bold">Day {currentDay + 1}</h1>
          </div>
        </div>
        <button
          onClick={handleNextDay}
          disabled={currentDay === data.length - 1}
          className={`flex items-center p-2 bg-blue-500 text-white rounded-full shadow-md transition-colors duration-300 ${currentDay === data.length - 1 ? 'cursor-not-allowed bg-gray-300' : ''}`}
        >
          <FaArrowRight className="text-xl" />
        </button>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200">
        <CardHeader className="bg-blue-100 p-4 rounded-t-lg">
          <h1 className="text-lg font-semibold text-gray-800">{data[currentDay]?.title}</h1>
        </CardHeader>
        <CardBody className="bg-white p-4 rounded-b-lg">
          <h2 className="text-gray-600 text-base leading-relaxed">{data[currentDay]?.value}</h2>
        </CardBody>
      </Card>
    </div>
  );
};

export default Itinerary;
