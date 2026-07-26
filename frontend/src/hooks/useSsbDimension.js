import { useEffect, useState } from "react";
import { fetchDimensionLabels } from "../services/ssbApi.js";

/**
 * Loads the label map for one SSB table dimension (e.g. countries or age
 * groups). `extraOption` lets a caller prepend a synthetic entry that isn't
 * part of the raw SSB metadata (e.g. an aggregate "Norge" option).
 */
export function useSsbDimension(tableId, dimensionKey, extraOption) {
  const [labels, setLabels] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchDimensionLabels(tableId, dimensionKey)
      .then((data) => {
        if (cancelled) return;
        setLabels(extraOption ? { ...extraOption, ...data } : data);
      })
      .catch((err) => console.error(`Failed to fetch ${dimensionKey} metadata:`, err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId, dimensionKey]);

  return { labels, loading };
}