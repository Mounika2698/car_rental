import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, TextField, Autocomplete, CircularProgress, InputAdornment, useDebouncedValue, LocationOn} from "../index";
import { LOCATIONS } from "../../data/locations";

/**
 * Local-only LocationAutocomplete
 * - NO backend
 * - NO API calls
 * - options derived from LOCATIONS list
 *
 * Option shape returned:
 * { id, primary, subtitle, zip, raw: { address: { city, state, postcode } } }
 */
export default function LocationAutocomplete({
  label = "City / State / ZIP",
  placeholder = "e.g., Houston or 77001",
  helperText = "",
  minChars = 2,
  limit = 10,

  value = null,
  onChange,

  inputValue: controlledInputValue,
  onInputChange: controlledOnInputChange,

  onAreaSelected,
}) {
  const isInputControlled = typeof controlledInputValue === "string";
  const [internalInputValue, setInternalInputValue] = useState("");

  const inputValue = isInputControlled ? controlledInputValue : internalInputValue;
  const debounced = useDebouncedValue(inputValue, 250);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Convert a row -> option shape used everywhere else
  const toOption = (row) => {
    const primary = `${row.city}, ${row.state} ${row.zip}`;
    return {
      id: `${row.city}-${row.state}-${row.zip}`,
      primary,
      subtitle: `${row.city}, ${row.state}`,
      zip: row.zip,
      raw: {
        address: {
          city: row.city,
          state: row.state,
          postcode: row.zip,
        },
      },
    };
  };

  const localSearch = useMemo(() => {
    return (q) => {
      const query = (q || "").trim().toLowerCase();
      if (!query) return [];

      const isZipQuery = /^\d{1,5}$/.test(query);

      const filtered = LOCATIONS.filter((r) => {
        const city = r.city.toLowerCase();
        const st = r.state.toLowerCase();
        const zip = String(r.zip);

        if (isZipQuery) return zip.startsWith(query);

        // flexible matching (hou, houston, tx, hou tx, etc.)
        return (
          city.includes(query) ||
          st === query ||
          `${city} ${st}`.includes(query) ||
          `${city},${st}`.includes(query) ||
          zip.startsWith(query)
        );
      });

      // Deduplicate exact combos and limit
      const seen = new Set();
      const uniq = [];

      for (const r of filtered) {
        const key = `${r.city}|${r.state}|${r.zip}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniq.push(r);
        }
        if (uniq.length >= limit) break;
      }

      return uniq.map(toOption);
    };
  }, [limit]);

  useEffect(() => {
    const q = (debounced || "").trim();

    if (q.length < minChars) {
      setOptions([]);
      setLoading(false);
      return;
    }

    // simulate a tiny "searching" state for UX (optional)
    setLoading(true);

    const t = setTimeout(() => {
      const results = localSearch(q);
      setOptions(Array.isArray(results) ? results : []);
      setLoading(false);
    }, 120);

    return () => clearTimeout(t);
  }, [debounced, minChars, localSearch]);

  const handleInputChange = (event, newVal) => {
    // Clear when input cleared
    if (!newVal) {
      setOptions([]);
      setLoading(false);
    }

    if (isInputControlled) {
      controlledOnInputChange?.(event, newVal);
    } else {
      setInternalInputValue(newVal);
      controlledOnInputChange?.(event, newVal);
    }
  };

  const noOptionsText = loading
    ? "Searching..."
    : (inputValue || "").trim().length < minChars
      ? `Type at least ${minChars} characters (e.g., Hou)`
      : "No locations found. Try ZIP (e.g., 77001).";

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(event, newValue) => {
        onChange?.(newValue);
        onAreaSelected?.(newValue);

        // If uncontrolled, set input to selection
        if (!isInputControlled && newValue?.primary) {
          setInternalInputValue(newValue.primary);
        }
      }}
      loading={loading}
      filterOptions={(x) => x} // don't re-filter server/local results
      getOptionLabel={(o) => o?.primary || ""}
      isOptionEqualToValue={(a, b) => a?.id === b?.id}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          sx={{
            mt: 0,
            bgcolor: "white",
            borderRadius: 2,
            "& .MuiInputBase-root": { height: 60, fontSize: "1.05rem" },
            "& input": { py: "18px" },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.id} style={{ padding: 12 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              {option.primary}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {option.subtitle}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
}
