import React from "react";
import { Box, Container, Typography, Button, Card, CardContent, TextField, Grid } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Home = () => {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            {/* HERO SECTION */}
            <Box sx={{ bgcolor: "#000", color: "#fff", py: 10 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Rent Your Perfect Car
                            </Typography>
                            <Typography variant="body1" color="gray" mb={4}>
                                Affordable, reliable and fast car rentals across the city.
                            </Typography>
                            <Button variant="contained" size="large">
                                Book Now
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="/car-hero.png"
                                alt="Car"
                                sx={{ width: "100%", borderRadius: 3, boxShadow: 4 }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* SEARCH SECTION */}
            <Container maxWidth="lg" sx={{ mt: -6 }}>
                <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth label="Location" />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" label="Pick-up Date" InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField fullWidth type="date" label="Drop-off Date" InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button fullWidth variant="contained" size="large" sx={{ height: "100%" }}>
                                    Search Cars
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>

            {/* FEATURES SECTION */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Grid container spacing={4}>
                    {[{
                        icon: <DirectionsCarIcon fontSize="large" />,
                        title: "Wide Range of Cars",
                        desc: "SUVs, Sedans, Luxury & more"
                    }, {
                        icon: <SecurityIcon fontSize="large" />,
                        title: "Secure Booking",
                        desc: "100% safe and secure payments"
                    }, {
                        icon: <LocationOnIcon fontSize="large" />,
                        title: "Multiple Locations",
                        desc: "Pick-up and drop anywhere"
                    }].map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ borderRadius: 3, textAlign: "center", py: 4 }}>
                                <CardContent>
                                    <Box mb={2}>{item.icon}</Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {item.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* FOOTER */}
            <Box sx={{ bgcolor: "#111", color: "#aaa", py: 3, textAlign: "center" }}>
                © {new Date().getFullYear()} Car Rental App. All rights reserved.
            </Box>
        </Box>
    );
};

export default Home;
