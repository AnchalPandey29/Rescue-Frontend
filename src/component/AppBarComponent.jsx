import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { motion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box } from "@mui/material";
import { useAuth } from "../AuthContext"; // Import useAuth

const AppBarComponent = () => {
  const { isLoggedIn } = useAuth(); // Changed from isAuthenticated to isLoggedIn
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "About Us", path: "/aboutus" },
    { text: "Signup", path: "/signup" },
    { text: "Login", path: "/login" },
  ];

  // Return null if user is logged in (hides the AppBar)
  if (isLoggedIn) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        background: scrolling
          ? "linear-gradient(15deg, #1a237e 0%, #3f51b5 100%)"
           : "rgba(0, 0, 0, 0)",
        transition: "background 0.3s ease-in-out",
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {/* Title with Animation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }}>
            RescueChain
          </Typography>
        </motion.div>

        {/* Desktop Navigation */}
        {!isSmallScreen && (
          <Box sx={{ marginLeft: "auto" }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  color: "white",
                  textTransform: "none",
                  "&:hover": { color: "#fa255e", transition: "0.3s" },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        {/* Menu Button (Only on Small Screens) */}
        {isSmallScreen && (
          <IconButton edge="end" sx={{ color: "#f8e5e5", marginLeft: "auto" }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250, backgroundColor: "#000000", height: "100vh" }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} component={Link} to={item.path} onClick={toggleDrawer(false)}>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "white",
                  "&:hover": { color: "#fa255e", transition: "0.3s" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default AppBarComponent;