// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Policy as PolicyIcon,
  AddAlert as SosIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  MonetizationOn as Donate,
  VolunteerActivism as VolunteerIcon,
  Report as ReportIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AddModeratorRounded as Trouble,
  AccountCircle as AccountIcon,
  Edit as EditIcon, // Added for profile edit
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GRADIENT_START = "#482F41";
const GRADIENT_END = "#712F3A";
const PRIMARY_COLOR = "white";

const links = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Emergencies", path: "/dashboard/map", icon: <SosIcon /> },
  { label: "Report Emergency", path: "/dashboard/report", icon: <ReportIcon /> },
  { label: "Volunteer", path: "/dashboard/volunteer", icon: <VolunteerIcon /> },
  { label: "Track Resources", path: "/dashboard/volunteer/history", icon: <PolicyIcon /> },
  { label: "Track Reports", path: "/dashboard/myreports", icon: <Trouble /> },
  { label: "Donate", path: "/dashboard/donation", icon: <Donate /> },
  { label: "Logout", path: "#", icon: <LogoutIcon /> },
];

const Logo = ({ open }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      p: 2,
      bgcolor: "rgba(255, 255, 255, 0.05)",
      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    }}
  >
    <MenuIcon sx={{ color: "white", fontSize: "1.8rem" }} />
    {open && (
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginLeft: 16, fontSize: "1.8rem", fontWeight: 700, color: PRIMARY_COLOR }}
      >
        RescueChain
      </motion.span>
    )}
  </Box>
);

const Sidebar = ({ open, setOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
    if (isMobile) handleDrawerToggle();
  };

  const handleNavigation = (path, label) => {
    if (label === "Logout") {
      handleLogout({ preventDefault: () => {} });
    } else {
      navigate(path);
      if (isMobile) handleDrawerToggle();
    }
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
    if (isMobile) handleDrawerToggle();
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(15deg, #1a237e 0%, #3f51b5 100%)",
        height: "100%",
        boxShadow: open ? "0 8px 30px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <Logo open={open} />
      <List sx={{ flex: 1, py: 2 }}>
        {links.map((link, index) => (
          <Tooltip key={index} title={!open ? link.label : ""} placement="right">
            <ListItem
              button
              onClick={() => handleNavigation(link.path, link.label)}
              sx={{
                py: 1.5,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  boxShadow: `0 0 10px ${PRIMARY_COLOR}`,
                  transition: "all 0.3s",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 50, color: PRIMARY_COLOR }}>
                {React.cloneElement(link.icon, { sx: { fontSize: "28px" } })}
              </ListItemIcon>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: "1.1rem" }}
                    sx={{ color: "white" }}
                  />
                </motion.div>
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      {/* Updated Avatar Section */}
      <Box sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
        <Tooltip title="View Profile" placement="right">
          <ListItem
            button
            onClick={handleProfileClick}
            sx={{
              color: "white",
              py: 1.5,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: `0 0 10px ${PRIMARY_COLOR}`,
                transition: "all 0.3s",
              },
            }}
            secondaryAction={
              open && (
                <IconButton
                  edge="end"
                  onClick={handleProfileClick}
                  sx={{ color: PRIMARY_COLOR }}
                >
                  <EditIcon />
                </IconButton>
              )
            }
          >
            <ListItemIcon sx={{ minWidth: 50 }}>
              <Avatar
                sx={{
                  bgcolor: PRIMARY_COLOR,
                  width: 35,
                  height: 35,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <AccountIcon sx={{ color: "#3f51b5", fontSize: "28px" }} />
              </Avatar>
            </ListItemIcon>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ListItemText
                  primary={user ? user.name : "Guest"}
                  secondary={user ? user.email : ""}
                  primaryTypographyProps={{ fontWeight: 600, color: "white" }}
                  secondaryTypographyProps={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              </motion.div>
            )}
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" }, p: 2, color: PRIMARY_COLOR }}
          >
            <MenuIcon sx={{ fontSize: "2rem" }} />
          </IconButton>
          <Drawer
            anchor="left"
            open={open}
            onClose={handleDrawerToggle}
            sx={{
              "& .MuiDrawer-paper": {
                width: 250,
                background: "transparent",
                borderRight: "none",
              },
            }}
          >
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
                <CloseIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: open ? 300 : 60,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? 300 : 60,
              background: "transparent",
              borderRight: "none",
              overflowX: "hidden",
              transition: "width 0.3s ease-in-out",
            },
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;