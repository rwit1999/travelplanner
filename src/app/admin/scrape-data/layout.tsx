import Sidebar from "@/components/admin/sidebar/sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className=" flex-grow p-6 bg-gray-100">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scrape data</h1>
          <p className="text-gray-600">The scraping engine is powered by Bright Data</p>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
