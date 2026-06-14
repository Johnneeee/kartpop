import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { API_URL } from "./api.js";

function App() {
  const [kartpopData, setKartpopData] = useState([]);
  const [ssbData, setSsbData] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [population, setPopulation] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const mergedData = useMemo(
    () =>
      kartpopData.map((item, index) => ({
        ...item,
        population: population[index] ?? 0,
      })),
    [kartpopData, population]
  );

  const getRadius = (value) => {
    const max = 10000;
    const normalized = Math.min(value, max) / max;
    return 500 + Math.sqrt(normalized) * 7000;
  };

  const clearMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });

    markersRef.current = [];
  }, []);

  const drawMap = useCallback(() => {
    if (!mapInstanceRef.current) return;

    clearMarkers();

    mergedData.forEach((city) => {
      if (!city.population) return;

      const marker = L.circle([city.lat, city.long], {
        radius: getRadius(city.population),
        fillColor: "#3b82f6",
        color: "#000",
        weight: 1,
        fillOpacity: 0.7,
      }).addTo(mapInstanceRef.current);

      marker.bindTooltip(
        `
          <h3>${city.kommune}</h3>
          ${selectedLabel}: ${city.population}
        `,
        {
          direction: "top",
          opacity: 0.9,
        }
      );

      markersRef.current.push(marker);
    });
  }, [mergedData, selectedLabel, clearMarkers]);

  const fetchKommuneData = async () => {
    const res = await fetch(`${API_URL}/kartpop`);
    setKartpopData(await res.json());
  };

  const fetchSsbMetadata = async () => {
    const res = await fetch(
      "https://data.ssb.no/api/pxwebapi/v2/tables/09817/metadata?lang=no"
    );

    const json = await res.json();
    setSsbData(json?.dimension?.Landbakgrunn?.category?.label);
  };

  const fetchPopulationData = async (landbakgrunn) => {
    if (!kartpopData.length) return;

    const ssbIds = kartpopData.map((item) => item.ssbid).join(",");

    try {
      const res = await fetch(
        `https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=${landbakgrunn}`
      );

      const data = await res.json();
      setPopulation(data?.value ?? []);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKommuneData();
    fetchSsbMetadata();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([64.5, 10], 5);

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  return (
    <div className="app-container">
      {/* Control Panel */}
      <div className="control-panel">
        {/* Header */}
        <div className="control-header">
          Population Explorer
        </div>

        {/* Select */}
        {ssbData && (
          <select
            value={selectedKey}
            disabled={loading}
            onChange={(e) => {
              const key = e.target.value;

              setSelectedKey(key);
              setSelectedLabel(ssbData[key]);
              setLoading(true);

              fetchPopulationData(key).finally(() => {
                setLoading(false);
              });
            }}
            className={`control-select ${loading ? "disabled" : ""}`}
          >
            <option value="">Choose an option</option>
            {Object.entries(ssbData).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}

        {/* Info */}
        <div className="info-text">
          <div><b>Key:</b> {selectedKey || "—"}</div>
          <div><b>Value:</b> {selectedLabel || "—"}</div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-box">
            <span className="spinner" />
            Loading population…
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={mapRef} className="map-container" />
    </div>
  );
}

export default App;