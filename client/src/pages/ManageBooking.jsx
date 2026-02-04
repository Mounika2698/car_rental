import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchReservation, clearResults } from "../redux/slice/manageBookingSlice";
import { generateAgreementPdf } from "../utils/generateAgreementPdf";

import {
  Box, Button, Container, Typography, TextField, Stack, Paper, Divider, Alert,
  Chip, InputAdornment, Card, CardContent, CardActions, IconButton,
  useMediaQuery, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, Header, Footer, LocationAutocomplete
} from "../components";

import { Person, Badge, Visibility, Replay, Cancel, Description } from "@mui/icons-material";

/* helpers */
const statusColor = (s) => (s === "UPCOMING" ? "primary" : s === "CANCELLED" ? "error" : "default");
const payColor = (s) => (s === "PAID" ? "success" : s === "UNPAID" ? "warning" : "default");

const getArea = (v) => {
  const a = v?.raw?.address || {};
  return {
    zip: String(a.postcode || "").match(/\b\d{5}\b/)?.[0] || "",
    city: (a.city || a.town || a.village || "").toLowerCase(),
    state: (a.state || a.region || "").toUpperCase(),
  };
};

/* modal */
function BookingDetails({ open, onClose, b }) {
  if (!b) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 950 }}>
        Reservation Details
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 10, top: 10 }}>
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <Typography fontWeight={950}>{b.car?.makeModel || "Reservation"}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            #{b.reservationNumber} • ZIP {b.zipCode}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={b.status || "—"} size="small" color={statusColor(b.status)} />
            <Chip label={b.paymentStatus || "—"} size="small" color={payColor(b.paymentStatus)} />
            {b.car?.type ? <Chip label={b.car.type} size="small" /> : null}
          </Stack>

          <Divider />

          <Typography variant="body2">
            {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : "—"} →{" "}
            {b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "—"}
          </Typography>
          <Typography variant="body2">Pickup: {b.pickupLocation || "—"}</Typography>
          <Typography variant="body2">Return: {b.returnLocation || "—"}</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function ManageBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const { results = [], loading, error } = useSelector((s) => s.manageBooking || {});

  const [lastName, setLastName] = useState("");
  const [resNo, setResNo] = useState("");
  const [locVal, setLocVal] = useState(null);
  const [locInput, setLocInput] = useState("");
  const [msg, setMsg] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const area = useMemo(() => getArea(locVal), [locVal]);

  const canSearch =
    lastName.trim().length >= 2 &&
    resNo.trim().length >= 4 &&
    /^\d{5}$/.test(area.zip) &&
    !!locVal;

  const resetFeedback = () => {
    setMsg(null);
    dispatch(clearResults());
  };

  const handleSearch = async () => {
    setMsg(null);
    if (!canSearch) return setMsg("Enter Last Name, Reservation Number, and choose a City/ZIP suggestion.");

    const action = await dispatch(
      searchReservation({
        lastName: lastName.trim(),
        reservationNumber: resNo.trim().toUpperCase(),
        location: area,
      })
    );

    if (searchReservation.rejected.match(action)) {
      return setMsg(action.payload || "No reservation found.");
    }

    const n = (action.payload?.results || []).length;
    setMsg(n ? `Found ${n} reservation(s).` : "No reservation found.");
  };

  const handleClear = () => {
    setLastName("");
    setResNo("");
    setLocVal(null);
    setLocInput("");
    setMsg(null);
    dispatch(clearResults());
  };

  const openDetails = (b) => {
    setSelected(b);
    setDetailsOpen(true);
  };

  const downloadAgreement = (b) => {
  const safeBooking = {
    ...b,
    car: b?.car || { makeModel: "Vehicle", type: "", imageUrl: "" },
    pickupLocation: b?.pickupLocation || locVal?.primary || "",
    returnLocation: b?.returnLocation || b?.pickupLocation || "",
    zipCode: b?.zipCode || area.zip || "",
  };
   generateAgreementPdf({
    booking: safeBooking,
    customer: {
      lastName: lastName.trim() || safeBooking.lastName || "",
      reservationNumber: resNo.trim() || safeBooking.reservationNumber || "",
      pickupLocation: locVal?.primary || safeBooking.pickupLocation || "",
    },
  });
};

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* HERO */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          color: "white",
          background: "linear-gradient(135deg, #0b1a66 0%, #1A237E 40%, #2E7D32 140%)",
        }}
      >
        <Container>
          <Typography variant={isMobile ? "h4" : "h3"} textAlign="center" fontWeight={1000}>
            Find Your Reservation
          </Typography>
          <Typography textAlign="center" sx={{ opacity: 0.9, maxWidth: 720, mx: "auto", mt: 1 }}>
            Enter Last Name, Reservation Number, and City/State/ZIP.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, pb: 4, flexGrow: 1 }}>
        {/* SEARCH CARD */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 6,
            border: "1px solid #e6e8ef",
            background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.99))",
            boxShadow: "0 22px 44px rgba(0,0,0,0.12)",
          }}
        >
          <Stack spacing={2}>
            {msg && (
              <Alert severity={msg.includes("Found") ? "success" : "warning"} onClose={() => setMsg(null)}>
                {msg}
              </Alert>
            )}
            {error && <Alert severity="error">{String(error)}</Alert>}

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); resetFeedback(); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              />
              <TextField
                label="Reservation Number"
                value={resNo}
                onChange={(e) => { setResNo(e.target.value); resetFeedback(); }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
              />
            </Stack>

            <LocationAutocomplete
              label="City / State / ZIP"
              placeholder="e.g., Houston or 77001"
              value={locVal}
              inputValue={locInput}
              onChange={(v) => { setLocVal(v); resetFeedback(); }}
              onInputChange={(e, v) => setLocInput(v)}
              minChars={2}
              limit={10}
            />

            <Divider />

            <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
              <Button variant="contained" disabled={!canSearch || loading} onClick={handleSearch}>
                {loading ? "Searching..." : "Find Reservation"}
              </Button>
              <Button variant="text" onClick={handleClear}>Clear</Button>
            </Stack>

            {!canSearch && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Tip: Select a dropdown suggestion for location (ZIP must be present).
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* RESULTS */}
        {!!results.length && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 6,
              border: "1px solid #e6e8ef",
              bgcolor: "white",
              boxShadow: "0 18px 38px rgba(20,30,60,0.12)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
              {!isMobile ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Car</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {results.map((b) => (
                      <TableRow key={b._id || b.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 1000 }}>
                            {b.car?.makeModel || "Reservation"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                            #{b.reservationNumber} • ZIP {b.zipCode}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={b.status || "—"} color={statusColor(b.status)} size="small" />
                        </TableCell>

                        <TableCell>
                          <Chip label={b.paymentStatus || "—"} color={payColor(b.paymentStatus)} size="small" />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton onClick={() => openDetails(b)}><Visibility /></IconButton>
                          <IconButton onClick={() => navigate("/book", { state: b })}><Replay /></IconButton>
                          <IconButton onClick={() => downloadAgreement(b)}><Description /></IconButton>
                          <IconButton onClick={() => alert("Cancel will be enabled after DB hookup")} disabled={b.status !== "UPCOMING"}>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Stack spacing={2}>
                  {results.map((b) => (
                    <Card key={b._id || b.id} variant="outlined" sx={{ borderRadius: 4 }}>
                      <CardContent>
                        <Typography sx={{ fontWeight: 1000 }}>{b.car?.makeModel || "Reservation"}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          #{b.reservationNumber} • ZIP {b.zipCode}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                          <Chip label={b.status || "—"} size="small" color={statusColor(b.status)} />
                          <Chip label={b.paymentStatus || "—"} size="small" color={payColor(b.paymentStatus)} />
                        </Stack>
                      </CardContent>
                      <CardActions>
                        <Button size="small" variant="outlined" onClick={() => openDetails(b)} startIcon={<Visibility />}>
                          Details
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => downloadAgreement(b)} startIcon={<Description />}>
                          Agreement
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        )}
      </Container>

      <Footer />
      <BookingDetails open={detailsOpen} onClose={() => setDetailsOpen(false)} b={selected} />
    </Box>
  );
}
