import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { API_URL } from "./api.js";

function App() {
  const [kommuneCoordinates, setKommuneCoordinates] = useState([]);
  const [totalPopulation, setTotalPopulation] = useState([]);
  const [countries, setCountries] = useState(null);

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [prosentandel, setProsentandel] = useState([]);
  const [population, setPopulation] = useState([]);

  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const mergedData = useMemo(
    () =>
      kommuneCoordinates.map((item, index) => ({
        ...item,
        population: population[index] ?? 0,
        prosentandel: prosentandel[index] ?? 0,
        totalPopulation: totalPopulation[index] ?? 0,
      })),
    [kommuneCoordinates, population, prosentandel, totalPopulation]
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
        // `
        //   <h3>${city.kommune}</h3>
        //   Alle: ${city.totalPopulation}<br>
        //   ${selectedCountry}: ${city.population}, ${city.prosentandel}%
        // `,
        `
          <h3>${city.kommune}</h3>
          Alle: ${city.totalPopulation}<br>
          ${selectedCountry}: ${city.population}
        `,
        {
          direction: "top",
          opacity: 0.9,
        }
      );

      markersRef.current.push(marker);
    });
  }, [mergedData, selectedCountry, clearMarkers]);

  const fetchKommuneCoordinates = async () => {
    const res = await fetch(`${API_URL}/kartpop`);
    const data = await res.json();
    setKommuneCoordinates(data);
    return data;
  };

  const fetchTotalPopulation = async (kommuneData) => {
    const ssbIds = kommuneData.map((item) => item.ssbid).join(",");
    const res = await fetch(`https://data.ssb.no/api/pxwebapi/v2/tables/01222/data?lang=no&valuecodes[Contentscode]=Folketallet11&valuecodes[Tid]=2026K1&valuecodes[Region]=${ssbIds}`);
    const json = await res.json();
    const values = json?.value;
    setTotalPopulation(values);
  };

  const fetchCountries = async () => {
    const res = await fetch(
      "https://data.ssb.no/api/pxwebapi/v2/tables/09817/metadata?lang=no"
    );
    const json = await res.json();
    const labels = json?.dimension?.Landbakgrunn?.category?.label;
    const filtered = Object.fromEntries(
      Object.entries(labels).slice(0, -5)
    );
    setCountries({
      1010: "Norge",
      ...filtered,
    });
  };

  const fetchPopulationData = async (landbakgrunn) => {
    if (!kommuneCoordinates.length) return;

    const ssbIds = kommuneCoordinates.map((item) => item.ssbid).join(",");
    try {
      let population = [];
      let prosentandel = [];

      if (landbakgrunn == 1010) { // if country is norway: do some calculations
        const res = await fetch(
          `https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1,AndelBefolkning&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=999`
        );
        const data = await res.json();
        const values = data.value;
        const pop = values.filter((_, i) => i % 2 === 0);
        const pro = values.filter((_, i) => i % 2 === 1)

        for (let i = 0; i < pop.length; i += 1) {
          population.push(totalPopulation[i] - pop[i]);
          prosentandel.push((100 - pro[i]).toFixed(2));
        }
        
      } else {
        const response = await fetch(
          `https://data.ssb.no/api/pxwebapi/v2/tables/09817/data?lang=no&valuecodes[Contentscode]=Personer1,AndelBefolkning&valuecodes[Region]=${ssbIds}&valuecodes[Tid]=2026&valuecodes[Landbakgrunn]=${landbakgrunn}`
        );
        const data = await response.json();
        const result = data?.value ?? [];
        population = result.filter((_, i) => i % 2 === 0);
        prosentandel = result.filter((_, i) => i % 2 === 1);
      }

      setPopulation(population);
      setProsentandel(prosentandel);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const kommuneData = await fetchKommuneCoordinates();
        await Promise.all([
          fetchCountries(),
          fetchTotalPopulation(kommuneData),
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
          Etnisiter i Norge (SSB tabell 09817) 2026
        </div>

        {/* Select */}
        {countries && (
          <select
            value={selectedKey}
            disabled={loading}
            onChange={(e) => {
              const key = e.target.value;

              setSelectedKey(key);
              setSelectedCountry(countries[key]);
              setLoading(true);

              fetchPopulationData(key).finally(() => {
                setLoading(false);
              });
            }}
            className={`control-select ${loading ? "disabled" : ""}`}
          >
            <option value="">Velg et land</option>
            {Object.entries(countries)
              .sort(([, labelA], [, labelB]) => labelA.localeCompare(labelB, "no", { sensitivity: "base" }))
              .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )}

        {/* Loading */}
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