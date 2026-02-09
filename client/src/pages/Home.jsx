import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { searchCars } from "../redux/slice/carSlice";
import CarCard from "../components/cars/CarCard";
import {
  Box, Button, Container, Typography, Grid, Alert, Paper, Stack, Chip, Divider,
  LocationAutocomplete, RentalDatePicker, Select, Header, Footer, SmartAssistantWidget
} from "../components";
import { Search, Bolt, Verified, AttachMoney, SupportAgent, DirectionsCar, LocationOn, EventAvailable, Shield } from "@mui/icons-material";

const TYPES = [
  { label: "All types", value: "all" },
  { label: "Electric", value: "ev" },
  { label: "Luxury", value: "luxury" },
  { label: "Sedan", value: "sedan" },
];

const DEFAULT_HOUSTON = {
  id: "houston-tx-77001",
  primary: "Houston, TX 77001",
  subtitle: "Houston, Texas",
  raw: { address: { city: "Houston", state: "TX", postcode: "77001" } },
};

const getArea = (o) => {
  const a = o?.raw?.address || {};
  return {
    city: a.city || a.town || a.village || a.municipality || "",
    state: a.state || a.region || "",
    zip: String(a.postcode || "").match(/\b\d{5}\b/)?.[0] || "",
  };
};

export default function Home() {
  const dispatch = useDispatch();
  const { cars = [], loading, error } = useSelector((s) => s.cars || {});

  const [type, setType] = useState("all");
  const [pickup, setPickup] = useState(dayjs());
  const [drop, setDrop] = useState(dayjs().add(3, "day"));
  const [area, setArea] = useState(null);
  const [searched, setSearched] = useState(false);
  const [err, setErr] = useState("");
  const [locVal, setLocVal] = useState(DEFAULT_HOUSTON);
  const [locInput, setLocInput] = useState(DEFAULT_HOUSTON.primary);


  useEffect(() => {
    dispatch(searchCars({
      type: "all",
      location: "Houston, TX 77001",
      pickupDate: dayjs().format("MM/DD/YYYY"),
      returnDate: dayjs().add(30, "day").format("MM/DD/YYYY"),
    }));
    setSearched(false);
  }, [dispatch]);

  const datesValid = useMemo(() => !!pickup && !!drop && dayjs(drop).isAfter(pickup, "day"), [pickup, drop]);
  const canSearch = !!locVal && !!pickup && !!drop && !!type && datesValid;

  const handlePickup = (d) => {
    setPickup(d);
    if (d && !dayjs(drop).isAfter(d, "day")) setDrop(d.add(1, "day"));
  };

  const handleSearch = async () => {
    setErr("");
    if (!canSearch) return setErr("Please fill all 4 fields correctly (select a location suggestion + valid dates).");

    const a = getArea(locVal);
    setArea(a);

    const action = await dispatch(searchCars({
      type,
      location: [a.city, a.state, a.zip].filter(Boolean).join(", "),
      pickupDate: pickup.format("MM/DD/YYYY"),
      returnDate: drop.format("MM/DD/YYYY"),
    }));

    if (!searchCars.rejected?.match?.(action)) setSearched(true);
  };

  const searchCtx = area && {
    pickupLocation: [area.city, area.state, area.zip].filter(Boolean).join(", "),
    pickupDate: pickup.format("YYYY-MM-DD"),
    returnDate: drop.format("YYYY-MM-DD"),
    type,
  };

  const title = searched ? "Search Results" : "Browse Our Cars";
  const subtitle = searched && area
    ? `Showing cars for ${[area.city, area.state, area.zip].filter(Boolean).join(", ")}`
    : "Browse what we generally have, or search by location + dates for exact availability.";

  const perks = [
    { icon: <Bolt />, label: "Fast booking", color: "#7c4dff" },
    { icon: <Verified />, label: "Verified cars", color: "#1A237E" },
    { icon: <AttachMoney />, label: "Clear pricing", color: "#2E7D32" },
    { icon: <SupportAgent />, label: "24/7 support", color: "#d81b60" },
  ];

  const steps = [
    { icon: <DirectionsCar />, t: "Find the perfect car", d: "Browse options and pick what fits your trip." },
    { icon: <LocationOn />, t: "Select a pickup location", d: "Choose a city/ZIP suggestion in Texas." },
    { icon: <EventAvailable />, t: "Book & hit the road", d: "Confirm instantly and drive with confidence." },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f7fa" }}>
      <Header />

      {/* HERO */}
      <Box
        sx={{
          color: "white",
          py: { xs: 6.5, md: 9 },
          background: "linear-gradient(135deg, #0b1a66 0%, #1A237E 35%, #2E7D32 120%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            "&:before": {
              content: '""',
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,77,255,0.55), transparent 60%)",
              filter: "blur(25px)",
              top: -160,
              right: -150,
            },
            "&:after": {
              content: '""',
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(216,27,96,0.45), transparent 60%)",
              filter: "blur(28px)",
              bottom: -170,
              left: -170,
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Stack spacing={2} sx={{ mb: 3.5, alignItems: "center" }}>
            <Typography
              sx={{
                fontWeight: 1000,
                letterSpacing: -1,
                fontSize: { xs: 34, sm: 46, md: 58 },
                lineHeight: 1.05,
                textAlign: "center",
                width: "100%",
              }}
            >
              Your next drive, <span style={{ color: "#B2FF59" }}>simplified.</span>
            </Typography>

            {/* ✅ HARD CENTER FIX: width 100% + textAlign center + block */}
            <Typography
              component="div"
              sx={{
                width: "100%",
                textAlign: "center",
                display: "block",
                opacity: 0.95,
                maxWidth: 900,
                mx: "auto",
                fontSize: { xs: 14, md: 16 },
                lineHeight: 1.7,
              }}
            >
              DRIVEFLOW helps you find the right car in seconds — clear pricing, verified cars,
              and quick pickup across Texas.
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ width: "100%" }}>
              <Chip icon={<Verified />} label="Verified cars" sx={{ bgcolor: "#ffffff18", color: "white", border: "1px solid #ffffff22", fontWeight: 900 }} />
              <Chip icon={<Bolt />} label="Instant booking" sx={{ bgcolor: "#ffffff18", color: "white", border: "1px solid #ffffff22", fontWeight: 900 }} />
              <Chip icon={<Shield />} label="Secure checkout" sx={{ bgcolor: "#ffffff18", color: "white", border: "1px solid #ffffff22", fontWeight: 900 }} />
            </Stack>
          </Stack>

          {err && <Alert severity="warning" sx={{ maxWidth: 1100, mx: "auto", mb: 2 }}>{err}</Alert>}

          {/* SEARCH CARD */}
          <Paper
            elevation={0}
            sx={{
              maxWidth: 1100,
              mx: "auto",
              p: { xs: 2, md: 3 },
              borderRadius: 6,
              border: "1px solid #ffffff2a",
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.99))",
              boxShadow: "0 22px 44px rgba(0,0,0,0.25)",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", md: "nowrap" }, alignItems: "stretch" }}>
              <Box sx={{ flex: 3, minWidth: { xs: "100%", md: 280 } }}>
                <LocationAutocomplete
                  label="Pickup Location"
                  placeholder="City, ZIP, or Airport"
                  value={locVal}
                  inputValue={locInput}
                  onChange={setLocVal}
                  onInputChange={(e, v) => setLocInput(v)}
                  minChars={2}
                  limit={10}
                />
              </Box>

              <Box sx={{ flex: 1.2, minWidth: { xs: "100%", md: 220 } }}>
                <RentalDatePicker label="Pickup" value={pickup} onChange={handlePickup} minDate={dayjs()} />
              </Box>

              <Box sx={{ flex: 1.2, minWidth: { xs: "100%", md: 220 } }}>
                <RentalDatePicker label="Return" value={drop} onChange={setDrop} minDate={pickup.add(1, "day")} />
              </Box>

              <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 190 } }}>
                <Select label="Type" value={type} onChange={(e) => setType(e.target.value)} options={TYPES} />
              </Box>

              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!canSearch || loading}
                sx={{
                  height: 60,
                  minWidth: 80,
                  borderRadius: 3,
                  fontWeight: 950,
                  backgroundImage: "linear-gradient(135deg, #2E7D32 0%, #00C853 55%, #1A237E 140%)",
                  boxShadow: "0 14px 30px rgba(0,200,83,0.22)",
                  "&:hover": { filter: "brightness(1.05)" },
                  "&.Mui-disabled": { bgcolor: "#9e9e9e", color: "#fff" },
                }}
                aria-label="Search"
              >
                <Search />
              </Button>
            </Box>

            <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "text.secondary" }}>
              Tip: Choose a dropdown suggestion for best results.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* LISTING */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 }, flexGrow: 1 }}>
        <Stack spacing={0.8} mb={2.5}>
          <Typography variant="h4" fontWeight={1000} sx={{ letterSpacing: -0.6 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        </Stack>

        {/* ✅ ALL CARS FIRST */}
        {loading ? (
          <Typography>Loading cars…</Typography>
        ) : error ? (
          <Typography color="error">{String(error)}</Typography>
        ) : cars.length ? (
          <Grid container spacing={4}>
            {cars.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c._id}>
                <CarCard car={c} searchContext={searched ? searchCtx : null} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">No cars available.</Alert>
        )}

        {/* ✅ CONTEXT + HOW IT WORKS BELOW THE LIST */}
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: 6,
              border: "1px solid #e6e8ef",
              background:
                "linear-gradient(135deg, rgba(26,35,126,0.08) 0%, rgba(46,125,50,0.08) 45%, rgba(216,27,96,0.08) 100%)",
              boxShadow: "0 18px 35px rgba(20,30,60,0.10)",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                inset: -120,
                background:
                  "radial-gradient(circle at 20% 20%, rgba(124,77,255,0.22), transparent 40%), radial-gradient(circle at 80% 30%, rgba(46,125,50,0.18), transparent 45%), radial-gradient(circle at 60% 80%, rgba(216,27,96,0.18), transparent 45%)",
                filter: "blur(18px)",
                pointerEvents: "none",
              },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Stack spacing={1.2} sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight={950} sx={{ letterSpacing: -0.6, width: "100%" }}>
                  Why DRIVEFLOW?
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    maxWidth: 860,
                    mx: "auto",
                    textAlign: "center",
                    lineHeight: 1.7,
                    width: "100%",
                  }}
                >
                  Book in minutes with verified cars, clear pricing, and quick pickups across Texas.
                  No clutter. No confusion. Just drive.
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                  <Chip icon={<Shield />} label="Secure checkout" sx={{ bgcolor: "white", fontWeight: 900 }} />
                  <Chip icon={<Verified />} label="Trusted listings" sx={{ bgcolor: "white", fontWeight: 900 }} />
                  <Chip icon={<Bolt />} label="Instant booking" sx={{ bgcolor: "white", fontWeight: 900 }} />
                </Stack>
              </Stack>

              <Divider sx={{ my: 3, opacity: 0.6 }} />

              <Grid container spacing={2.5}>
                {perks.map((p) => (
                  <Grid item xs={12} sm={6} md={3} key={p.label}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.2,
                        borderRadius: 4,
                        bgcolor: "white",
                        borderColor: "#e6e8ef",
                        transition: "transform 160ms ease, box-shadow 160ms ease",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: "0 16px 28px rgba(20,30,60,0.12)" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2.5,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: `${p.color}18`,
                            color: p.color,
                          }}
                        >
                          {p.icon}
                        </Box>
                        <Typography fontWeight={950}>{p.label}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                        Built for speed, simplicity, and trust.
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h5" fontWeight={950} sx={{ mt: 4, textAlign: "center" }}>
                How it works
              </Typography>

              <Grid container spacing={2.5} sx={{ mt: 1 }}>
                {steps.map((s) => (
                  <Grid item xs={12} md={4} key={s.t}>
                    <Paper
                      sx={{
                        p: 2.6,
                        borderRadius: 4,
                        bgcolor: "rgba(255,255,255,0.88)",
                        border: "1px solid #ffffffaa",
                        boxShadow: "0 12px 26px rgba(20,30,60,0.10)",
                        transition: "transform 160ms ease",
                        "&:hover": { transform: "translateY(-3px)" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Box sx={{ color: "#1A237E" }}>{s.icon}</Box>
                        <Typography fontWeight={950}>{s.t}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                        {s.d}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
       <SmartAssistantWidget />
      <Footer />
    </Box>
  );
}
