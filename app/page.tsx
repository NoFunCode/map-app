// page.tsx
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GraphData } from "@/types/data";
import Graph from "@/components/graph";
import MonthPicker from "@/components/monthPicker";

export default function Home() {
  const [data, setData] = useState<GraphData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default to January
  let jsonData: GraphData[] = [];
  const Leaflet = dynamic(() => import("@/components/leaflet"), {
    ssr: false,
  });

  const months = [
    "January 2024",
    "February 2024",
    "March 2024",
    "April 2024",
    "May 2024",
    "June 2024",
    "July 2024",
    "August 2024",
    "September 2024",
    "October 2024",
    "November 2024",
    "December 2024",
  ];

  const fetchData = async () => {
    try {
      // eslint-disable-next-line @next/next/no-assign-module-variable
      const module = await import("@/data/data_graph.csv");
      const jsonString = JSON.stringify(module.default);
      jsonData = JSON.parse(jsonString);

      setData(jsonData);
    } catch (error) {
      console.error("Error fetching or parsing CSV:", error);
    }
  };

  const handleMonthChange = (monthNumber: number) => {
    //const monthNumber = months.indexOf(selectedMonth) + 1; // Get the index and add 1 to get the month number
    // @ts-ignore
    setSelectedMonth(monthNumber);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="lg:flex lg:flex-1 w-full p-4">
      <div
        className="lg:w-1/3 flex justify-center lg:pe-2"
        style={{ display: "block" }}
      >
        <div className="mb-4">
          <h2>
            This is an app that lets you se the average prices of all
            accommodations of each zone in madrid
          </h2>
          <br />
          {data && <Graph data={data} />}
          <div className="mt-4">
            <MonthPicker
              months={months}
              onMonthChange={handleMonthChange}
              selectedMonth="January 2024"
            />
          </div>
        </div>
      </div>
      <div id="map" className="lg:w-2/3 z-[1] lg:ps-2 lg:h-auto h-96">
        <Leaflet
          center={[40.4157, -3.7131]}
          zoom={12}
          selectedMonth={selectedMonth}
        />
      </div>
    </main>
  );
}
