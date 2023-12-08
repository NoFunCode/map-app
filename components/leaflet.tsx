"use client";
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import districts from "@/data/madrid-districts.json";
import { GeoJsonObject } from "geojson";
import stringSimilarity from 'string-similarity';

interface CsvEntry {
  month: number;
  price: number;
  region: string;
}

interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
}

let jsonData: CsvEntry[] = [];

const Leaflet: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const [entries, setEntries] = useState<CsvEntry[]>([]);
    const [csvData, setCsvData] = useState<CsvEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line @next/next/no-assign-module-variable
        const module = await import('@/data/average_prices.csv');
        const jsonString = JSON.stringify(module.default);
        jsonData = JSON.parse(jsonString);

        setCsvData(jsonData);

        jsonData.forEach((entry: CsvEntry) => {
          const bestMatch = stringSimilarity.findBestMatch(entry.region.trim(), districts.features.map((feature: any) => feature.properties.name.trim()));
          entry.region = districts.features[bestMatch.bestMatchIndex].properties.name.trim();
        });

        jsonData.forEach((entry: CsvEntry) => {
          if (entry.month === 1) {
            setEntries(prevEntries => [...prevEntries, entry]);
          }
        });
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData();
  }, []);


  const showDistrictName = (feature: any, layer: L.Layer) => {
    const nameFromMap = feature.properties.name.trim();
    const tooltipContent = `<strong>${nameFromMap}</strong>`;

    if (layer) {
      layer.bindTooltip(tooltipContent, { permanent: true, direction: "center", className: "zone-tooltip" });

      layer.on({
        click: () => handleDistrictClick(nameFromMap, layer),
      });
    }
  };

  const handleDistrictClick = (clickedDistrict: string, layer: L.Layer) => {
    const month = 1;
    const bestMatch = stringSimilarity.findBestMatch(clickedDistrict, jsonData.map(entry => entry.region.trim()));
    const matchedEntry = jsonData[bestMatch.bestMatchIndex];

    if (bestMatch.bestMatch.rating > 0.5) {
      jsonData.forEach((entry, index) => {
        if (index === bestMatch.bestMatchIndex) {
          entry.region = clickedDistrict;
        }
      });

      const popupContent = `Region: ${clickedDistrict}<br/>Month: ${month}<br/>Price: ${matchedEntry.price}`;
      layer.bindPopup(popupContent);
      layer.openPopup();
    } else {
      layer.bindPopup(`Region: ${clickedDistrict}<br/>No data for Month ${month}`);
      layer.openPopup();
    }
  };

  const style = (feature: any) => {
    const districtName = feature.properties.name.trim();
    const entry = jsonData.find((item) => item.region.trim() === districtName);

    const color = entry ? getColor(entry.price) : 'lightgray';

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };

  const getColor = (price: number) => {
    return price > 1000
      ? '#063578'
      : price > 500
      ? '#0f4973'
      : price > 100
      ? '#306586'
      : price > 50
      ? '#66b5e5'
      : '#9ecae1';
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
        style={style}
        onEachFeature={showDistrictName}
      />
    </MapContainer>
  );
};

export default Leaflet;
