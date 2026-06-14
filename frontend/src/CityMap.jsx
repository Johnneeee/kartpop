import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Adjust this if you already import `ikke` from somewhere else.
 * Expected shape:
 * [
 *   { name, lat, lon, vn, gb, fo, hr },
 *   ...
 * ]
 */
const ikke = [
  {
    name: "Halden",
    lat: "59.1226",
    lon: "11.3871",
    vn: "95",
    gb: "64",
    fo: "3",
    hr: "18",
    ph: "109"
  },
  {
    name: "Moss",
    lat: "59.434",
    lon: "10.659",
    vn: "958",
    gb: "161",
    fo: "8",
    hr: "82",
    ph: "237"
  }
]

const MAX = 10000;

function getRadius(value) {
  const normalized = Math.min(value, MAX) / MAX;
  return 500 + Math.sqrt(normalized) * 7000;
}

export default function CityMap({ ikke = [] }) {
  const [currentMode, setCurrentMode] = useState("vn");

  // Convert and sanitize data once
  const cities = useMemo(() => {
    return ikke.map((city) => ({
      ...city,
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lon),
      vn: parseInt(city.vn, 10) || 0,
      gb: parseInt(city.gb, 10) || 0,
      fo: parseInt(city.fo, 10) || 0,
      hr: parseInt(city.hr, 10) || 0,
    }));
  }, [ikke]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Controls */}
      <div style={{ marginBottom: 10 }}>
        <label>
          View:&nbsp;
          <select
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value)}
          >
            <option value="vn">VN</option>
            <option value="gb">GB</option>
            <option value="fo">FO</option>
            <option value="hr">HR</option>
          </select>
        </label>
      </div>

      {/* Map */}
      <MapContainer
        center={[64.5, 11]}
        zoom={5}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {cities.map((city, idx) => {
          const value = city[currentMode];

          // skip empty values (same behavior as your original code)
          if (!value) return null;

          return (
            <Circle
              key={idx}
              center={[city.lat, city.lng]}
              radius={getRadius(value)}
              pathOptions={{
                fillColor: "#3b82f6",
                color: "#000",
                weight: 1,
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div>
                  <strong>{city.name}</strong>
                  <br />
                  {currentMode}: {value.toLocaleString()}
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}