import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Graph from "@/components/graph";
import { parseCSV } from "@/utils/csv_import";
import { inferGraphTypes } from "@/utils/csv_set_types";
import { AirbnbData } from "@/types/data";
import dynamic from "next/dynamic";

type Props = {
  data: AirbnbData[];
  error?: string;
};

export default async function Home() {
  const Leaflet = dynamic(() => import("@/components/leaflet"), {
    ssr: false,
  });

  const data: AirbnbData[] = inferGraphTypes(
    await parseCSV("data/airbnb_graph_data.csv")
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <main className="flex flex-1 w-full p-4">
      <div className="w-1/3 flex justify-center" style={{display: 'block'}}>
        <div style={{display: 'block', marginBottom: '400px'}}>
          <Dialog>
            <label htmlFor="months">Select a month:</label>
            <select id="months" name="months">
              {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
              ))}
            </select>
          </Dialog>
        </div>
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Graph with Month</DialogTitle>
              <DialogDescription>
                <label htmlFor="months">Select a month:</label>
                <select id="months" name="months">
                {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {data && <Graph data={data} />}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
          <DialogTrigger asChild>
            <Button>View average price per month based on zone</Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div id="map" className="w-2/3 z-[1]">
        <Leaflet center={[40.4157, -3.7131]} zoom={12} />
      </div>
    </main>
  );
}
