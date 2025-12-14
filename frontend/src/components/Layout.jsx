// src/components/Layout.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Full-width Navbar */}
      <AppBar position="sticky" elevation={3} sx={{ width: "100%" }}>
        <Toolbar sx={{ width: "100%" }}>
          <EventSeatIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Event Ticketing
          </Typography>

          {/* If user is logged in */}
          {user ? (
            <>
              <Typography variant="body1" sx={{ mr: 3 }}>
                {user.name}
              </Typography>
              <Button
                color="inherit"
                onClick={() => navigate("/bookings")}
                sx={{ textTransform: "none", fontSize: "1rem", mr: 2 }}
              >
                My Bookings
              </Button>
              <Button
                color="inherit"
                onClick={logout}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  border: "1px solid rgba(255,255,255,0.5)",
                  borderRadius: "4px",
                  px: 2,
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            // If user is NOT logged in
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontSize: "1rem", mr: 2 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/signup")}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  backgroundColor: "#ff6b35",
                  px: 3,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#ff5722",
                  },
                }}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Full-width Content Area */}
      <Box sx={{ flex: 1, width: "100%", bgcolor: "background.default" }}>
        <Container maxWidth="xl" sx={{ py: 4, width: "100%" }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
