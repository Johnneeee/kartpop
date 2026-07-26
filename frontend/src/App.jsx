import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { useKartpopData } from "./hooks/useKartpopData.js";
import { useSsbDimension } from "./hooks/useSsbDimension.js";
import { useLeafletMap } from "./hooks/useLeafletMap.js";
import { DataSelect } from "./components/DataSelect.jsx";
import { fetchPopulationByRegion, fetchNorwayBornPopulation } from "./services/ssbApi.js";

const LANDBAKGRUNN_TABLE = "09817";
const ALDER_TABLE = "07459";
const NORGE_CODE = "1010";

function App() {
  const { data: kartpopData, loading: kartpopLoading } = useKartpopData();
  const { labels: landLabels, loading: landLoading } = useSsbDimension(
    LANDBAKGRUNN_TABLE,
    "Landbakgrunn",
    { [NORGE_CODE]: "Norge" }
  );
  const { labels: alderLabels, loading: alderLoading } = useSsbDimension(ALDER_TABLE, "Alder");

  const [selectedLand, setSelectedLand] = useState("");
  const [selectedAlder, setSelectedAlder] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [population, setPopulation] = useState([]);
  const [selectionLoading, setSelectionLoading] = useState(false);

  const loading = kartpopLoading || landLoading || alderLoading || selectionLoading;

  const mapContainerRef = useRef(null);
  const { drawCircles } = useLeafletMap(mapContainerRef);

  const regionIds = useMemo(
    () => kartpopData.map((item) => item.ssbid).join(","),
    [kartpopData]
  );

  const mergedData = useMemo(
    () =>
      kartpopData.map((item, index) => ({
        ...item,
        population: population[index] ?? 0,
      })),
    [kartpopData, population]
  );

  useEffect(() => {
    drawCircles(mergedData, selectedLabel);
  }, [mergedData, selectedLabel, drawCircles]);

  const loadPopulationByLand = async (landbakgrunn) => {
    if (!kartpopData.length) return;
    setSelectionLoading(true);

    try {
      const result =
        landbakgrunn === NORGE_CODE
          ? await fetchNorwayBornPopulation({ tableId: LANDBAKGRUNN_TABLE, regionIds })
          : await fetchPopulationByRegion({
              tableId: LANDBAKGRUNN_TABLE,
              regionIds,
              extraDimension: "Landbakgrunn",
              extraValue: landbakgrunn,
            });

      setPopulation(result);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    } finally {
      setSelectionLoading(false);
    }
  };

  const loadPopulationByAlder = async (alder) => {
    if (!kartpopData.length) return;
    setSelectionLoading(true);

    try {
      const result = await fetchPopulationByRegion({
        tableId: ALDER_TABLE,
        regionIds,
        extraDimension: "Alder",
        extraValue: alder,
      });

      setPopulation(result);
    } catch (err) {
      console.error("Failed to fetch population data:", err);
    } finally {
      setSelectionLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="control-panel">
        <DataSelect
          header="Etnisiter i Norge (ssb tabell 09817)"
          placeholder="Velg et land"
          options={landLabels}
          value={selectedLand}
          disabled={loading}
          sort="alpha"
          onChange={(key) => {
            setSelectedLand(key);
            setSelectedLabel(landLabels[key]);
            loadPopulationByLand(key);
          }}
        />

        <DataSelect
          header="Aldersgrupper i Norge (ssb tabell 07459)"
          placeholder="Velg alder"
          options={alderLabels}
          value={selectedAlder}
          disabled={loading}
          sort="numeric"
          onChange={(key) => {
            setSelectedAlder(key);
            setSelectedLabel(alderLabels[key]);
            loadPopulationByAlder(key);
          }}
        />

        {loading && (
          <div className="loading-box">
            <span className="spinner" />
            Laster inn data...
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}

export default App;
