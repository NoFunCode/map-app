"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import districts from "@/data/madrid-districts.json";
import { GeoJsonObject } from "geojson";

interface LeafletMapProps {
  center: L.LatLngExpression;
  zoom: number;
}

const Leaflet: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const showDistrictName = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
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
