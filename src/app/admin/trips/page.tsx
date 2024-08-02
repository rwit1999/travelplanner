"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { TripType } from "@/types/trips";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CITIES", uid: "destinationItinerary" },
  { name: "PRICE", uid: "price", sortable: true },
];

export default function Trips() {
  const [trips, setTrips] = useState<TripType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/all-trips");
      if (response.data.trips) setTrips(response.data.trips);
    };
    fetchData();
  }, []);

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredTrips = trips;

    if (hasSearchFilter) {
      filteredTrips = filteredTrips.filter((trip) =>
        trip.id.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredTrips;
  }, [trips, hasSearchFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof TripType] as number;
      const second = b[sortDescriptor.column as keyof TripType] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (trip: TripType, columnKey: React.Key) => {
      const cellValue = trip[columnKey as keyof TripType];

      switch (columnKey) {
        case "id":
          return (
            <a href={`/trip/${cellValue}`} target="_blank" className="text-blue-500 underline">
              {cellValue as string}
            </a>
          );
        case "url":
          return (
            <a href={cellValue as string} target="_blank" className="text-blue-500 underline">
              {cellValue as string}
            </a>
          );
        case "destinationItinerary": {
          const colors = [
            "bg-blue-100",
            "bg-green-100",
            "bg-yellow-100",
            "bg-red-100",
          ];
          let currentIndex = 0;
          if (Array.isArray(cellValue)) {
            const itineraryValues = cellValue.slice(0, 4) as {
              place: string;
            }[];
            return (
              <div className="flex gap-2">
                {itineraryValues.map((value) => (
                  <span
                    key={value.place}
                    className={`px-2 py-1 rounded-full ${colors[currentIndex++ % colors.length]}`}
                  >
                    {value.place}
                  </span>
                ))}
              </div>
            );
          }
          return null; // Or handle the non-array case appropriately
        }
        case "price":
          return `₹${cellValue}`;
        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    setPage(1);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Search by package id..."
            value={filterValue}
            onChange={onSearchChange}
          />
          {filterValue && (
            <button
              className="ml-2 p-2 bg-red-500 text-white rounded-md"
              onClick={onClear}
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Total {trips.length} trips
          </span>
          <label className="flex items-center text-gray-600">
            Rows per page:
            <select
              className="ml-2 p-1 border rounded-md"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>

      {trips.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.uid} className="p-2 border-b">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item: TripType) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  {columns.map((column) => (
                    <td key={column.uid} className="p-2 border-b">
                      {renderCell(item, column.uid)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">
              {selectedKeys.size > 0
                ? `${selectedKeys.size} of ${filteredItems.length} selected`
                : `Total ${filteredItems.length} trips`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onPreviousPage}
                disabled={page === 1}
                className={`p-2 border rounded-md ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
              >
                Previous
              </button>
              <button
                onClick={onNextPage}
                disabled={page === pages}
                className={`p-2 border rounded-md ${page === pages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
