import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Card,
    Typography,
    Chip,
    InputAdornment,
    IconButton,
    Paper,
    Stack,
    Fade,
    Button,
    Divider,
} from "@mui/material";
import { Search, MyLocation, Menu, Star, DirectionsCar, Close, Room } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Component to handle Map Panning
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

const LocationPage = () => {
    const [mapCenter, setMapCenter] = useState([29.7604, -95.3698]); // Default Houston
    const [searchText, setSearchText] = useState("");
    const [activeLocation, setActiveLocation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);

    const provider = new OpenStreetMapProvider();

    // 1. Search Logic: Convert Address to Coordinates
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchText) return;

        const results = await provider.search({ query: searchText });
        if (results && results.length > 0) {
            const { y: lat, x: lng, label } = results[0];
            setMapCenter([lat, lng]);
            setActiveLocation({ name: label.split(',')[0], address: label, lat, lng, type: 'Search Result' });
        } else {
            alert("Location not found. Please try a more specific address.");
        }
    };

    // 2. Current Location Logic
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setActiveLocation({ name: "Your Location", address: "Current GPS Position", lat: latitude, lng: longitude });
            },
            () => alert("Unable to retrieve your location. Check your browser permissions.")
        );
    };

    return (
        <Box sx={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>

            {/* MAP LAYER */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <MapContainer center={mapCenter} zoom={12} zoomControl={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                    <ChangeView center={mapCenter} />

                    {/* Main Selected Marker */}
                    {activeLocation && (
                        <Marker position={[activeLocation.lat, activeLocation.lng]}>
                            <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 1 }}>
                                <Typography variant="caption">{activeLocation.name}</Typography>
                            </Box>
                        </Marker>
                    )}

                    <ZoomControl position="bottomright" />
                </MapContainer>
            </Box>

            {/* FLOATING SEARCH BOX */}
            <Paper
                elevation={4}
                sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 1000,
                    width: { xs: "calc(100% - 40px)", sm: 400 },
                    borderRadius: "28px",
                    display: "flex",
                    alignItems: "center",
                    p: "4px 12px",
                    bgcolor: "rgba(255,255,255,0.98)",
                }}
            >
                <IconButton onClick={() => setShowSidebar(!showSidebar)}>
                    <Menu />
                </IconButton>
                <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
                    <TextField
                        fullWidth
                        placeholder="Search address or city..."
                        variant="standard"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        sx={{ ml: 1 }}
                    />
                    <IconButton type="submit">
                        <Search color="primary" />
                    </IconButton>
                </form>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <IconButton onClick={handleUseCurrentLocation}>
                    <MyLocation sx={{ color: "#1a73e8" }} />
                </IconButton>
            </Paper>

            {/* SIDEBAR RESULTS */}
            <Fade in={showSidebar}>
                <Paper
                    elevation={6}
                    sx={{
                        position: "absolute",
                        top: 90,
                        left: 20,
                        bottom: 20,
                        width: 400,
                        zIndex: 999,
                        borderRadius: "16px",
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <Box sx={{ p: 3, overflowY: "auto" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight={800}>Nearby Locations</Typography>
                            <IconButton size="small" onClick={() => setShowSidebar(false)}><Close /></IconButton>
                        </Box>

                        <Stack spacing={2}>
                            {/* Dynamic Search Result Card */}
                            {activeLocation && (
                                <Card sx={{ p: 2, bgcolor: "#e8f0fe", border: "1px solid #1a73e8", borderRadius: 3 }}>
                                    <Typography variant="overline" color="primary" fontWeight={700}>Selected</Typography>
                                    <Typography variant="subtitle1" fontWeight={700}>{activeLocation.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{activeLocation.address}</Typography>
                                    <Button fullWidth variant="contained" sx={{ mt: 2, borderRadius: 10 }}>View Vehicles Here</Button>
                                </Card>
                            )}

                            {/* Sample Quick Filters */}
                            <Stack direction="row" spacing={1} sx={{ overflowX: "auto", py: 1 }}>
                                <Chip icon={<DirectionsCar />} label="Rentals" onClick={() => { }} clickable />
                                <Chip icon={<Star />} label="Top Rated" onClick={() => { }} clickable />
                            </Stack>

                            <Typography variant="body2" color="text.secondary">Suggested in this area:</Typography>
                            <Card variant="outlined" sx={{ p: 2, borderRadius: 3, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}>
                                <Typography variant="subtitle2" fontWeight={700}>Main Street Terminal</Typography>
                                <Typography variant="caption" color="text.secondary">2.4 miles away • Open 24/7</Typography>
                            </Card>
                        </Stack>
                    </Box>
                </Paper>
            </Fade>

            {/* MOBILE CURRENT LOCATION BUTTON */}
            <IconButton
                onClick={handleUseCurrentLocation}
                sx={{
                    position: "absolute",
                    bottom: 30,
                    right: 20,
                    zIndex: 1000,
                    bgcolor: "white",
                    boxShadow: 3,
                    p: 2,
                    '&:hover': { bgcolor: '#f1f3f4' }
                }}
            >
                <MyLocation color="primary" />
            </IconButton>
        </Box>
    );
};

export default LocationPage;