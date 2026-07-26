import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { API_URL } from "./api.js";

function App() {
  const [kartpopData, setKartpopData] = useState([]);
  const [ssbData, setSsbData] = useState(null);
  const [ssbDataAlder, setSsbDataAlder] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedAlder, setSelectedAlder] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedLabelAlder, setSelectedLabelAlder] = useState("");
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

    const labels = json?.dimension?.Landbakgrunn?.category?.label;

    const filtered = Object.fromEntries(
      Object.entries(labels).slice(0, -5)
    );
    setSsbData({
      1010: "Norge",
      ...filtered,
    });
  };

  const fetchSsbMetadataAlder = async () => {
    const res = await fetch(
      "https://data.ssb.no/api/pxwebapi/v2/tables/07459/metadata?lang=no"
    );

    const json = await res.json();

    const labels = json?.dimension?.Alder?.category?.label;

    const filtered = Object.fromEntries(
      Object.entries(labels).slice(0, -5)
    );
    console.log(filtered)
    setSsbDataAlder(filtered);
  };

  const fetchPopulationData = async (landbakgrunn) => {
    if (!kartpopData.length) return;

    const ssbIds = kartpopData.map((item) => item.ssbid).join(",");

    try {
      let result = [];

      if (landbakgrunn == 1010) { // if country is norway: do some calculations
        const res = await fetch(
          `https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1,AndelBefolkning&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=999`
        );
        const data = await res.json();
        const values = data.value;

        for (let i = 0; i < values.length; i += 2) {
          const num = values[i];
          const frac = values[i + 1];
          result.push(frac ? Math.trunc((num / frac * 100) - num) : null);
        }
      } else {
        const response = await fetch(
          `https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=${landbakgrunn}`
        );
        const data = await response.json();
        result = data?.value ?? [];
      }

      setPopulation(result);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    }

    setLoading(false);
  };

  const fetchPopulationDataAlder = async (alder) => {
    if (!kartpopData.length) return;

    const ssbIds = kartpopData.map((item) => item.ssbid).join(",");

    try {
      let result = [];
      const response = await fetch(
        `https://data.ssb.no/api/pxwebapi/v2/tables/07459/data?lang=no&valuecodes[Contentscode]=Personer1&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Alder]=${alder}`
      );
      const data = await response.json();
      result = data?.value ?? [];


      setPopulation(result);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        await Promise.all([
          fetchKommuneData(),
          fetchSsbMetadata(),
          fetchSsbMetadataAlder(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
          Etnisiter i Norge (ssb tabell 09817)
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
            <option value="">Velg et land</option>
            {Object.entries(ssbData)
              .sort(([, labelA], [, labelB]) => labelA.localeCompare(labelB, "no", { sensitivity: "base" }))
              .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}
        <div className="control-header">
          Aldersgrupper i Norge (ssb tabell 07459)
        </div>
        {ssbDataAlder && (
          <select
            value={selectedAlder}
            disabled={loading}
            onChange={(e) => {
              const alder = e.target.value;

              setSelectedAlder(alder);
              setSelectedLabel(ssbDataAlder[alder]);
              setLoading(true);

              fetchPopulationDataAlder(alder).finally(() => {
                setLoading(false);
              });
            }}
            className={`control-select ${loading ? "disabled" : ""}`}
          >
            <option value="">Velg alder</option>
              {Object.entries(ssbDataAlder)
                .sort(([, labelA], [, labelB]) => {
                  const numA = parseInt(labelA, 10);
                  const numB = parseInt(labelB, 10);
                  return numA - numB;
                })
                .map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
          </select>
        )}


        {loading && (
          <div className="loading-box">
            <span className="spinner" />
            Laster inn data...
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={mapRef} className="map-container" />
    </div>
  );
}

export default App;