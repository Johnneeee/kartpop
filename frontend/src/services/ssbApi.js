const YEAR = "2026";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`SSB request failed (${res.status}): ${url}`);
  }
  return res.json();
}

/**
 * Fetches the label map for a dimension (e.g. "Landbakgrunn" or "Alder") from
 * a table's metadata endpoint. SSB tends to append a handful of aggregate/
 * summary categories at the end of the list, so we drop the last `dropLast`
 * entries by default.
 */
export async function fetchDimensionLabels(tableId, dimensionKey, { dropLast = 5 } = {}) {
  const json = await fetchJson(
    `https://data.ssb.no/api/pxwebapi/v2/tables/${tableId}/metadata?lang=no`
  );

  const labels = json?.dimension?.[dimensionKey]?.category?.label ?? {};
  const entries = Object.entries(labels);

  return Object.fromEntries(dropLast > 0 ? entries.slice(0, -dropLast) : entries);
}

/**
 * Generic population-by-region fetch, filtered by one extra dimension
 * (Landbakgrunn or Alder). This replaces the two separate, nearly-identical
 * fetch functions in the original component.
 */
export async function fetchPopulationByRegion({ tableId, regionIds, extraDimension, extraValue }) {
  const url =
    `https://data.ssb.no/api/pxwebapi/v2/tables/${tableId}/data` +
    `?lang=no&valuecodes[Contentscode]=Personer1` +
    `&valuecodes[Region]=${regionIds}` +
    `&valuecodes[Tid]=${YEAR}` +
    `&valuecodes[${extraDimension}]=${extraValue}`;

  const data = await fetchJson(url);
  return data?.value ?? [];
}

/**
 * Special case for "Norge" (Landbakgrunn = 1010): SSB only exposes the
 * immigrant-background share directly (Landbakgrunn=999 + AndelBefolkning),
 * so the Norwegian-born count is backed out from the total population and
 * that share.
 */
export async function fetchNorwayBornPopulation({ tableId, regionIds }) {
  const url =
    `https://data.ssb.no/api/pxwebapi/v2/tables/${tableId}/data` +
    `?lang=no&valuecodes[Contentscode]=Personer1,AndelBefolkning` +
    `&valuecodes[Region]=${regionIds}` +
    `&valuecodes[Tid]=${YEAR}` +
    `&valuecodes[Landbakgrunn]=999`;

  const data = await fetchJson(url);
  const values = data?.value ?? [];
  const result = [];

  for (let i = 0; i < values.length; i += 2) {
    const total = values[i];
    const immigrantShare = values[i + 1];
    result.push(immigrantShare ? Math.trunc((total / immigrantShare) * 100 - total) : null);
  }

  return result;
}