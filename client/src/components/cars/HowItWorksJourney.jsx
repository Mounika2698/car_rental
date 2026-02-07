import { Box, Typography, Stack} from "../index";
import {
  LocationOn,
  DateRange,
  DirectionsCar,
  AssignmentTurnedIn,
  CreditCard,
  LocalShipping,
  DriveEta,
} from "@mui/icons-material";

const STEPS = [
  { icon: <LocationOn />, title: "Choose location", desc: "City or ZIP anywhere in Texas" },
  { icon: <DateRange />, title: "Select dates", desc: "Pickup & return" },
  { icon: <DirectionsCar />, title: "Browse cars", desc: "EVs, luxury, sedans & more" },
  { icon: <AssignmentTurnedIn />, title: "Verify & protect", desc: "ID & insurance" },
  { icon: <CreditCard />, title: "Pay securely", desc: "Transparent pricing" },
  { icon: <LocalShipping />, title: "Pickup or delivery", desc: "Host or doorstep" },
  { icon: <DriveEta />, title: "Drive & return", desc: "Easy return, invoice ready" },
];

export default function HowItWorksJourney() {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h4" fontWeight={900} mb={1}>
        How DRIVEFLOW works
      </Typography>
      <Typography color="text.secondary" mb={5}>
        From search to steering wheel — simple, fast, and secure.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {STEPS.map((s, i) => (
          <Box
            key={i}
            sx={{
              width: 140,
              p: 2,
              borderRadius: "50%",
              bgcolor: "#f1f4ff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#1A237E",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              {s.icon}
            </Box>
            <Typography fontWeight={700} fontSize={14}>
              {s.title}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {s.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
