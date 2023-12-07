 "use client";
import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import districts from "@/data/madrid-districts.json";
import dataMap from "@/data/average_prices.csv"; // Import CSV file
import { GeoJsonObject } from "geojson";

interface CsvEntry {
  month: number;
  price: number;
  region: string;
}
interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
}

const Leaflet: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const [csvData, setCsvData] = useState<CsvEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the imported CSV data
        const csvString = dataMap; // Assuming dataMap is a string
        console.log("CSV string:", dataMap);

        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvString], { type: 'text/csv' });

        for (let i = 0; i < csvString.length; i++) {
          console.log(csvString.at(i));
        }

      } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
      }
    };

  // Call the fetchData function
  fetchData();
}, []); // Run the effect only once on mount

  const calculateAveragePrice = (month: number, region: string) => {
    console.log("moth: " + month + "region " + region);
    // Filter data for the specified month and region
    const filteredData = csvData.filter(
      (entry) => entry.month === month && entry.region === region
    );

    // Check if there is data for the specified month and region
    if (filteredData.length > 0) {
      // Calculate average price
      const averagePrice =
        filteredData.reduce((sum, entry) => sum + entry.price, 0) /
        filteredData.length;

      return averagePrice.toFixed(2); // Format to two decimal places
    } else {
      return "No data"; // Handle the case where there is no data for the specified month and region
    }
  };

  const showDistrictName = (feature: any, layer: L.Layer) => {
    const region = feature.properties.name;

    // Create a tooltip
    const tooltipContent = `<strong>${region}</strong>`;

    // Bind tooltip to the layer
    layer.bindTooltip(tooltipContent, { permanent: true, direction: "center", className: "zone-tooltip" });

    layer.on({
      click: () => {
        const month = 1; // Set to the desired month

        // Calculate average price
        const averagePrice = calculateAveragePrice(month, region);

        // Display in the popup
        layer.bindPopup(`Region: ${region}<br/>Average Price: $${averagePrice}`);
        layer.openPopup();
      },
    });
  };

  return (
    <MapContainer
      className="rounded-xl h-full"
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={districts as GeoJsonObject}
        onEachFeature={showDistrictName}
      />
    </MapContainer>
  );
};

export default Leaflet;