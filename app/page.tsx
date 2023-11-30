import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Leaflet from "@/components/leaflet";
import Graph from "@/components/graph";
import { parseCSV } from "@/utils/csv_import";
import { inferGraphTypes } from "@/utils/csv_set_types";
import { AirbnbData } from "@/types/data";

type Props = {
  data: AirbnbData[]; // Using the AirbnbData type defined earlier
  error?: string;
};

export default async function Home() {
  const data: AirbnbData[] = inferGraphTypes(
    await parseCSV("data/airbnb_graph_data.csv")
  );
  return (
    <main className="flex flex-1 w-full p-4">
      <div className="w-1/3 flex justify-center">
        <Dialog>
          <DialogTrigger>
            <Button>Pick Month</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Graph with Month</DialogTitle>
              <DialogDescription>Insert Graph Here</DialogDescription>
              {data && <Graph data={data} />}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div id="map" className="w-2/3 z-[1]">
        <Leaflet center={[40.4041, -3.7601]} zoom={11} />
      </div>
    </main>
  );
}
