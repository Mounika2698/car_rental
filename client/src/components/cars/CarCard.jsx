// client/src/components/cars/CarCard.js
import React from "react";
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

/**
 * CarCard owns:
 * - UI
 * - Book Now navigation
 * - Passing search context (location/dates/type) to booking page via route state
 */
export default function CarCard({ car, searchContext }) {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    if (!car?._id) return;

    // Pass context to booking page (safe defaults)
    const ctx = searchContext
      ? {
          pickupLocation: searchContext.pickupLocation || "",
          pickupDate: searchContext.pickupDate || "",
          returnDate: searchContext.returnDate || "",
          type: searchContext.type || "",
        }
      : null;

    navigate(`/book/${car._id}`, { state: ctx });
  };

  if (!car) return null;

  // optional: show nice label if type is ev/luxury/sedan
  const chipLabel = String(car.type || "").toUpperCase();

  return (
    <Card sx={{ borderRadius: 4, transition: "0.3s", "&:hover": { transform: "translateY(-5px)", boxShadow: 6 } }}>
      <CardMedia component="img" height="200" image={car.image} alt={car.name} />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">{car.name}</Typography>
          <Chip label={chipLabel} size="small" color={String(car.type).toLowerCase() === "ev" ? "success" : "primary"} variant="outlined" />
        </Stack>

        {/* Optional: show search context mini-line if provided */}
        {searchContext?.pickupLocation ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {searchContext.pickupLocation}
            {searchContext.pickupDate && searchContext.returnDate
              ? ` • ${dayjs(searchContext.pickupDate).format("MMM D")} → ${dayjs(searchContext.returnDate).format("MMM D")}`
              : ""}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">Free cancellation • Instant confirmation</Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, justifyContent: "space-between", borderTop: "1px solid #eee" }}>
        <Typography variant="h6" color="#2E7D32" fontWeight="bold">
          ${car.price}<small>/day</small>
        </Typography>
        <Button variant="contained" sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#1A237E" }} onClick={handleBookNowClick}>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}