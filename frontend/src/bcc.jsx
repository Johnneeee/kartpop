import { useEffect, useRef, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Map from './Map'
import L from "leaflet";
import "leaflet/dist/leaflet.css";


function App() {
  const [kartpopData, setKartpopData] = useState(null);
  const [ssbData, setSsbData] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [population, setPopulation] = useState([]);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [currentMode, setCurrentMode] = useState("");


  function getRadius(value) {
    const max = 10000;
    const normalized = Math.min(value, max) / max;
    return 500 + Math.sqrt(normalized) * 7000;
  }

  function clearMarkers() {
    markersRef.current.forEach((m) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(m);
      }
    });
    markersRef.current = [];
  }

  function drawMap() {
    if (!mapInstanceRef.current) return;

    clearMarkers();
    let zippedData = [];

    if (Array.isArray(kartpopData) && Array.isArray(population) && kartpopData.length > 0) {
      zippedData = kartpopData.map((kart, index) => ({
        ...kart,
        population: population[index] ?? null,
      }));

      const finalJson = JSON.stringify(zippedData, null, 2);
      // console.log(finalJson);
      // console.log(population)
    }

    zippedData.forEach((city) => {
      const value2 = selectedKey;

      if (city.population == null || city.population == 0) return;

      const marker = L.circle([city.lat, city.long], {
        radius: getRadius(city.population),
        fillColor: "#3b82f6",
        color: "#000",
        weight: 1,
        fillOpacity: 0.7,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(`
        <h3>${city.kommune}</h3>
        ${selectedValue}: ${city.population}<br/>
      `);

      markersRef.current.push(marker);
    });
  }

  useEffect(() => {
    const fetchKommune = async () => {
      const res = await fetch("http://localhost:5000/kartpop");
      const json = await res.json();
      // console.log(json)
      setKartpopData(json);
    };

    const fetchLand = async () => {
      const res = await fetch("https://data.ssb.no/api/pxwebapi/v2/tables/09817/metadata?lang=no");
      const json = await res.json();
      const filtered = json?.dimension.Landbakgrunn.category.label;
      // console.log(filtered)
      setSsbData(filtered);
    };

    fetchKommune();
    fetchLand();
  }, []);
  
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([64.5, 10], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    drawMap(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); 

  // redraw when mode changes
  useEffect(() => {
    drawMap();
  }, [currentMode, selectedKey]);

  const callApi = async (key) => {
    const ssbIds = kartpopData.map(item => item.ssbid).join(",");
    try {
      const res = await fetch(`https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=${key}`);
      const data = await res.json();
      setPopulation(data?.value)
    } catch (err) {
      console.error("API error:", err);
    }
  };
  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      
      {/* 🔘 TOP CONTROLS (mode buttons + dropdown) */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          background: "white",
          padding: 10,
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "200px",
        }}
      >


        {/* Dropdown */}
        {ssbData && (
          <select
            value={selectedKey}
            onChange={(e) => {
              const key = e.target.value;
              callApi(key);
              setSelectedKey(key);
              setSelectedValue(ssbData[key]);
            }}
          >
            <option value="">Choose an option</option>
            {Object.entries(ssbData).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        )}

        {/* Debug display */}
        <div>
          <p>Key: {selectedKey}</p>
          <p>Value: {selectedValue}</p>
          <p>Mode: {currentMode}</p>
        </div>
      </div>

      {/* 🗺 MAP */}
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

export default App;