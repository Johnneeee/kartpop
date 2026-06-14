import { MapContainer, TileLayer } from "react-leaflet";

const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function Map() {
  return (
    <MapContainer
      center={[59.9139, 10.7522]} // Oslo by default
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url={OSM_URL}
        attribution="© OpenStreetMap contributors"
      />
    </MapContainer>
  );
}