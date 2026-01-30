import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography, Button, Container, Box, TextField, Grid, Stack, InputAdornment, Alert } from "@mui/material";
import { Search, LocationOn } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

import MuiSelect from "../components/common/Select";
import { RentalDatePicker } from "../components/common/DatePicker";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import CarCard from "../components/cars/CarCard";
import { searchCars } from "../redux/slice/carSlice";

/**
 * Types must match backend carController.js (ev/luxury/sedan/all)
 */
const Types = [
  { label: "All types", value: "all" },
  { label: "Electric", value: "ev" },
  { label: "Luxury", value: "luxury" },
  { label: "Sedan", value: "sedan" },
];

/**
 * Location helpers for Nominatim jsonv2
 */
const BAD_CATEGORIES = ["amenity", "tourism", "shop", "leisure", "building", "office", "man_made"];
const PLACE_TYPES = ["state", "city", "town", "village", "municipality", "suburb", "hamlet", "locality"];

const getZip = (addr) => String(addr?.postcode || "").match(/\b\d{5}\b/)?.[0] || "";
const getCity = (addr) => addr?.city || addr?.town || addr?.village || addr?.municipality || "";
const getState = (addr) => addr?.state || addr?.region || "";
const getDisplayName = (item) => (item?.display_name || "").split(",")[0]?.trim() || "";
const isZipQuery = (q) => /^\d{5}$/.test(String(q || "").trim());

function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

async function reverseLookupAddress(lat, lon, signal) {
  const rev = new URL("https://nominatim.openstreetmap.org/reverse");
  rev.searchParams.set("format", "jsonv2");
  rev.searchParams.set("addressdetails", "1");
  rev.searchParams.set("lat", String(lat));
  rev.searchParams.set("lon", String(lon));
  const r = await fetch(rev.toString(), { signal, headers: { Accept: "application/json" } });
  if (!r.ok) return null;
  const revData = await r.json();
  return revData?.address || null;
}

function makePrimarySubtitle(item, zipQuery) {
  const addr = item.address || {};
  const city = getCity(addr);
  const state = getState(addr);
  const zip = getZip(addr);
  const category = item.category || item.class; // jsonv2 fix

  let primary = "";
  if (zipQuery) primary = city ? `${city}, ${state} ${zip}`.trim() : `${state} ${zip}`.trim();
  else if (category === "place" && item.type === "state") primary = state || getDisplayName(item) || "State";
  else if (category === "aeroway" && item.type === "aerodrome") primary = getDisplayName(item) || "Airport";
  else primary = city ? `${city}, ${state}`.trim() : (state || getDisplayName(item) || "Location");

  const subtitle = [city, state, zip, "United States"].filter(Boolean).join(", ");
  return { primary, subtitle, zip };
}

function extractArea(option) {
  const addr = option?.raw?.address || {};
  return { city: getCity(addr), state: getState(addr), zip: getZip(addr) };
}

export default function Home() {
  const dispatch = useDispatch();
  const { cars = [], loading, error } = useSelector((state) => state.cars || {});

  const [selectTypes, setSelectTypes] = useState(Types[0].value);
  const [pickupDate, setPickupDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(3, "day"));

  // Location autocomplete
  const [pickupLocationValue, setPickupLocationValue] = useState(null);
  const [pickupLocationInput, setPickupLocationInput] = useState("");
  const debouncedPickupLocationInput = useDebouncedValue(pickupLocationInput, 350);
  const [pickupLocationOptions, setPickupLocationOptions] = useState([]);
  const [pickupLocationLoading, setPickupLocationLoading] = useState(false);
  const pickupAbortRef = useRef(null);

  const [selectedArea, setSelectedArea] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);
  const [formError, setFormError] = useState("");

  const handlePickupChange = (newDate) => {
    setPickupDate(newDate);
    if (newDate && (newDate.isAfter(returnDate) || newDate.isSame(returnDate, "day"))) setReturnDate(newDate.add(1, "day"));
  };

  // Location suggestions
  useEffect(() => {
    const q = debouncedPickupLocationInput.trim();
    if (q.length < 2) {
      setPickupLocationOptions([]);
      setPickupLocationLoading(false);
      return;
    }

    if (pickupAbortRef.current) pickupAbortRef.current.abort();
    const controller = new AbortController();
    pickupAbortRef.current = controller;

    const run = async () => {
      try {
        setPickupLocationLoading(true);
        const zipQuery = isZipQuery(q);

        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("countrycodes", "us");
        url.searchParams.set("limit", "25");
        url.searchParams.set("q", q);

        const res = await fetch(url.toString(), { signal: controller.signal, headers: { Accept: "application/json" } });
        const data = res.ok ? await res.json() : [];
        let list = Array.isArray(data) ? data : [];

        const getCategory = (item) => item.category || item.class;

        list = list.filter((item) => {
          const cat = getCategory(item);
          if (BAD_CATEGORIES.includes(cat)) return false;
          if (cat === "aeroway" && item.type === "aerodrome") return true;
          if (cat === "place" && PLACE_TYPES.includes(item.type)) return true;
          if (cat === "boundary" && item.type === "administrative") return true;
          if (item.type === "postcode") return true;
          return false;
        });

        if (zipQuery) {
          list = list.filter((item) => {
            const zip = getZip(item.address || {});
            return zip === q || item.type === "postcode";
          });

          for (let i = 0; i < Math.min(list.length, 3); i++) {
            const item = list[i];
            const addr = item.address || {};
            const city = getCity(addr);
            const zip = getZip(addr);
            if (!city && zip && item.lat && item.lon) {
              const revAddr = await reverseLookupAddress(item.lat, item.lon, controller.signal);
              if (revAddr) item.address = { ...addr, ...revAddr };
            }
          }
        }

        const score = (item) => {
          const cat = getCategory(item);
          if (cat === "place" && item.type === "city") return 120;
          if (cat === "place" && item.type === "town") return 115;
          if (cat === "place" && item.type === "village") return 110;
          if (cat === "place" && item.type === "state") return 105;
          if (cat === "aeroway" && item.type === "aerodrome") return 95;
          if (item.type === "postcode") return 90;
          if (cat === "boundary" && item.type === "administrative") return 80;
          return 10;
        };

        list.sort((a, b) => score(b) - score(a));
        list = list.slice(0, 10);

        const mapped = list.map((item) => {
          const { primary, subtitle, zip } = makePrimarySubtitle(item, zipQuery);
          return { id: String(item.place_id), raw: item, primary, subtitle, zip };
        });

        setPickupLocationOptions(mapped);
        setPickupLocationLoading(false);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setPickupLocationOptions([]);
          setPickupLocationLoading(false);
        }
      }
    };

    run();
    return () => controller.abort();
  }, [debouncedPickupLocationInput]);

  // Search triggers backend search API (no auto fetch)
  const handleSearch = async () => {
    setFormError("");

    if (!pickupLocationValue) return setFormError("Please select a Pickup Location from the suggestions.");
    if (!pickupDate || !returnDate) return setFormError("Please select Pickup and Return dates.");
    if (dayjs(returnDate).isSame(dayjs(pickupDate), "day") || dayjs(returnDate).isBefore(dayjs(pickupDate))) {
      return setFormError("Return Date must be after Pickup Date.");
    }

    const area = extractArea(pickupLocationValue);
    setSelectedArea(area);

    const locationStr = [area.city, area.state, area.zip].filter(Boolean).join(", ");

    await dispatch(
      searchCars({
        type: selectTypes,
        location: locationStr,
        pickupDate: dayjs(pickupDate).format("YYYY-MM-DD"),
        returnDate: dayjs(returnDate).format("YYYY-MM-DD"),
      })
    );

    setSearchClicked(true);
  };

  const searchSummary = useMemo(() => {
    if (!selectedArea) return "";
    return [selectedArea.city, selectedArea.state, selectedArea.zip].filter(Boolean).join(", ");
  }, [selectedArea]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ bgcolor: "#1A237E", py: 10, color: "white" }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
            Rent the future of driving.
          </Typography>

          {formError && <Alert severity="warning" sx={{ mb: 2 }}>{formError}</Alert>}

          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 6, border: "1px solid #ffffff33", maxWidth: 1100, mx: "auto", overflow: "hidden" }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, alignItems: "flex-start", width: "100%" }}>
              <Box sx={{ flex: 3, minWidth: { xs: "100%", md: 200 } }}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  fullWidth
                  options={pickupLocationOptions}
                  value={pickupLocationValue}
                  inputValue={pickupLocationInput}
                  onInputChange={(e, v) => setPickupLocationInput(v)}
                  onChange={(e, v) => setPickupLocationValue(v)}
                  loading={pickupLocationLoading}
                  filterOptions={(x) => x}
                  getOptionLabel={(o) => o?.primary || ""}
                  isOptionEqualToValue={(a, b) => a?.id === b?.id}
                  noOptionsText={debouncedPickupLocationInput.trim().length < 2 ? "Type your location..." : "No locations found"}
                  renderInput={(p) => (
                    <TextField
                      {...p}
                      helperText="Pickup Location"
                      placeholder="City, ZIP, or Airport"
                      sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                        "& .MuiInputBase-root": { height: 60, fontSize: "1.05rem" },
                        "& input": { py: "18px" },
                        "& .MuiAutocomplete-input": { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
                      }}
                      InputProps={{
                        ...p.InputProps,
                        startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: "gray" }} /></InputAdornment>,
                        endAdornment: <>
                          {pickupLocationLoading && <CircularProgress size={18} />}
                          {p.InputProps.endAdornment}
                        </>,
                      }}
                    />
                  )}
                  renderOption={(props, o) => (
                    <li {...props} key={o.id} style={{ padding: 12 }}>
                      <Typography fontWeight={800}>{o.primary}</Typography>
                      <Typography variant="body2" color="text.secondary">{o.subtitle}</Typography>
                    </li>
                  )}
                />
              </Box>

              <Box sx={{ flex: 1.4, minWidth: { xs: "100%", md: 230 } }}>
                <RentalDatePicker label="Pickup Date" value={pickupDate} onChange={handlePickupChange} minDate={dayjs()} />
              </Box>

              <Box sx={{ flex: 1.4, minWidth: { xs: "100%", md: 230 } }}>
                <RentalDatePicker label="Return Date" value={returnDate} onChange={setReturnDate} minDate={pickupDate?.add(1, "day")} />
              </Box>

              <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 170 } }}>
                <MuiSelect label="Types" value={selectTypes} onChange={(e) => setSelectTypes(e.target.value)} options={Types} required />
              </Box>

              <Box sx={{ width: { xs: "100%", md: 72 } }}>
                <Button fullWidth variant="contained" onClick={handleSearch} sx={{ height: 60, bgcolor: "#2E7D32", borderRadius: 2, "&:hover": { bgcolor: "#1b5e20" } }}>
                  <Search />
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Available for You</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          {!searchClicked ? "Enter your details and click Search to see available cars." : searchSummary ? `Showing cars for: ${searchSummary}` : "Showing cars for your search."}
        </Typography>

        {!searchClicked ? null : loading ? (
          <Typography>Loading cars...</Typography>
        ) : error ? (
          <Typography color="error">{String(error)}</Typography>
        ) : (
          <Grid container spacing={4}>
            {cars?.map((car) => (
              <Grid item key={car._id} xs={12} sm={6} md={4}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
