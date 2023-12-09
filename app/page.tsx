// page.tsx
"use client";
import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseCSV } from "@/utils/csv_import";
import { AirbnbData } from "@/types/data";
import Graph from "@/components/graph";
import PullDownMenu from "@/components/ui/pullDownMenu";
import Leaflet from "@/components/leaflet";
import Papa from "papaparse"; // Import Leaflet directly

type Props = {
  data: AirbnbData[];
  error?: string;
};

let jsonData: AirbnbData[] = [];
export default function Home() {
  const [data, setData] = useState<AirbnbData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default to January

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchData = async () => {
  try {

    // eslint-disable-next-line @next/next/no-assign-module-variable
     const module = await import('@/data/airbnb_graph_data.csv');
      const jsonString = JSON.stringify(module.default);
      jsonData = JSON.parse(jsonString);

      setData(jsonData);

  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
};

  const handleMonthChange = (selectedMonth: string) => {
    const monthNumber = months.indexOf(selectedMonth) + 1; // Get the index and add 1 to get the month number
    // @ts-ignore
    setSelectedMonth(selectedMonth);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex flex-1 w-full p-4">
      <div className="w-1/3 flex justify-center" style={{ display: 'block' }}>
        <div style={{ display: 'block', marginBottom: '250px' }}>
          <h2>This is an app that lets you se the average prices of all accommodations of each zone in madrid</h2>
          <br/>
          <Dialog>
            <PullDownMenu
              months={months}
              onMonthChange={handleMonthChange}
            />
          </Dialog>
        </div>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Graph with Month</DialogTitle>
              <DialogDescription>
                {data && <Graph data={data} />}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
          <DialogTrigger asChild>
            <Button>View average price per month</Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div id="map" className="w-2/3 z-[1]">
        <Leaflet center={[40.4157, -3.7131]} zoom={12} selectedMonth={selectedMonth} />
      </div>
    </main>
  );
}
