import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { createBooking } from "../services/bookingService";

export default function MyBooking() {
    const { carId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation(); 
    const [car, setCar] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(state?.location || "");
    const [pickupDate, setPickupDate] = useState(state?.pickupDate ? dayjs(state.pickupDate) : dayjs());
    const [returnDate, setReturnDate] = useState(state?.returnDate ? dayjs(state.returnDate) : dayjs().add(1, "day"));

    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const params = new URLSearchParams();
    if (state?.location) params.set("location", state.location);
    if (state?.pickupDate) params.set("pickupDate", state.pickupDate);
    if (state?.returnDate) params.set("returnDate", state.returnDate);

    const url = params.toString()
        ? `http://localhost:5001/api/cars/${carId}?${params.toString()}`
        : `http://localhost:5001/api/cars/${carId}`;

    axios
        .get(url)
        .then((res) => setCar(res.data))
        .catch(() => navigate("/"));
    }, [carId, navigate, state]);

    if (!car) return null;

    const totalDays =
        dayjs(returnDate).diff(dayjs(pickupDate), "day") + 1;
    const totalPrice = totalDays * car.price;

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            await createBooking({
                car: car._id,
                pickupLocation,
                pickupDate,
                returnDate,
                totalPrice,
                user: "TEMP_USER_ID", // Replace later
            });
            alert("Booking Confirmed!");
            navigate("/manage-bookings");
        } catch (err) {
            alert("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Car Info */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardMedia
                            component="img"
                            height="250"
                            image={car.image}
                            alt={car.name}
                        />
                        <CardContent>
                            <Typography variant="h5" fontWeight="bold">
                                {car.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {car.type}
                            </Typography>
                            <Typography mt={2} fontWeight="bold">
                               ${car.price} / day
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Booking Form */}
                <Grid item xs={12} md={7}>
                    <Stack spacing={3}>
                        <Typography variant="h4" fontWeight="bold">
                            Complete Your Booking
                        </Typography>

                        <TextField
                            label="Pickup Location"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="Pickup Date"
                            value={pickupDate.format("YYYY-MM-DD")}
                            onChange={(e) => setPickupDate(dayjs(e.target.value))}
                            fullWidth
                        />

                        <TextField
                            type="date"
                            label="Return Date"
                            value={returnDate.format("YYYY-MM-DD")}
                            onChange={(e) => setReturnDate(dayjs(e.target.value))}
                            fullWidth
                        />

                        <Typography variant="h6">
                            Total Price: <strong>${totalPrice}</strong>
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: "#1A237E" }}
                            onClick={handleConfirmBooking}
                            disabled={loading}
                        >
                            Confirm Booking
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}
