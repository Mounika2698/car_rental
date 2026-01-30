import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Typography, Button, Container, Box, TextField, Stack, Paper, Divider, Alert, Chip,
  InputAdornment, useMediaQuery, Autocomplete, CircularProgress, Card, CardContent, CardActions,
  Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import { LocationOn, Badge, Person, Visibility, Replay, Cancel, Description } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { generateAgreementPdf } from "../utils/generateAgreementPdf";

/**
 * Location helpers
 */
const BAD_CLASSES = ["amenity", "tourism", "shop", "leisure", "building", "office", "man_made"];
const PLACE_TYPES = ["state", "city", "town", "village", "municipality", "suburb", "hamlet", "locality"];

const getZip = (addr) => String(addr?.postcode || "").match(/\b\d{5}\b/)?.[0] || "";
const getCity = (addr) => addr?.city || addr?.town || addr?.village || addr?.municipality || "";
const getState = (addr) => addr?.state || addr?.region || "";
const getDisplayName = (item) => (item?.display_name || "").split(",")[0]?.trim() || "";
const isZipQuery = (q) => /^\d{5}$/.test(String(q || "").trim());

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
  const cls = item.category || item.class; // jsonv2 fix

  let primary = "";
  if (zipQuery) primary = city ? `${city}, ${state} ${zip}`.trim() : `${state} ${zip}`.trim();
  else if (cls === "place" && item.type === "state") primary = state || getDisplayName(item) || "State";
  else if (cls === "aeroway" && item.type === "aerodrome") primary = getDisplayName(item) || "Airport";
  else primary = city ? `${city}, ${state}`.trim() : (state || getDisplayName(item) || "Location");

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

function extractZipFromText(text) {
  const m = String(text || "").match(/\b\d{5}\b/);
  return m ? m[0] : "";
}

function statusChipColor(status) {
  if (status === "UPCOMING") return "primary";
  if (status === "PAST") return "default";
  if (status === "CANCELLED") return "error";
  return "default";
}
function paymentChipColor(status) {
  if (status === "PAID") return "success";
  if (status === "UNPAID") return "warning";
  if (status === "REFUNDED") return "default";
  return "default";
}
function daysBetween(a, b) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(Math.ceil(ms / (1000 * 60 * 60 * 24)), 1);
}

/**
 * Dummy bookings
 */
const DUMMY_BOOKINGS = [
  {
    id: 101, reservationNumber: "DF123456", lastName: "Johnson", zipCode: "77001",
    pickupLocation: "Houston, TX 77001", returnLocation: "Houston, TX 77001",
    pickupDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    returnDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    status: "UPCOMING", paymentStatus: "PAID", pricePerDay: 89, totalAmount: 267.0,
    car: { makeModel: "Tesla Model 3", type: "Electric", imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800" },
    addOns: ["GPS", "Child Seat"], insurance: ["Standard coverage"], costBreakdown: { base: 240, fees: 27, total: 267 },
  },
  {
    id: 102, reservationNumber: "DF888222", lastName: "Sanchez", zipCode: "77002",
    pickupLocation: "Houston, TX 77002", returnLocation: "Houston, TX 77002",
    pickupDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    returnDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "PAST", paymentStatus: "UNPAID", pricePerDay: 75, totalAmount: 225.0,
    car: { makeModel: "Audi A4", type: "Sedan", imageUrl: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800" },
    addOns: ["Additional Driver"], insurance: ["Basic coverage"], costBreakdown: { base: 210, fees: 15, total: 225 },
  },
  {
    id: 103, reservationNumber: "DF777111", lastName: "Patel", zipCode: "60601",
    pickupLocation: "Chicago, IL 60601", returnLocation: "Chicago, IL 60601",
    pickupDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    returnDate: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: "CANCELLED", paymentStatus: "REFUNDED", pricePerDay: 120, totalAmount: 360.0,
    car: { makeModel: "BMW X5", type: "Luxury SUV", imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800" },
    addOns: [], insurance: ["Premium coverage"], costBreakdown: { base: 330, fees: 30, total: 360 },
  },
];

function BookingDetailsModal({ open, onClose, booking }) {
  if (!booking) return null;
  const duration = daysBetween(booking.pickupDate, booking.returnDate);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>
        Reservation Details
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 12, top: 10 }}>✕</IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box display="flex" gap={2} alignItems="center">
            <Box component="img" src={booking.car.imageUrl} alt={booking.car.makeModel} sx={{ width: 140, height: 90, borderRadius: 2, objectFit: "cover" }} />
            <Box>
              <Typography variant="h6" fontWeight={900}>{booking.car.makeModel}</Typography>
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                <Chip label={booking.car.type} size="small" />
                <Chip label={booking.status} size="small" color={statusChipColor(booking.status)} />
                <Chip label={booking.paymentStatus} size="small" color={paymentChipColor(booking.paymentStatus)} />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>Reservation: <b>{booking.reservationNumber}</b></Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Area ZIP: <b>{booking.zipCode}</b></Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography fontWeight={900}>Rental Duration</Typography>
            <Typography variant="body2">
              {new Date(booking.pickupDate).toLocaleDateString()} → {new Date(booking.returnDate).toLocaleDateString()} ({duration} days)
            </Typography>
          </Box>

          <Box>
            <Typography fontWeight={900}>Locations</Typography>
            <Typography variant="body2">Pickup: {booking.pickupLocation}</Typography>
            <Typography variant="body2">Return: {booking.returnLocation}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography fontWeight={900}>Cost Breakdown (MVP)</Typography>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Base</Typography><Typography variant="body2">${booking.costBreakdown.base.toFixed(2)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography variant="body2">Fees</Typography><Typography variant="body2">${booking.costBreakdown.fees.toFixed(2)}</Typography></Stack>
            <Stack direction="row" justifyContent="space-between"><Typography fontWeight={900}>Total</Typography><Typography fontWeight={900}>${booking.costBreakdown.total.toFixed(2)}</Typography></Stack>
          </Box>

          <Box>
            <Typography fontWeight={900}>Add-ons</Typography>
            <Typography variant="body2" color="text.secondary">{(booking.addOns || []).length ? booking.addOns.join(", ") : "None"}</Typography>
          </Box>

          <Box>
            <Typography fontWeight={900}>Insurance</Typography>
            <Typography variant="body2" color="text.secondary">{(booking.insurance || []).length ? booking.insurance.join(", ") : "Standard coverage"}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography fontWeight={900}>Invoice</Typography>
            <Typography variant="body2" color="text.secondary">Invoice PDF coming soon. (MVP placeholder)</Typography>
          </Box>

          <Box>
            <Typography fontWeight={900}>QR Code</Typography>
            <Typography variant="body2" color="text.secondary">QR coming soon. (MVP placeholder)</Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function ManageBookings() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [lastName, setLastName] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");

  const [locationValue, setLocationValue] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const debouncedLocationInput = useDebouncedValue(locationInput, 350);

  const [locationOptions, setLocationOptions] = useState([]);
  const [locLoading, setLocLoading] = useState(false);

  const [msg, setMsg] = useState(null);

  const [results, setResults] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const abortRef = useRef(null);

  const selectedZip = useMemo(() => locationValue?.zip || extractZipFromText(locationInput), [locationValue, locationInput]);
  const selectedCity = useMemo(() => {
    const a = locationValue?.raw?.address || {};
    return (a.city || a.town || a.village || locationValue?.primary || "").toLowerCase();
  }, [locationValue]);

  // Location suggestions (same logic style as Home, jsonv2 safe)
  useEffect(() => {
    const q = debouncedLocationInput.trim();

    if (q.length < 2) {
      setLocationOptions([]);
      setLocLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const run = async () => {
      try {
        setLocLoading(true);
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

        const getCls = (item) => item.category || item.class;

        list = list.filter((item) => {
          const cls = getCls(item);
          if (BAD_CLASSES.includes(cls)) return false;
          if (cls === "aeroway" && item.type === "aerodrome") return true;
          if (cls === "place" && PLACE_TYPES.includes(item.type)) return true;
          if (cls === "boundary" && item.type === "administrative") return true;
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

        const mapped = list.map((item) => {
          const { primary, subtitle, zip } = makePrimarySubtitle(item, zipQuery);
          return { id: String(item.place_id), raw: item, primary, subtitle, zip };
        });

        setLocationOptions(mapped);
        setLocLoading(false);
      } catch (e) {
        if (e?.name !== "AbortError") {
          setLocationOptions([]);
          setLocLoading(false);
        }
      }
    };

    run();
    return () => controller.abort();
  }, [debouncedLocationInput]);

  const canSearch = useMemo(() => (
    lastName.trim().length >= 2 &&
    reservationNumber.trim().length >= 4 &&
    !!locationValue &&
    /^\d{5}$/.test(selectedZip)
  ), [lastName, reservationNumber, locationValue, selectedZip]);

  useEffect(() => {
    if (!locationValue || !/^\d{5}$/.test(selectedZip)) {
      setResults([]);
      return;
    }

    const zip = selectedZip;
    const city = selectedCity;

    const areaFiltered = DUMMY_BOOKINGS.filter((b) => b.zipCode === zip && b.pickupLocation.toLowerCase().includes(city));
    setResults(areaFiltered);
  }, [locationValue, selectedZip, selectedCity]);

  const handleSearch = () => {
    setMsg(null);
    if (!canSearch) return setMsg("ZIP is required. Pick a City/State/ZIP suggestion (no hotels/POIs).");

    const ln = lastName.trim().toLowerCase();
    const rn = reservationNumber.trim().toUpperCase();
    const zip = selectedZip;

    const found = DUMMY_BOOKINGS.filter((b) =>
      b.lastName.toLowerCase() === ln &&
      b.reservationNumber.toUpperCase() === rn &&
      b.zipCode === zip &&
      b.pickupLocation.toLowerCase().includes(selectedCity)
    );

    if (!found.length) return setMsg("No reservation found for that Last Name + Reservation + Area ZIP (MVP dummy data).");
    setResults(found);
    setMsg(`Found ${found.length} reservation(s).`);
  };

  const handleClear = () => {
    setLastName("");
    setReservationNumber("");
    setLocationValue(null);
    setLocationInput("");
    setLocationOptions([]);
    setMsg(null);
    setResults([]);
  };

  const openDetails = (booking) => { setSelectedBooking(booking); setDetailsOpen(true); };

  const downloadAgreement = (booking) => {
    generateAgreementPdf({
      booking,
      customer: {
        lastName: lastName.trim() || booking.lastName,
        reservationNumber: reservationNumber.trim() || booking.reservationNumber,
        pickupLocation: locationValue?.primary || "",
      },
    });
  };

  const rebook = (booking) => {
    navigate("/book", {
      state: {
        car: booking.car,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
      },
    });
  };

  const cancelReservation = (booking) => {
    if (booking.status !== "UPCOMING") return setMsg("Only UPCOMING reservations can be cancelled (MVP).");
    const ok = window.confirm("Are you sure you want to cancel this reservation? (MVP)");
    if (!ok) return;
    setResults((prev) => prev.map((r) => (r.id === booking.id ? { ...r, status: "CANCELLED" } : r)));
    setMsg("Reservation cancelled (MVP dummy update).");
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <Box sx={{ bgcolor: "#1A237E", py: isMobile ? 5 : 7, color: "white" }}>
        <Container maxWidth="lg">
          <Typography variant={isMobile ? "h4" : "h3"} textAlign="center" gutterBottom sx={{ fontWeight: 900 }}>
            Find Your Reservation
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ opacity: 0.9, maxWidth: 820, mx: "auto" }}>
            Enter Last Name, Reservation Number, and City/State/ZIP.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, pb: 4, flexGrow: 1 }}>
        <Paper elevation={0} sx={{ borderRadius: 5, border: "1px solid #e6e8ef", overflow: "hidden", bgcolor: "white" }}>
          <Box sx={{ p: isMobile ? 2.5 : 4 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={900}>Reservation Lookup</Typography>
                <Typography variant="body2" color="text.secondary">Manage Bookings lookup (MVP).</Typography>
              </Box>

              {msg && (
                <Alert severity={msg.includes("Found") ? "success" : msg.includes("cancelled") ? "info" : "warning"} onClose={() => setMsg(null)}>
                  {msg}
                </Alert>
              )}

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Johnson"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: "text.secondary" }} /></InputAdornment> }}
                />
                <TextField
                  fullWidth
                  label="Reservation Number"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  placeholder="e.g., DF123456"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: "text.secondary" }} /></InputAdornment> }}
                />
              </Stack>

              <Autocomplete
                fullWidth
                options={locationOptions}
                value={locationValue}
                inputValue={locationInput}
                onInputChange={(event, newInputValue) => setLocationInput(newInputValue)}
                onChange={(event, newValue) => setLocationValue(newValue)}
                loading={locLoading}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option?.primary || ""}
                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                noOptionsText={debouncedLocationInput.trim().length < 2 ? "Type City, State, or ZIP (e.g., 77001)" : "No locations found (try ZIP)"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City / State / ZIP (Required)"
                    placeholder="e.g., Houston or 77001"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: "text.secondary" }} /></InputAdornment>,
                      endAdornment: <>
                        {locLoading ? <CircularProgress size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </>,
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id} style={{ padding: 12 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }}>{option.primary}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{option.subtitle}</Typography>
                    </Box>
                  </li>
                )}
              />

              {locationValue && !/^\d{5}$/.test(selectedZip) && (
                <Alert severity="warning">ZIP is required. Please pick a suggestion that includes a ZIP (or type a ZIP).</Alert>
              )}

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#2E7D32", textTransform: "none", borderRadius: 2, height: 46, "&:hover": { bgcolor: "#1b5e20" } }}
                  onClick={handleSearch}
                  disabled={!canSearch}
                >
                  Find Reservation
                </Button>
                <Button variant="text" sx={{ textTransform: "none" }} onClick={handleClear}>Clear</Button>
              </Stack>

              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Have an Account?{" "}
                  <Typography component={Link} to="/login" variant="body2" sx={{ fontWeight: 900, color: "#1A237E", textDecoration: "none" }}>
                    Sign In.
                  </Typography>
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="MVP Lookup" size="small" variant="outlined" />
                <Chip label="Agreement PDF" size="small" variant="outlined" />
              </Stack>
            </Stack>
          </Box>
        </Paper>

        {/* Results */}
        <Box sx={{ mt: 3 }}>
          {results.length > 0 && (
            <Paper elevation={0} sx={{ borderRadius: 5, border: "1px solid #e6e8ef", bgcolor: "white", overflow: "hidden" }}>
              <Box sx={{ p: isMobile ? 2 : 3 }}>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>Reservations in this Area</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Auto-filtered by City + ZIP (dummy data).</Typography>

                {!isMobile ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Car</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell>Locations</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((b) => (
                        <TableRow key={b.id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box component="img" src={b.car.imageUrl} alt={b.car.makeModel} sx={{ width: 80, height: 52, borderRadius: 2, objectFit: "cover" }} />
                              <Box>
                                <Typography fontWeight={900}>{b.car.makeModel}</Typography>
                                <Chip label={b.car.type} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                                <Typography variant="caption" display="block" sx={{ color: "text.secondary", mt: 0.5 }}>
                                  #{b.reservationNumber} • ZIP {b.zipCode}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{b.pickupLocation}</Typography>
                            <Typography variant="body2" color="text.secondary">{b.returnLocation}</Typography>
                          </TableCell>

                          <TableCell><Chip label={b.status} color={statusChipColor(b.status)} size="small" /></TableCell>

                          <TableCell>
                            <Stack spacing={0.5}>
                              <Chip label={b.paymentStatus} color={paymentChipColor(b.paymentStatus)} size="small" />
                              <Typography fontWeight={900}>${Number(b.totalAmount).toFixed(2)}</Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton title="View Details" onClick={() => openDetails(b)}><Visibility /></IconButton>
                            <IconButton title="Cancel" onClick={() => cancelReservation(b)} disabled={b.status !== "UPCOMING"}><Cancel /></IconButton>
                            <IconButton title="Rebook" onClick={() => rebook(b)}><Replay /></IconButton>
                            <IconButton title="Download Agreement (PDF)" onClick={() => downloadAgreement(b)}><Description /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Stack spacing={2}>
                    {results.map((b) => (
                      <Card key={b.id} variant="outlined" sx={{ borderRadius: 4 }}>
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Box display="flex" gap={2}>
                              <Box component="img" src={b.car.imageUrl} alt={b.car.makeModel} sx={{ width: 120, height: 84, borderRadius: 2, objectFit: "cover" }} />
                              <Box flex={1}>
                                <Typography fontWeight={900}>{b.car.makeModel}</Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                  #{b.reservationNumber} • ZIP {b.zipCode}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                                  <Chip label={b.car.type} size="small" variant="outlined" />
                                  <Chip label={b.status} size="small" color={statusChipColor(b.status)} />
                                  <Chip label={b.paymentStatus} size="small" color={paymentChipColor(b.paymentStatus)} />
                                </Stack>
                              </Box>
                            </Box>

                            <Divider />

                            <Typography variant="body2"><b>Dates:</b> {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}</Typography>
                            <Typography variant="body2"><b>Pickup:</b> {b.pickupLocation}</Typography>
                            <Typography variant="body2"><b>Return:</b> {b.returnLocation}</Typography>
                            <Typography variant="body2"><b>Total:</b> ${Number(b.totalAmount).toFixed(2)}</Typography>
                          </Stack>
                        </CardContent>

                        <CardActions sx={{ px: 2, pb: 2, gap: 1, flexWrap: "wrap" }}>
                          <Button size="small" variant="outlined" onClick={() => openDetails(b)} startIcon={<Visibility />}>Details</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => cancelReservation(b)} disabled={b.status !== "UPCOMING"} startIcon={<Cancel />}>Cancel</Button>
                          <Button size="small" variant="outlined" onClick={() => rebook(b)} startIcon={<Replay />}>Rebook</Button>
                          <Button size="small" variant="outlined" onClick={() => downloadAgreement(b)} startIcon={<Description />}>Agreement PDF</Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          )}
        </Box>
      </Container>

      <Footer />

      <BookingDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} booking={selectedBooking} />
    </Box>
  );
}
