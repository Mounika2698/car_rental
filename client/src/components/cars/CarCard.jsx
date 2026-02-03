import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// ✅ Import wrappers from parent folder's index.js
// because CarCard is in: src/components/cars
// parent folder is: src/components
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
} from "..";

export default function CarCard({ car, searchContext }) {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    if (!car?._id) return;

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

  const chipLabel = String(car.type || "").toUpperCase();
  const chipColor = String(car.type || "").toLowerCase() === "ev" ? "success" : "primary";

  return (
    <Card
      sx={{
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
      }}
    >
      <CardMedia component="img" height="200" image={car.image} alt={car.name} />

      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {car.name}
          </Typography>
          <Chip label={chipLabel} size="small" color={chipColor} variant="outlined" />
        </Stack>

        {searchContext?.pickupLocation ? (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
            {searchContext.pickupLocation}
            {searchContext.pickupDate && searchContext.returnDate
              ? ` • ${dayjs(searchContext.pickupDate).format("MMM D")} → ${dayjs(searchContext.returnDate).format("MMM D")}`
              : ""}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Free cancellation • Instant confirmation
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, justifyContent: "space-between", borderTop: "1px solid #eee" }}>
        <Typography variant="h6" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
          ${car.price}
          <small>/day</small>
        </Typography>

        <Button
          variant="contained"
          sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#1A237E" }}
          onClick={handleBookNowClick}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
