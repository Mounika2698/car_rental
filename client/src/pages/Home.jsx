import {
    AppBar, Toolbar, Typography, Button, Container, Box,
    TextField, Grid, Card, CardMedia, CardContent, CardActions,
    Chip, Stack
} from '@mui/material';
import {
    Search,
    LocationOn
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import MuiSelect from '../components/common/Select';
import { useState } from 'react';
import { RentalDatePicker } from "../components/common/DatePicker";
import dayjs from "dayjs";

const FLEET = [
    { id: 1, name: 'Tesla Model 3', type: 'Electric', price: 89, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400' },
    { id: 2, name: 'BMW X5', type: 'Luxury SUV', price: 120, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400' },
    { id: 3, name: 'Audi A4', type: 'Sedan', price: 75, image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=400' },
];
const Types = [
    { label: "All types", value: "all" },
    { label: "Electric", value: "ev" },
    { label: "Luxury", value: "luxury" },
];

export default function Home() {
    const navigate = useNavigate();
    const [selectTypes, setSelectTypes] = useState(Types[0].value)
    const [pickupDate, setPickupDate] = useState(dayjs());
    const [returnDate, setReturnDate] = useState(dayjs().add(3, 'day'));

    const handlePickupChange = (newDate) => {
        setPickupDate(newDate);

        // If new pickup is after or same as current return, move return to pickup + 1 day
        if (newDate && (newDate.isAfter(returnDate) || newDate.isSame(returnDate, 'day'))) {
            setReturnDate(newDate.add(1, 'day'));
        }
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Navbar */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'black', borderBottom: '1px solid #ddd' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A237E' }}>
                            DRIVE<span style={{ color: '#2E7D32' }}>FLOW</span>
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button color="inherit">Manage Bookings</Button>
                            <Button variant="contained" sx={{ bgcolor: '#1A237E' }} onClick={() => navigate("/login")}>Sign In</Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Search Section */}
            <Box sx={{ bgcolor: '#1A237E', py: 10, color: 'white' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                        Rent the future of driving.
                    </Typography>

                    <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 6, backdropFilter: 'blur(20px)', border: '1px solid #ffffff33' }}>
                        <Grid container spacing={2} alignItems="flex-start">
                            {/* Location Input */}
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Pickup Location"
                                    placeholder="City or Airport"
                                    variant="outlined"
                                    sx={{ bgcolor: 'white', borderRadius: 2 }}
                                    InputProps={{ startAdornment: <LocationOn sx={{ color: 'gray', mr: 1 }} /> }}
                                />
                            </Grid>

                            {/* REUSABLE PICKUP DATE */}
                            <Grid item xs={12} md={2.5}>
                                <RentalDatePicker
                                    label="Pickup Date"
                                    value={pickupDate}
                                    onChange={handlePickupChange}
                                    minDate={dayjs()}
                                />
                            </Grid>

                            {/* REUSABLE RETURN DATE */}
                            <Grid item xs={12} md={2.5}>
                                <RentalDatePicker
                                    label="Return Date"
                                    value={returnDate}
                                    onChange={(val) => setReturnDate(val)}
                                    minDate={pickupDate ? pickupDate.add(1, 'day') : dayjs()}
                                />
                            </Grid>

                            {/* Car Type Select */}
                            <Grid item xs={12} md={2.5}>
                                <Grid item xs={12} md={2.5}>
                                    <MuiSelect
                                        label="Types"
                                        value={selectTypes}
                                        onChange={(e) => setSelectTypes(e.target.value)}
                                        options={Types}
                                        required
                                    />
                                </Grid>
                            </Grid>

                            {/* Search Button */}
                            <Grid item xs={12} md={1.5}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ height: '56px', bgcolor: '#2E7D32', fontSize: '1.1rem', borderRadius: 2, '&:hover': { bgcolor: '#1b5e20' } }}
                                >
                                    <Search />
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* Fleet Listing */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Available for You</Typography>
                <Grid container spacing={4}>
                    {FLEET.map((car) => (
                        <Grid item key={car.id} xs={12} sm={6} md={4}>
                            <Card sx={{ borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                <CardMedia component="img" height="200" image={car.image} alt={car.name} />
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="bold">{car.name}</Typography>
                                        <Chip label={car.type} size="small" color={car.type === 'Electric' ? 'success' : 'primary'} variant="outlined" />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        Free cancellation • Instant confirmation
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid #eee' }}>
                                    <Typography variant="h6" color="#2E7D32" fontWeight="bold">
                                        ${car.price}<small>/day</small>
                                    </Typography>
                                    <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#1A237E' }}>
                                        Book Now
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}