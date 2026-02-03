import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateAgreementPdf } from "../utils/generateAgreementPdf";
import { Box, Button, Container, Typography, TextField, Stack, Paper, Divider, Alert, Chip, InputAdornment, Card, 
  CardContent, CardActions, IconButton, useMediaQuery, Link, Table, TableHead, TableRow, TableCell, TableBody, Dialog,
  DialogTitle, DialogContent, Header, Footer, LocationAutocomplete } from "../components";

import { Badge, Person, Visibility, Replay, Cancel, Description } from "@mui/icons-material";

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
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 12, top: 10 }}>
          ✕
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box display="flex" gap={2} alignItems="center">
            <Box component="img" src={booking.car.imageUrl} alt={booking.car.makeModel}
              sx={{ width: 140, height: 90, borderRadius: 2, objectFit: "cover" }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{booking.car.makeModel}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Chip label={booking.car.type} size="small" />
                <Chip label={booking.status} size="small" color={statusChipColor(booking.status)} />
                <Chip label={booking.paymentStatus} size="small" color={paymentChipColor(booking.paymentStatus)} />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                Reservation: <b>{booking.reservationNumber}</b>
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Area ZIP: <b>{booking.zipCode}</b>
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography sx={{ fontWeight: 900 }}>Rental Duration</Typography>
            <Typography variant="body2">
              {new Date(booking.pickupDate).toLocaleDateString()} → {new Date(booking.returnDate).toLocaleDateString()} ({duration} days)
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 900 }}>Locations</Typography>
            <Typography variant="body2">Pickup: {booking.pickupLocation}</Typography>
            <Typography variant="body2">Return: {booking.returnLocation}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography sx={{ fontWeight: 900 }}>Cost Breakdown</Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Base</Typography>
              <Typography variant="body2">${booking.costBreakdown.base.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Fees</Typography>
              <Typography variant="body2">${booking.costBreakdown.fees.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontWeight: 900 }}>Total</Typography>
              <Typography sx={{ fontWeight: 900 }}>${booking.costBreakdown.total.toFixed(2)}</Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function ManageBooking() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [lastName, setLastName] = useState("");
  const [reservationNumber, setReservationNumber] = useState("");

  const [locationValue, setLocationValue] = useState(null);
  const [locationInput, setLocationInput] = useState("");

  const [msg, setMsg] = useState(null);
  const [results, setResults] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedZip = useMemo(() => {
    const addr = locationValue?.raw?.address || {};
    return String(addr?.postcode || "").match(/\b\d{5}\b/)?.[0] || "";
  }, [locationValue]);

  const selectedCity = useMemo(() => {
    const addr = locationValue?.raw?.address || {};
    return (addr?.city || addr?.town || addr?.village || locationValue?.primary || "").toLowerCase();
  }, [locationValue]);

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

    const areaFiltered = DUMMY_BOOKINGS.filter(
      (b) => b.zipCode === selectedZip && b.pickupLocation.toLowerCase().includes(selectedCity)
    );
    setResults(areaFiltered);
  }, [locationValue, selectedZip, selectedCity]);

  const handleSearch = () => {
    setMsg(null);
    if (!canSearch) return setMsg("ZIP is required. Pick a City/State/ZIP suggestion.");

    const ln = lastName.trim().toLowerCase();
    const rn = reservationNumber.trim().toUpperCase();

    const found = DUMMY_BOOKINGS.filter((b) =>
      b.lastName.toLowerCase() === ln &&
      b.reservationNumber.toUpperCase() === rn &&
      b.zipCode === selectedZip &&
      b.pickupLocation.toLowerCase().includes(selectedCity)
    );

    if (!found.length) return setMsg("No reservation found for that Last Name + Reservation + Area ZIP.");
    setResults(found);
    setMsg(`Found ${found.length} reservation(s).`);
  };

  const handleClear = () => {
    setLastName("");
    setReservationNumber("");
    setLocationValue(null);
    setLocationInput("");
    setMsg(null);
    setResults([]);
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

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
    navigate("/book", { state: booking });
  };

  const cancelReservation = (booking) => {
    if (booking.status !== "UPCOMING") return setMsg("Only UPCOMING reservations can be cancelled.");
    const ok = window.confirm("Are you sure you want to cancel this reservation?");
    if (!ok) return;

    setResults((prev) => prev.map((r) => (r.id === booking.id ? { ...r, status: "CANCELLED" } : r)));
    setMsg("Reservation cancelled (dummy update).");
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
              {msg && (
                <Alert severity={msg.includes("Found") ? "success" : "warning"} onClose={() => setMsg(null)}>
                  {msg}
                </Alert>
              )}

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Johnson"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Reservation Number"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  placeholder="e.g., DF123456"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <LocationAutocomplete
                label="City / State / ZIP (Required)"
                placeholder="e.g., Houston or 77001"
                value={locationValue}
                onChange={setLocationValue}
                inputValue={locationInput}
                onInputChange={(e, v) => setLocationInput(v)}
                minChars={2}
                limit={10}
              />

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between">
                <Button variant="contained" onClick={handleSearch} disabled={!canSearch}>
                  Find Reservation
                </Button>
                <Button variant="text" onClick={handleClear}>Clear</Button>
              </Stack>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Have an Account?{" "}
                <Link to="/login" sx={{ color: "#1A237E" }}>
                  Sign In.
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* Results */}
        <Box sx={{ mt: 3 }}>
          {results.length > 0 && (
            <Paper elevation={0} sx={{ borderRadius: 5, border: "1px solid #e6e8ef", bgcolor: "white", overflow: "hidden" }}>
              <Box sx={{ p: isMobile ? 2 : 3 }}>
                {!isMobile ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Car</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {results.map((b) => (
                        <TableRow key={b.id} hover>
                          <TableCell>
                            <Typography sx={{ fontWeight: 900 }}>{b.car.makeModel}</Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                              #{b.reservationNumber} • ZIP {b.zipCode}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip label={b.status} color={statusChipColor(b.status)} size="small" />
                          </TableCell>

                          <TableCell>
                            <Chip label={b.paymentStatus} color={paymentChipColor(b.paymentStatus)} size="small" />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton onClick={() => openDetails(b)}><Visibility /></IconButton>
                            <IconButton onClick={() => cancelReservation(b)} disabled={b.status !== "UPCOMING"}><Cancel /></IconButton>
                            <IconButton onClick={() => rebook(b)}><Replay /></IconButton>
                            <IconButton onClick={() => downloadAgreement(b)}><Description /></IconButton>
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
                          <Typography sx={{ fontWeight: 900 }}>{b.car.makeModel}</Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {new Date(b.pickupDate).toLocaleDateString()} → {new Date(b.returnDate).toLocaleDateString()}
                          </Typography>
                        </CardContent>

                        <CardActions>
                          <Button size="small" variant="outlined" onClick={() => openDetails(b)} startIcon={<Visibility />}>Details</Button>
                          <Button size="small" variant="outlined" onClick={() => downloadAgreement(b)} startIcon={<Description />}>Agreement</Button>
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
