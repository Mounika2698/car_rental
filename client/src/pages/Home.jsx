import { AppBar, Toolbar, Typography, Button, Container, Box, TextField, Grid, Card, CardMedia, CardContent, CardActions, Chip, Stack, InputAdornment } from "@mui/material";
import { Search, LocationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MuiSelect from "../components/common/Select";
import { useEffect, useMemo, useRef, useState } from "react";
import { RentalDatePicker } from "../components/common/DatePicker";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const FLEET = [
  { id: 1, name: "Tesla Model 3", type: "Electric", price: 89, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400" },
  { id: 2, name: "BMW X5", type: "Luxury SUV", price: 120, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400" },
  { id: 3, name: "Audi A4", type: "Sedan", price: 75, image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=400" },
];

const Types = [
  { label: "All types", value: "all" },
  { label: "Electric", value: "ev" },
  { label: "Luxury", value: "luxury" },
];

// ---------- helpers ----------
const BAD_CLASSES = ["amenity", "tourism", "shop", "leisure", "building", "office", "man_made"];

const getZip = (addr) => String(addr?.postcode || "").match(/\b\d{5}\b/)?.[0] || "";
const getCity = (addr) => addr?.city || addr?.town || addr?.village || addr?.municipality || "";
const getState = (addr) => addr?.state || addr?.region || "";
const getDisplayName = (item) => (item?.display_name || "").split(",")[0]?.trim() || "";

const isZipQuery = (q) => /^\d{5}$/.test(String(q || "").trim());

// Allow state too (Texas, New Jersey)
const PLACE_TYPES = ["state", "city", "town", "village", "municipality", "suburb", "hamlet", "locality"];

// Whitelist ONLY: place settlements + place state + boundary admin + postcode + airports(optional)
function isAllowedLocationResult(item) {
  if (BAD_CLASSES.includes(item.class)) return false;

  // airports (optional) — keep if you want airport suggestions in both pages
  if (item.class === "aeroway" && item.type === "aerodrome") return true;

  if (item.class === "place" && PLACE_TYPES.includes(item.type)) return true;

  // boundary/admin often represents a city/state in Nominatim
  if (item.class === "boundary" && item.type === "administrative") return true;

  // zip/postcode
  if (item.type === "postcode") return true;

  return false;
}

// ranking: states first when user types state, otherwise cities first
function scoreItem(item) {
  if (item.class === "place" && item.type === "state") return 120;
  if (item.class === "place" && item.type === "city") return 110;
  if (item.class === "place" && item.type === "town") return 105;
  if (item.class === "place" && item.type === "village") return 100;
  if (item.class === "place" && ["municipality", "suburb", "locality", "hamlet"].includes(item.type)) return 90;
  if (item.class === "aeroway" && item.type === "aerodrome") return 80;
  if (item.type === "postcode") return 75;
  if (item.class === "boundary" && item.type === "administrative") return 70;
  return 10;
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

  // primary line
  let primary = "";

  if (zipQuery) {
    // ZIP query => "Pearland, Texas 77584"
    primary = city ? `${city}, ${state} ${zip}`.trim() : `${state} ${zip}`.trim();
  } else if (item.class === "place" && item.type === "state") {
    primary = state || getDisplayName(item) || "State";
  } else if (item.class === "aeroway" && item.type === "aerodrome") {
    primary = getDisplayName(item) || "Airport";
  } else {
    // City typing => "Dallas, Texas" (zip optional)
    primary = city ? `${city}, ${state}`.trim() : (state || getDisplayName(item) || "Location");
  }

  const subtitle = [city, state, zip, "United States"].filter(Boolean).join(", ");
  return { primary, subtitle, zip };
}

function useDebouncedValue(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function extractArea(option) {
  const a = option?.raw?.address || {};
  const city = a.city || a.town || a.village || "";
  const state = a.state || a.region || "";
  const zip = String(a.postcode || "").match(/\b\d{5}\b/)?.[0] || "";
  return { city, state, zip };
}
// ---------------------------


export default function Home() {
  const navigate = useNavigate();
  const [selectTypes, setSelectTypes] = useState(Types[0].value);
  const [pickupDate, setPickupDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(3, "day"));

  // Location autocomplete state
  const [pickupLocationValue, setPickupLocationValue] = useState(null);
  const [pickupLocationInput, setPickupLocationInput] = useState("");
  const debouncedPickupLocationInput = useDebouncedValue(pickupLocationInput, 350);
  const [pickupLocationOptions, setPickupLocationOptions] = useState([]);
  const [pickupLocationLoading, setPickupLocationLoading] = useState(false);
  const pickupAbortRef = useRef(null);

  // selected area used to filter fleet listing (dummy behavior)
  const [selectedArea, setSelectedArea] = useState(null);

  const handlePickupChange = (newDate) => {
    setPickupDate(newDate);
    if (newDate && (newDate.isAfter(returnDate) || newDate.isSame(returnDate, "day"))) setReturnDate(newDate.add(1, "day"));
  };

  // Fetch location suggestions (HOME = broader like booking.com: airports + city + areas + ZIP typing)
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

      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      const data = res.ok ? await res.json() : [];
      let list = Array.isArray(data) ? data : [];

      // ✅ IMPORTANT: jsonv2 uses category (fallback to class if present)
      const getCls = (item) => item.category || item.class;

      // 1) whitelist only location-like results
      list = list.filter((item) => {
        const cls = getCls(item);

        if (BAD_CLASSES.includes(cls)) return false;

        // airports
        if (cls === "aeroway" && item.type === "aerodrome") return true;

        // places (city/town/state/etc)
        if (cls === "place" && PLACE_TYPES.includes(item.type)) return true;

        // boundary admin (often used for cities/states)
        if (cls === "boundary" && item.type === "administrative") return true;

        // ZIP
        if (item.type === "postcode") return true;

        return false;
      });

      // 2) ZIP mode (keep your perfect ZIP behavior)
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

      // 3) rank
      const score = (item) => {
        const cls = getCls(item);

        if (cls === "place" && item.type === "state") return 120;
        if (cls === "place" && item.type === "city") return 110;
        if (cls === "place" && item.type === "town") return 105;
        if (cls === "place" && item.type === "village") return 100;
        if (cls === "place" && ["municipality", "suburb", "locality", "hamlet"].includes(item.type)) return 90;
        if (cls === "aeroway" && item.type === "aerodrome") return 80;
        if (item.type === "postcode") return 75;
        if (cls === "boundary" && item.type === "administrative") return 70;
        return 10;
      };

      list.sort((a, b) => score(b) - score(a));
      list = list.slice(0, 10);

      // 4) map
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

  // Filter fleet list based on selected area (dummy logic) + type filter
  const filteredFleet = useMemo(() => {
    let base = [...FLEET];
    if (selectTypes === "ev") base = base.filter((c) => c.type.toLowerCase().includes("electric"));
    if (selectTypes === "luxury") base = base.filter((c) => c.type.toLowerCase().includes("luxury"));
    if (!selectedArea) return base;

    const city = (selectedArea.city || "").toLowerCase();
    const state = (selectedArea.state || "").toLowerCase();
    const zip = (selectedArea.zip || "").trim();

    if (city.includes("houston") || state.includes("texas") || zip.startsWith("77")) return base.filter((c) => c.type === "Electric" || c.type === "Sedan");
    if (state.includes("california") || zip.startsWith("94")) return base.filter((c) => c.type === "Electric");
    return base;
  }, [selectTypes, selectedArea]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "black", borderBottom: "1px solid #ddd" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1A237E" }}>
              DRIVE<span style={{ color: "#2E7D32" }}>FLOW</span>
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button color="inherit" onClick={() => navigate("/manage-bookings")}>Manage Bookings</Button>
              <Button variant="contained" sx={{ bgcolor: "#1A237E" }} onClick={() => navigate("/login")}>Sign In</Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Search Section */}
      <Box sx={{ bgcolor: "#1A237E", py: 10, color: "white" }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
            Rent the future of driving.
          </Typography>

          <Box sx={{ bgcolor: "white", p: 4, borderRadius: 6, backdropFilter: "blur(20px)", border: "1px solid #ffffff33" }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, alignItems: "flex-start" }}>
                {/* Pickup Location (BIG) */}
                <Box sx={{ flex: 3, minWidth: { xs: "100%", md: 200 } }}>
                  <Autocomplete
                    fullWidth
                    options={pickupLocationOptions}
                    value={pickupLocationValue}
                    inputValue={pickupLocationInput}
                    onInputChange={(e, val) => setPickupLocationInput(val)}
                    onChange={(e, val) => { setPickupLocationValue(val); if (val) setSelectedArea(extractArea(val)); }}
                    loading={pickupLocationLoading}
                    filterOptions={(x) => x}
                    getOptionLabel={(opt) => opt?.primary || ""}
                    isOptionEqualToValue={(a, b) => a?.id === b?.id}
                    noOptionsText={debouncedPickupLocationInput.trim().length < 2 ? "Type your location..." : "No locations found"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={undefined}
                        helperText="Pickup Location"
                        placeholder="City, ZIP, or Airport"
                        variant="outlined"
                        sx={{
                          bgcolor: "white",
                          borderRadius: 2,
                          "& .MuiInputBase-root": { height: 60, fontSize: "1.05rem" },
                          "& input": { paddingTop: "18px", paddingBottom: "18px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn sx={{ color: "gray" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {pickupLocationLoading ? <CircularProgress size={18} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id} style={{ padding: 12 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>{option.primary}</Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>{option.subtitle}</Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Box>

                {/* Pickup Date */}
                <Box sx={{ flex: 1.4, minWidth: { xs: "100%", md: 230 } }}>
                  <RentalDatePicker label="Pickup Date" value={pickupDate} onChange={handlePickupChange} minDate={dayjs()} />
                </Box>

                {/* Return Date */}
                <Box sx={{ flex: 1.4, minWidth: { xs: "100%", md: 230 } }}>
                  <RentalDatePicker label="Return Date" value={returnDate} onChange={(val) => setReturnDate(val)} minDate={pickupDate ? pickupDate.add(1, "day") : dayjs()} />
                </Box>

                {/* Types */}
                <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 170 } }}>
                  <MuiSelect label="Types" value={selectTypes} onChange={(e) => setSelectTypes(e.target.value)} options={Types} required />
                </Box>

                {/* Search Button */}
                <Box sx={{ width: { xs: "100%", md: 72 } }}>
                  <Button fullWidth variant="contained" sx={{ height: 60, minWidth: 60, bgcolor: "#2E7D32", borderRadius: 2, "&:hover": { bgcolor: "#1b5e20" } }}>
                    <Search />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Fleet Listing */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Available for You</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
          {selectedArea?.city || selectedArea?.zip
            ? `Showing cars for: ${[selectedArea.city, selectedArea.state, selectedArea.zip].filter(Boolean).join(", ")}`
            : "Choose a location to see availability for your area."}
        </Typography>

        <Grid container spacing={4}>
          {filteredFleet.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 4, transition: "0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 6 } }}>
                <CardMedia component="img" height="200" image={car.image} alt={car.name} />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="bold">{car.name}</Typography>
                    <Chip label={car.type} size="small" color={car.type === "Electric" ? "success" : "primary"} variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">Free cancellation • Instant confirmation</Typography>
                </CardContent>
                <CardActions sx={{ p: 2, justifyContent: "space-between", borderTop: "1px solid #eee" }}>
                  <Typography variant="h6" color="#2E7D32" fontWeight="bold">${car.price}<small>/day</small></Typography>
                  <Button variant="contained" sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#1A237E" }}>Book Now</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
