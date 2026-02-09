// src/components/assistant/SmartAssistantWidget.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Drawer,
  Fab,
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * SmartAssistantWidget (UI-only)
 * - Floating chat-style helper
 * - Keyword-based routing (no backend / no Rasa yet)
 * - Works on any page (drop it once in Home or App layout)
 *
 * Optional (nice-to-have):
 * - If you add element IDs in target pages, it can scroll to them:
 *   /cars#search
 *   /manage-bookings#download
 *   /manage-bookings#cancel
 *   /manage-bookings#lookup
 *
 * If those IDs don't exist, it will still navigate and show guidance.
 */

const DEFAULT_QUICK_ACTIONS = [
  { label: "Book a car", action: "book" },
  { label: "Manage bookings", action: "manage" },
  { label: "Download agreement", action: "download_agreement" },
  { label: "Cancel booking", action: "cancel" },
  { label: "Refund / policies", action: "policies" },
];

function normalize(text = "") {
  return text.toLowerCase().trim();
}

function detectIntent(userText) {
  const t = normalize(userText);

  // booking / search
  if (
    t.includes("book") ||
    t.includes("rent") ||
    t.includes("reserve") ||
    t.includes("find a car") ||
    t.includes("search")
  ) {
    return { intent: "book" };
  }

  // manage bookings
  if (
    t.includes("manage") ||
    t.includes("my booking") ||
    t.includes("reservation") ||
    t.includes("itinerary") ||
    t.includes("change booking") ||
    t.includes("modify")
  ) {
    return { intent: "manage" };
  }

  // download agreement / invoice
  if (
    t.includes("download") ||
    t.includes("agreement") ||
    t.includes("invoice") ||
    t.includes("receipt") ||
    t.includes("pdf")
  ) {
    return { intent: "download_agreement" };
  }

  // cancel
  if (t.includes("cancel") || t.includes("refund") || t.includes("terminate")) {
    return { intent: "cancel" };
  }

  // policies / FAQ
  if (
    t.includes("policy") ||
    t.includes("policies") ||
    t.includes("deposit") ||
    t.includes("age") ||
    t.includes("insurance") ||
    t.includes("late") ||
    t.includes("fuel") ||
    t.includes("mileage") ||
    t.includes("faq") ||
    t.includes("help")
  ) {
    return { intent: "policies" };
  }

  return { intent: "unknown" };
}

function planForIntent(intent) {
  // Adjust these routes to match your app
  const ROUTES = {
    home: "/",
    cars: "/cars",
    manage: "/manage-bookings",
    policies: "/faq", // if you don't have /faq, point this to "/"
  };

  switch (intent) {
    case "book":
      return {
        route: `${ROUTES.cars}#search`,
        botText:
          "Got it — I’ll take you to the Cars page so you can search and book.",
        fallbackHint:
          "On the Cars page, use the search filters to pick dates and a car.",
      };
    case "manage":
      return {
        route: `${ROUTES.manage}#lookup`,
        botText:
          "Sure — taking you to Manage Bookings to find or update your reservation.",
        fallbackHint:
          "On Manage Bookings, use reservation lookup or find your booking in the list.",
      };
    case "download_agreement":
      return {
        route: `${ROUTES.manage}#download`,
        botText:
          "Okay — taking you to Manage Bookings to download your agreement/invoice.",
        fallbackHint:
          "On Manage Bookings, look for the Download button on your booking card.",
      };
    case "cancel":
      return {
        route: `${ROUTES.manage}#cancel`,
        botText:
          "Understood — taking you to Manage Bookings so you can cancel your reservation.",
        fallbackHint:
          "On Manage Bookings, open your booking and choose Cancel.",
      };
    case "policies":
      return {
        route: `${ROUTES.policies}#top`,
        botText: "Taking you to Policies / FAQ.",
        fallbackHint:
          "If you don’t see a Policies page, use the Help/FAQ section (or ask here).",
      };
    default:
      return {
        route: ROUTES.home,
        botText:
          "I can help you with: booking a car, managing bookings, downloading agreements, and cancellations. Try typing: “book a car” or “download agreement”.",
        fallbackHint: "",
      };
  }
}

export default function SmartAssistantWidget({
  quickActions = DEFAULT_QUICK_ACTIONS,
  // set this true on pages where you want it hidden
  disabled = false,
  // optional: move the FAB up if you have something else bottom-right
  fabBottom = 24,
  fabRight = 24,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I can help you book a car, manage bookings, or download your agreement. What do you want to do?",
    },
  ]);

  const messagesEndRef = useRef(null);

  const canSend = useMemo(() => normalize(input).length > 0, [input]);

  useEffect(() => {
    // scroll chat to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    // If user navigates, keep widget closed (optional)
    // Comment this out if you want it to stay open across pages.
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const pushBot = (text) =>
    setMessages((prev) => [...prev, { from: "bot", text }]);

  const pushUser = (text) =>
    setMessages((prev) => [...prev, { from: "user", text }]);

  const tryScrollToHash = (hash) => {
    // Works only if target page has element with id matching the hash (without #)
    if (!hash) return false;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  };

  const goToRoute = (route) => {
    // route may include hash: "/manage-bookings#download"
    const [path, hash] = route.split("#");
    navigate(path + (hash ? `#${hash}` : ""));

    // After navigation, try to scroll (best-effort)
    // setTimeout because the new page needs time to render.
    setTimeout(() => {
      if (hash) tryScrollToHash(`#${hash}`);
    }, 350);
  };

  const handleIntent = (intent) => {
    const plan = planForIntent(intent);
    pushBot(plan.botText);

    if (intent === "unknown") return;

    // Navigate
    goToRoute(plan.route);

    // If hash scrolling doesn't work because IDs aren't there, user still gets guidance.
    if (plan.fallbackHint) {
      setTimeout(() => pushBot(plan.fallbackHint), 400);
    }
  };

  const handleQuickAction = (action) => {
    pushUser(action.label);
    handleIntent(action.action);
  };

  const handleSend = () => {
    if (!canSend) return;
    const text = input;
    setInput("");
    pushUser(text);

    const { intent } = detectIntent(text);
    handleIntent(intent);
  };

  if (disabled) return null;

  return (
    <>
      {/* Floating button */}
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: fabRight,
          bottom: fabBottom,
          zIndex: 1300,
        }}
        aria-label="Open assistant"
      >
        <ChatBubbleOutlineIcon />
      </Fab>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 380 }, borderRadius: 0 },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Assistant
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                UI-only helper (no backend yet)
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Quick actions */}
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Quick actions
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {quickActions.map((a) => (
                <Chip
                  key={a.action}
                  label={a.label}
                  onClick={() => handleQuickAction(a)}
                  clickable
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
            }}
          >
            {messages.map((m, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  bgcolor: m.from === "user" ? "primary.main" : "grey.100",
                  color: m.from === "user" ? "primary.contrastText" : "text.primary",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {m.text}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth
                size="small"
                placeholder='Try: "download agreement" or "book a car"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
                disabled={!canSend}
              >
                Send
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.75 }}>
              Tip: Later you can replace the keyword detection with Rasa/Botpress
              without changing this UI.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
