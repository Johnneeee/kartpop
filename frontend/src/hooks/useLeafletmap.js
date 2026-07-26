import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAX_POPULATION_FOR_RADIUS = 10000;
const MIN_RADIUS = 500;
const MAX_EXTRA_RADIUS = 7000;
const NORWAY_CENTER = [64.5, 10];
const DEFAULT_ZOOM = 5;

function getRadius(value) {
  const normalized = Math.min(value, MAX_POPULATION_FOR_RADIUS) / MAX_POPULATION_FOR_RADIUS;
  return MIN_RADIUS + Math.sqrt(normalized) * MAX_EXTRA_RADIUS;
}

/**
 * Owns the Leaflet map instance lifecycle and exposes a single `drawCircles`
 * call to (re)render population markers, replacing the separate
 * clearMarkers/drawMap pair + two refs that lived in the component before.
 */
export function useLeafletMap(containerRef) {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView(NORWAY_CENTER, DEFAULT_ZOOM);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [containerRef]);

  const clearMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach((marker) => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];
  }, []);

  const drawCircles = useCallback(
    (cities, valueLabel) => {
      if (!mapInstanceRef.current) return;

      clearMarkers();

      cities.forEach((city) => {
        if (!city.population) return;

        const marker = L.circle([city.lat, city.long], {
          radius: getRadius(city.population),
          fillColor: "#3b82f6",
          color: "#000",
          weight: 1,
          fillOpacity: 0.7,
        }).addTo(mapInstanceRef.current);

        marker.bindTooltip(`<h3>${city.kommune}</h3>${valueLabel}: ${city.population}`, {
          direction: "top",
          opacity: 0.9,
        });

        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  return { drawCircles };
}