import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import districts from "@/data/madrid-districts.json";
import { GeoJsonObject } from "geojson";
import { diceCoefficient } from "dice-coefficient";
import PriceLegend from "./price-legend";

interface CsvEntry {
  month: number;
  price: number;
  region: string;
}

interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
  selectedMonth: number;
}

let jsonData: CsvEntry[] = [];

const Leaflet: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  selectedMonth,
}) => {
  const [entries, setEntries] = useState<CsvEntry[]>([]);
  const monthPullDownRef = useRef<number>(selectedMonth);

  function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const averagePrices = await import("@/data/average_prices.csv");
        const jsonString = JSON.stringify(averagePrices.default);
        jsonData = JSON.parse(jsonString);

        // Filter data based on the selected month and map to correct districts
        const dataForSelectedMonth = jsonData
          .filter((entry) => entry.month === selectedMonth)
          .map((entry) => ({
            ...entry,
            region: removeAccents(entry.region.trim().normalize()),
          }));

        setEntries(dataForSelectedMonth);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call the fetchData function
  }, [selectedMonth]);

  // Log 'entries' state after it has been updated
  useEffect(() => {}, [entries]);

  useEffect(() => {
    // Update monthPullDownRef whenever selectedMonth changes
    monthPullDownRef.current = selectedMonth;
  }, [selectedMonth]);

  const showDistrictName = (feature: any, layer: L.Layer) => {
    const nameFromMap = feature.properties.name.trim().normalize();
    console.log(monthPullDownRef.current);

    const tooltipContent = `<strong>${nameFromMap}</strong>`;

    if (layer) {
      layer.bindTooltip(tooltipContent, {
        permanent: true,
        direction: "center",
        className: "zone-tooltip",
      });

      layer.on({
        click: () => handleDistrictClick(nameFromMap, layer),
      });
    }
  };
  const getProsAndCons = (region: string): { pros: string; cons: string } => {
    let pros = "";
    let cons = "";

    switch (region) {
      case "Arganzuela":
        pros = "Riverside living, cultural diversity";
        cons = "Some areas may lack green spaces";
        break;

      case "Fuencarral-El Pardo":
        pros = "Green spaces, quiet residential areas";
        cons = "Limited nightlife and cultural amenities";
        break;

      case "Hortaleza":
        pros = "Family-friendly";
        cons = "Limited historical or cultural attractions";
        break;

      case "Barajas":
        pros = "Close to the airport, peaceful atmosphere";
        cons = "Limited shopping and entertainment options";
        break;

      case "Tetuan":
        pros = "Multicultural atmosphere, affordable housing";
        cons = "Some areas may lack green spaces";
        break;

      case "Chamartin":
        pros = "Well-connected, upscale neighborhoods";
        cons = "Higher cost of living";
        break;

      case "Moncloa-Aravaca":
        pros = "cultural institutions";
        cons = "Higher cost of living";
        break;

      case "Chamberi":
        pros = "Charming neighborhoods, cultural attractions";
        cons = "Higher cost of living";
        break;

      case "Salamanca":
        pros = "Upscale shopping, dining, and cultural amenities";
        cons = "High cost of living";
        break;

      case "San Blas":
        pros = "Diverse neighborhoods, good public transportation";
        cons = "Limited historical sites";
        break;

      case "Moratalaz":
        pros = "Quiet residential areas, good for families";
        cons = "Limited nightlife and cultural amenities";
        break;

      case "Latina":
        pros = "Affordable housing, vibrant local markets";
        cons = "Limited upscale amenities";
        break;

      case "Carabanchel":
        pros = "Affordable housing, cultural diversity";
        cons = "Some areas may lack green spaces";
        break;

      case "Usera":
        pros = "Cultural diversity, affordable housing";
        cons = "Limited upscale amenities";
        break;

      case "Puente de Vallecas":
        pros = "Affordable housing, diverse communities";
        cons = "Limited historical attractions";
        break;

      case "Villaverde":
        pros = "Affordable housing, green spaces";
        cons = "Limited cultural amenities";
        break;

      case "Vicálvaro":
        pros = "Affordable housing";
        cons = "Limited upscale amenities";
        break;

      case "Villa de Vallecas":
        pros = "Affordable housing, family-friendly neighborhoods";
        cons = "Limited cultural amenities";
        break;

      case "Ciudad Lineal":
        pros = "Diverse neighborhoods, good public transportation";
        cons = "Limited historical attractions";
        break;

      case "Centro":
        pros = "Cultural and historical heart of the city, vibrant nightlife";
        cons = "High cost of living, crowded";
        break;

      case "Retiro":
        pros = "Beautiful parks, upscale neighborhoods";
        cons = "Higher cost of living";
        break;

      default:
        pros = "No information available for this region";
        cons = "No information available for this region";
        break;
    }

    return { pros, cons };
  };

  const handleDistrictClick = (clickedDistrict: string, layer: L.Layer) => {
    setEntries((prevEntries) => {
      for (var entry of prevEntries) {
        if (
          entry.region === clickedDistrict ||
          (entry.region.startsWith(clickedDistrict) &&
            diceCoefficient(entry.region, clickedDistrict) > 0.5)
        ) {
          // Get pros and cons for the region
          const { pros, cons } = getProsAndCons(clickedDistrict);

          // Display popup with information, including pros and cons
          const popupContent = `
          Region: ${clickedDistrict}<br/>
          Month: ${entry.month}<br/>
          Average Price per Night: ${entry.price} €<br/>
          <br/>
          <strong>Pros:</strong> ${pros}<br/>
          <strong>Cons:</strong> ${cons}
        `;

          layer.bindPopup(popupContent);
          layer.openPopup();
        }
      }

      return prevEntries; // Return the updated entries
    });
  };

  const style = (feature: any) => {
    const districtName = feature.properties.name.trim().normalize();
    const entry = entries.find(
      (item) =>
        item.region === districtName ||
        (item.region.startsWith(districtName) &&
          diceCoefficient(item.region, districtName) > 0.5)
    );

    const color = entry ? getColor(entry.price) : "lightgray";

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const getColor = (price: number) => {
    switch (true) {
      case price > 1000:
        return "#063578";
      case price > 500:
        return "#0f4973";
      case price > 100:
        return "#306586";
      case price > 50:
        return "#66b5e5";
      default:
        return "#9ecae1";
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
        style={style}
        onEachFeature={showDistrictName}
      />
      <PriceLegend getColor={getColor} />
    </MapContainer>
  );
};

export default Leaflet;
