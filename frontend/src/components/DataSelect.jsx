function sortAlpha(entries) {
  return [...entries].sort(([, a], [, b]) => a.localeCompare(b, "no", { sensitivity: "base" }));
}

function sortNumeric(entries) {
  return [...entries].sort(([, a], [, b]) => parseInt(a, 10) - parseInt(b, 10));
}

/**
 * A labeled <select> populated from an SSB label map ({ code: label, ... }).
 * `sort` picks how options are ordered: "alpha" for country names,
 * "numeric" for age-group ranges (e.g. "0-4", "5-9").
 */
export function DataSelect({ header, options, value, placeholder, sort = "alpha", disabled, onChange }) {
  if (!options) return null;

  const entries = Object.entries(options);
  const sorted = sort === "numeric" ? sortNumeric(entries) : sortAlpha(entries);

  return (
    <>
      <div className="control-header">{header}</div>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`control-select ${disabled ? "disabled" : ""}`}
      >
        <option value="">{placeholder}</option>
        {sorted.map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}
