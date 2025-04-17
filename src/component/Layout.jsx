// src/components/Layout.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { useAuth } from "../AuthContext";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {user && (
        <Sidebar
          open={open}
          setOpen={setOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: user ? `calc(100% - ${open ? 300 : 60}px)` : "100%",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;