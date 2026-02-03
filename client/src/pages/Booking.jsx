import React, { useState } from 'react';
import {
    Box, Container, Grid, Typography, TextField, Button, Paper, Divider,
    Stack, Checkbox, FormControlLabel, Radio, RadioGroup, IconButton,
    InputAdornment, Switch, CardMedia, Chip, Stepper, Step, StepLabel,
    Alert, Avatar, List, ListItem, ListItemIcon, ListItemText, Badge
} from '@mui/material';
import {
    LocalGasStation, AirlineSeatReclineNormal, Settings, Info,
    CreditCard, Lock, Event, LocationOn, CheckCircle, Security,
    PersonAdd, DirectionsCar, Receipt, Payment,
    CalendarToday, AccessTime, LocalOffer, VerifiedUser, Star,
    Shield,
    ChatBubbleOutline,
    PhoneInTalk
} from '@mui/icons-material';

const BookingPage = () => {
    // Mocking the data passed from the Fleet/Details page
    const selectedCar = {
        make: "Tesla",
        model: "Model Y",
        year: "2024",
        category: "Luxury SUV",
        image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800",
        features: { transmission: "Automatic", seats: 5, fuel: "Electric", mileage: "Unlimited" },
        amenities: ["GPS Navigation", "Bluetooth", "Autopilot", "Premium Audio", "Wireless Charging", "Heated Seats"],
        dailyRate: 115.00,
        rating: 4.8,
        reviews: 127,
        available: true
    };

    // State for dynamic features
    const [differentReturn, setDifferentReturn] = useState(false);
    const [insurance, setInsurance] = useState('standard');
    const [extras, setExtras] = useState({ childSeat: false, addDriver: false, gps: true, tollPass: true });

    // Calculations
    const rentalDays = 5;
    const insuranceCost = insurance === 'premium' ? 25 * rentalDays : 0;
    const extrasCost = (extras.childSeat ? 15 : 0) +
        (extras.addDriver ? 20 : 0) +
        (extras.gps ? 10 * rentalDays : 0) +
        (extras.tollPass ? 7.99 * rentalDays : 0);
    const totalAmount = (selectedCar.dailyRate * rentalDays) + insuranceCost + extrasCost + 45.50;

    const steps = ['Select Car', 'Booking Details', 'Payment', 'Confirmation'];

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl">
                {/* Progress Stepper */}
                {/* <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Stepper activeStep={1} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper> */}

                <Grid container spacing={4}>

                    {/* LEFT COLUMN: Main Booking Form */}
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={4}>

                            {/* Car Summary Card with More Details */}
                            <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', boxShadow: 3, border: '1px solid #e0e4ec' }}>
                                <Grid container>

                                    {/* LEFT SIDE: Visuals & Trust Signals (5 Units) */}
                                    <Grid item xs={12} md={5} sx={{ position: 'relative', bgcolor: '#fcfcfd', borderRight: '1px solid #eee' }}>
                                        {/* 1. Image Section */}
                                        <Box sx={{ position: 'relative', height: 320 }}>
                                            <CardMedia
                                                component="img"
                                                image={selectedCar.image}
                                                alt="Vehicle"
                                                sx={{ height: '100%', objectFit: 'cover' }}
                                            />
                                            <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                                                <Chip
                                                    label={selectedCar.available ? "Available" : "Unavailable"}
                                                    color={selectedCar.available ? "success" : "error"}
                                                    size="small"
                                                    sx={{ fontWeight: 700, px: 1 }}
                                                />
                                                <Chip
                                                    icon={<Star sx={{ fontSize: 16, color: '#ffb400 !important' }} />}
                                                    label={`${selectedCar.rating} (${selectedCar.reviews} reviews)`}
                                                    sx={{ bgcolor: 'white', fontWeight: 600 }}
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>

                                        {/* 2. Value Propositions (Fills the space below the image) */}
                                        <Box sx={{ p: 3 }}>
                                            <Typography variant="subtitle2" fontWeight="700" color="text.secondary" gutterBottom>
                                                WHY THIS CAR?
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 2 }}><Shield sx={{ color: '#2e7d32' }} /></Box>
                                                    <Typography variant="body2" fontWeight="500">Fully sanitized & safety inspected</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ bgcolor: '#e3f2fd', p: 1, borderRadius: 2 }}><CheckCircle sx={{ color: '#1976d2' }} /></Box>
                                                    <Typography variant="body2" fontWeight="500">Best price guarantee for {selectedCar.category}</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Grid>

                                    {/* RIGHT SIDE: Details & Features (7 Units) */}
                                    <Grid item xs={12} md={7} sx={{ p: 4, bgcolor: 'white' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Box>
                                                <Chip label={selectedCar.category} color="primary" size="small" sx={{ mb: 1.5, fontWeight: 700 }} />
                                                <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
                                                    {selectedCar.make} {selectedCar.model}
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary" fontWeight="400">
                                                    Model Year: {selectedCar.year}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h4" color="primary.main" fontWeight="800">
                                                    ${selectedCar.dailyRate}<Typography component="span" variant="h6">/day</Typography>
                                                </Typography>
                                                <Typography variant="caption" sx={{ bgcolor: '#f0f4f8', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 600 }}>
                                                    Estimated Total: ${(selectedCar.dailyRate * rentalDays).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        {/* Dynamic Grid for Features */}
                                        <Grid container spacing={2} sx={{ mt: 4 }}>
                                            {Object.entries(selectedCar.features).map(([key, value]) => (
                                                <Grid item xs={6} sm={3} key={key}>
                                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #f1f3f5' }}>
                                                        {key === 'transmission' && <Settings color="primary" sx={{ mb: 1 }} />}
                                                        {key === 'seats' && <AirlineSeatReclineNormal color="primary" sx={{ mb: 1 }} />}
                                                        {key === 'fuel' && <LocalGasStation color="primary" sx={{ mb: 1 }} />}
                                                        {key === 'mileage' && <DirectionsCar color="primary" sx={{ mb: 1 }} />}
                                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.65rem' }}>
                                                            {key}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="700">{value}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Divider sx={{ my: 4 }} />

                                        {/* Amenities Section */}
                                        <Typography variant="subtitle1" fontWeight="800" gutterBottom>
                                            Included Premium Amenities
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {selectedCar.amenities.map((item, index) => (
                                                <Grid item xs={12} sm={4} key={index}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <CheckCircle sx={{ fontSize: 18, color: '#4caf50' }} />
                                                        <Typography variant="body2" fontWeight="500">{item}</Typography>
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Paper>

                            {/* Enhanced Rental Period & Location */}
                            <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday color="primary" /> Rental Period & Location
                                </Typography>

                                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                    Free cancellation up to 48 hours before pickup. Flexible booking options available.
                                </Alert>

                                <Grid container spacing={3} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Pick-up Location"
                                            defaultValue="Houston Int. Airport (IAH)"
                                            InputProps={{
                                                startAdornment: <LocationOn color="primary" sx={{ mr: 1 }} />,
                                                readOnly: true
                                            }}
                                            variant="outlined"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
                                            Terminal A, Arrivals Level
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={differentReturn}
                                                    onChange={(e) => setDifferentReturn(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Return to different location"
                                        />
                                        {differentReturn && (
                                            <TextField
                                                fullWidth
                                                label="Return Location"
                                                placeholder="Enter drop-off city or airport"
                                                sx={{ mt: 2 }}
                                                InputProps={{
                                                    startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />
                                                }}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="datetime-local"
                                            label="Pick-up Date & Time"
                                            InputLabelProps={{ shrink: true }}
                                            defaultValue="2024-06-15T10:00"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Event color="primary" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="datetime-local"
                                            label="Return Date & Time"
                                            InputLabelProps={{ shrink: true }}
                                            defaultValue="2024-06-20T18:00"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccessTime color="primary" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                            <Typography variant="body2">
                                                <strong>Early return policy:</strong> No refund for early returns.
                                                <strong>Late return:</strong> Additional charges apply after 1-hour grace period.
                                            </Typography>
                                        </Alert>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Driver Information with Enhanced UI */}
                            <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonAdd color="primary" /> Driver Details
                                </Typography>

                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Please provide the primary driver's information. All drivers must be at least 25 years old with a valid driver's license.
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            required
                                            placeholder="As it appears on license"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            required
                                            type="email"
                                            placeholder="confirmation@email.com"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            required
                                            placeholder="(555) 123-4567"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Driver's License Number"
                                            required
                                            placeholder="Ex: TX12345678"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country of License"
                                            defaultValue="United States"
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Enhanced Additional Services */}
                            <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Security color="primary" /> Additional Services & Protection
                                </Typography>

                                <RadioGroup value={insurance} onChange={(e) => setInsurance(e.target.value)}>
                                    <Box sx={{ p: 3, mb: 2, border: '2px solid', borderColor: insurance === 'standard' ? 'primary.main' : '#e0e0e0', borderRadius: 3, bgcolor: insurance === 'standard' ? '#f0f7ff' : 'transparent' }}>
                                        <FormControlLabel
                                            value="standard"
                                            control={<Radio color="primary" />}
                                            label={
                                                <Box>
                                                    <Typography fontWeight="700">Standard Protection (Included)</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Basic coverage with $1,000 deductible for damage or theft.
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </Box>
                                    <Box sx={{ p: 3, mb: 2, border: '2px solid', borderColor: insurance === 'premium' ? 'primary.main' : '#e0e0e0', borderRadius: 3, bgcolor: insurance === 'premium' ? '#f0f7ff' : 'transparent' }}>
                                        <FormControlLabel
                                            value="premium"
                                            control={<Radio color="primary" />}
                                            label={
                                                <Box>
                                                    <Typography fontWeight="700">Premium Protection — $25.00/day</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Zero deductible. Full coverage for windshield, tires, and 24/7 roadside assistance included.
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <Box sx={{ ml: 4, mt: 1 }}>
                                            <List dense>
                                                <ListItem sx={{ py: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <VerifiedUser sx={{ fontSize: 16, color: 'success.main' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Zero deductible for any damage" />
                                                </ListItem>
                                                <ListItem sx={{ py: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <VerifiedUser sx={{ fontSize: 16, color: 'success.main' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Windshield and tire protection" />
                                                </ListItem>
                                                <ListItem sx={{ py: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <VerifiedUser sx={{ fontSize: 16, color: 'success.main' }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary="24/7 roadside assistance" />
                                                </ListItem>
                                            </List>
                                        </Box>
                                    </Box>
                                </RadioGroup>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>Additional Equipment & Services</Typography>

                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={extras.gps}
                                                    onChange={(e) => setExtras({ ...extras, gps: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">GPS Navigation</Typography>
                                                    <Typography variant="caption" color="text.secondary">$10/day</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                p: 2,
                                                border: '1px solid',
                                                borderColor: extras.gps ? 'primary.main' : '#e0e0e0',
                                                borderRadius: 2,
                                                width: '100%',
                                                m: 0
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={extras.tollPass}
                                                    onChange={(e) => setExtras({ ...extras, tollPass: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Electronic Toll Pass</Typography>
                                                    <Typography variant="caption" color="text.secondary">$7.99/day + tolls</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                p: 2,
                                                border: '1px solid',
                                                borderColor: extras.tollPass ? 'primary.main' : '#e0e0e0',
                                                borderRadius: 2,
                                                width: '100%',
                                                m: 0
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={extras.childSeat}
                                                    onChange={(e) => setExtras({ ...extras, childSeat: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Child Safety Seat</Typography>
                                                    <Typography variant="caption" color="text.secondary">$15 one-time</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                p: 2,
                                                border: '1px solid',
                                                borderColor: extras.childSeat ? 'primary.main' : '#e0e0e0',
                                                borderRadius: 2,
                                                width: '100%',
                                                m: 0
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={extras.addDriver}
                                                    onChange={(e) => setExtras({ ...extras, addDriver: e.target.checked })}
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">Additional Driver</Typography>
                                                    <Typography variant="caption" color="text.secondary">$20 one-time</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                p: 2,
                                                border: '1px solid',
                                                borderColor: extras.addDriver ? 'primary.main' : '#e0e0e0',
                                                borderRadius: 2,
                                                width: '100%',
                                                m: 0
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Payment Section */}
                            <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Payment color="primary" /> Payment Information
                                    </Typography>
                                    <Lock fontSize="small" color="success" />
                                </Stack>

                                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                    <Typography variant="body2">
                                        Your payment is secured with 256-bit SSL encryption. We accept all major credit cards.
                                    </Typography>
                                </Alert>

                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name on Card"
                                            required
                                            placeholder="John Smith"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Card Number"
                                            required
                                            placeholder="1234 5678 9012 3456"
                                            InputProps={{
                                                startAdornment: <CreditCard color="action" sx={{ mr: 1 }} />,
                                                endAdornment: (
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Avatar src="https://cdn.worldvectorlogo.com/logos/visa-1.svg" sx={{ width: 24, height: 24 }} />
                                                        <Avatar src="https://cdn.worldvectorlogo.com/logos/mastercard-2.svg" sx={{ width: 24, height: 24 }} />
                                                        <Avatar src="https://cdn.worldvectorlogo.com/logos/american-express-2.svg" sx={{ width: 24, height: 24 }} />
                                                    </Box>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Expiry Date"
                                            required
                                            placeholder="MM/YY"
                                            InputProps={{
                                                startAdornment: <CalendarToday color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="CVV"
                                            required
                                            type="password"
                                            placeholder="123"
                                            InputProps={{
                                                startAdornment: <Lock color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Billing Address"
                                            placeholder="123 Main St, City, State ZIP"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Promo Code"
                                            InputProps={{
                                                endAdornment: <Button variant="contained" color="secondary">Apply</Button>
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* RIGHT COLUMN: Sticky Summary Panel */}
                    <Grid container spacing={3}>
                        {/* LEFT COLUMN: Special Offer & Need Help */}
                        <Grid item xs={12} lg={4}>
                            <Stack spacing={3}>
                                {/* Special Offer Card */}
                                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fff9e6', border: '1px solid #ffe066' }}>
                                    <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalOffer color="warning" /> Special Offer
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Get <strong>15% off</strong> your next rental when you complete this booking! Use code: <strong>WELCOME15</strong>
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        sx={{ textTransform: 'none', fontWeight: 600, width: 'fit-content', px: 4 }}
                                    >
                                        Apply Offer
                                    </Button>
                                </Paper>

                                {/* Need Help Card */}
                                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                                    <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                        Need Help?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Our customer support team is available 24/7 to assist you with your booking.
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{ justifyContent: 'center', textTransform: 'none', borderRadius: 2 }}
                                            startIcon={<ChatBubbleOutline />}
                                        >
                                            Live Chat
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{ justifyContent: 'center', textTransform: 'none', borderRadius: 2 }}
                                            startIcon={<PhoneInTalk />}
                                        >
                                            1-800-RENTALS
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Grid>

                        {/* RIGHT COLUMN: Booking Summary (Sticky) */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: 3 }}>
                                <Typography variant="h5" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                    <Receipt color="primary" fontSize="large" /> Booking Summary
                                </Typography>

                                <Grid container spacing={4}>
                                    {/* Sub-column 1: Vehicle & Period */}
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', mb: 1 }}>
                                                    Selected Vehicle
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee' }}>
                                                    <Avatar src={selectedCar.image} variant="rounded" sx={{ width: 100, height: 60 }} />
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="700">{selectedCar.make} {selectedCar.model}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{selectedCar.category} • {selectedCar.year}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', mb: 1 }}>
                                                    Rental Period
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee' }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Box>
                                                            <Typography variant="body1" fontWeight="700">Jun 15 — Jun 20</Typography>
                                                            <Typography variant="body2" color="text.secondary">{rentalDays} Full Days • Pickup 10:00 AM</Typography>
                                                        </Box>
                                                        <Chip label="Flexible" size="small" color="success" variant="outlined" />
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    {/* Sub-column 2: Pricing Breakdown */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 3, bgcolor: '#fcfcfd', borderRadius: 3, border: '1px solid #eef0f2' }}>
                                            <Typography variant="subtitle2" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', mb: 2 }}>
                                                Price Breakdown
                                            </Typography>
                                            <Stack spacing={1.5}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Daily Rate (${selectedCar.dailyRate} x {rentalDays})</Typography>
                                                    <Typography variant="body2" fontWeight="600">${(selectedCar.dailyRate * rentalDays).toFixed(2)}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Taxes & Fees</Typography>
                                                    <Typography variant="body2" fontWeight="600">$45.50</Typography>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="800">Total Amount</Typography>
                                                        <Typography variant="caption" color="text.secondary">Fully Inclusive Price</Typography>
                                                    </Box>
                                                    <Typography variant="h4" fontWeight="900" color="primary.main">
                                                        ${totalAmount.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                mt: 3, py: 2, borderRadius: 3, fontWeight: '800', textTransform: 'none', fontSize: '1.1rem',
                                                background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                                                boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)'
                                            }}
                                        >
                                            Confirm & Complete Booking
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default BookingPage;