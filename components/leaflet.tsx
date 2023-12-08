"use client";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import districts from "@/data/madrid-districts.json";
import { GeoJsonObject } from "geojson";
import stringSimilarity from 'string-similarity';
import csvParser from "csv-parser";
import entry from "next/dist/server/typescript/rules/entry";

interface CsvEntry {
  month: number;
  price: number;
  region: string;
}

interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
}


let jsonData: CsvEntry[] = []; // Declare jsonData as a global variable

const Leaflet: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const [csvData, setCsvData] = useState<CsvEntry[]>([]);
  const [entries, setEntries] = useState<CsvEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Import CSV data directly
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = await import('@/data/average_prices.csv');
        // Convert CSV data to Blob
        const jsonString = JSON.stringify(module.default);
        jsonData = JSON.parse(jsonString); // Update the global jsonData variable

        // Log the JSON data to verify it
       // console.log(jsonData);

        // Set the parsed JSON data to the state
        setCsvData(jsonData);

        jsonData.forEach((entry: CsvEntry) => {
          if (entry.month === 1) {
            //console.log(`Region: ${entry.region}, Month: ${entry.month} Price: ${entry.price}`);
            setEntries(prevEntries => [...prevEntries, entry]);
          }
        });
      } catch (e) {
        console.log("error", e);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Run the effect only once on mount

useEffect(() => {
    // Log the global jsonData whenever it changes
    //console.log("jsonData globally accessible: ", jsonData);
  }, [jsonData]); // Run this effect whenever jsonData changes

const showDistrictName = (feature: any, layer: L.Layer) => {
  //this is before -- it needs to be after its populated
   //console.log("jsonData globally accessible: ", jsonData);
  const nameFromMap = feature.properties.name;
  //console.log("name from map " + nameFromMap);
  //console.log("region " + region + " month " + month + " price " + price);

  // Create a tooltip with the region name
  const tooltipContent = `<strong>${nameFromMap}</strong>`;

  // Bind tooltip to the layer if it exists
  if (layer) {
    layer.bindTooltip(tooltipContent, { permanent: true, direction: "center", className: "zone-tooltip" });

    layer.on({
      click: () => {
        const month = 1; // Set to the desired month
        const clickedDistrict = nameFromMap;

        // Find the entry for the clicked district and specified month with string similarity
        const bestMatch = stringSimilarity.findBestMatch(clickedDistrict, jsonData.map(entry => entry.region));
        const matchedEntry = jsonData[bestMatch.bestMatchIndex];

        if (bestMatch.bestMatch.rating > 0.5) {
          // Display the price information in a popup
          const popupContent = `Region: ${clickedDistrict}<br/>Month: ${month}<br/>Price: ${matchedEntry.price}`;
          layer.bindPopup(popupContent);
          layer.openPopup();
        } else {
          // No close match found
          layer.bindPopup(`Region: ${clickedDistrict}<br/>No data for Month ${month}`);
          layer.openPopup();
        }
      },
    });
  }
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