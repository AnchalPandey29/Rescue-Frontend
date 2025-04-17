// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Link,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Phone as PhoneIcon,
  MedicalServices as MedicalIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  BuildCircle as BuildIcon,
  Refresh as RefreshIcon,
  Group,
  CheckCircle,
  ReportProblem,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getAllEmergencies } from "../services/apiCalls";
import Notification from "./Notification";

// Motion Components
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);
const MotionTypography = motion(Typography);

// Color Palette
const PRIMARY_COLOR = "#1a237e"; // Vibrant Indigo
const SECONDARY_COLOR = "#712F3A"; // Deep Red
const CARD_BG = "rgba(255, 255, 255, 0.95)"; // Subtle Glassmorphism
const BACKGROUND_GRADIENT = "linear-gradient(135deg, #f4f6f8 0%, #fce4ec 100%)";
const ACCENT_COLOR = "#d81b60"; // Hover accent
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

// Enhanced StatCard Component
const StatCard = ({ label, value, color, icon, index }) => {
  return (
    <motion.Card
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 120 }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 12px 30px ${SHADOW_COLOR}`,
        borderColor: `${color}80`,
        transition: { duration: 0.3 },
      }}
      sx={{
        bgcolor: CARD_BG,
        borderRadius: "16px",
        p: 3,
        border: `2px solid ${color}20`,
        boxShadow: `0 4px 15px ${SHADOW_COLOR}`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(145deg, ${CARD_BG}, rgba(255, 255, 255, 0.9))`,
        "&:hover": {
          background: `linear-gradient(145deg, rgba(255, 255, 255, 0.9), ${color}05)`,
        },
        minHeight: "180px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle, ${color}10 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: SECONDARY_COLOR,
          fontSize: { xs: "1rem", md: "1.1rem" },
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          textAlign: "center",
          mb: 2,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.1, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.15, rotate: 5, transition: { duration: 0.3 } }}
        >
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              width: 48,
              height: 48,
              boxShadow: `0 2px 8px ${SHADOW_COLOR}`,
            }}
          >
            {icon}
          </Avatar>
        </motion.div>
        <Tooltip title={`${value} ${label.toLowerCase()} recorded`}>
          <MotionTypography
            variant="h3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 }}
            sx={{
              fontWeight: 700,
              color: color,
              fontSize: { xs: "2rem", md: "2.5rem" },
              lineHeight: 1.1,
              textShadow: `1px 1px 3px ${SHADOW_COLOR}`,
            }}
          >
            {value}
          </MotionTypography>
        </Tooltip>
      </Box>
    </motion.Card>
  );
};

const Dashboard = ({ open }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    activeEmergencies: 0,
    resolvedEmergencies: 0,
    totalContributors: 0,
  });
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllEmergencies, setShowAllEmergencies] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsResponse, emergenciesResponse] = await Promise.all([
        getDashboardStats(),
        getAllEmergencies(),
      ]);
      setStats(statsResponse.data);
      setEmergencies(emergenciesResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEmergencies = emergencies.filter(
    (e) =>
      e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resources = [
    {
      title: "Emergency Contacts",
      description: "Key help numbers.",
      link: "/dashboard/emergencycontacts",
      icon: <PhoneIcon sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    },
    {
      title: "First Aid Guide",
      description: "Basic aid steps.",
      link: "/dashboard/firstaidguide",
      icon: <MedicalIcon sx={{ color: "#FF5E78", fontSize: 36 }} />,
    },
    {
      title: "Preparedness Tips",
      description: "Be ready for emergencies.",
      link: "/dashboard/preparednesstips",
      icon: <BuildIcon sx={{ color: "#0288d1", fontSize: 36 }} />,
    },
  ];

  const handleResourceClick = (link) => {
    navigate(link); // Use navigate instead of href
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: BACKGROUND_GRADIENT,
        }}
      >
        <CircularProgress size={60} sx={{ color: PRIMARY_COLOR }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          bgcolor: BACKGROUND_GRADIENT,
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
          sx={{ mt: 2, borderRadius: "20px", bgcolor: PRIMARY_COLOR }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: BACKGROUND_GRADIENT,
        borderRadius: "16px",
        minHeight: "100vh",
        marginLeft: open ? { xs: "60px", md: "60px" } : "20px",
        transition: "margin-left 0.5s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: PRIMARY_COLOR,
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Notification />
            <Tooltip title="Refresh Data">
              <IconButton
                onClick={fetchData}
                sx={{
                  bgcolor: PRIMARY_COLOR,
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#d81b60",
                    transform: "rotate(360deg)",
                    transition: "transform 0.5s",
                  },
                  p: 1,
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          {[
            { label: "Active Emergencies", value: stats.activeEmergencies, color: "#d32f2f", icon: <ReportProblem sx={{ fontSize: 32, color: "#d32f2f" }} /> },
            { label: "Resolved Emergencies", value: stats.resolvedEmergencies, color: "#388e3c", icon: <CheckCircle sx={{ fontSize: 32, color: "#388e3c" }} /> },
            { label: "Total Contributors", value: stats.totalContributors, color: "#1976d2", icon: <Group sx={{ fontSize: 32, color: "#1976d2" }} /> },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{
              mb: 2,
              p: 4,
              bgcolor: CARD_BG,
              borderRadius: "20px",
              border: `2px solid ${PRIMARY_COLOR}20`,
              boxShadow: `0 6px 20px ${SHADOW_COLOR}`,
              background: `linear-gradient(135deg, ${CARD_BG}, rgba(255, 255, 255, 0.85))`,
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9), ${PRIMARY_COLOR}05)`,
              },
            }}>
              <StatCard label={stat.label} value={stat.value} color={stat.color} icon={stat.icon} index={index} />
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <MotionCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ boxShadow: `0 15px 40px ${SHADOW_COLOR}` }}
              sx={{
                bgcolor: "#F1F5F4",
                borderRadius: "20px",
                boxShadow: `0 2px 10px ${SHADOW_COLOR}`,
                p: 2,
                height: "550px",
                border: "none",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color: SECONDARY_COLOR, mb: 1, pl: 1, textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                Emergency Trends
              </Typography>
              <iframe
                src="https://charts.mongodb.com/charts-rescue-lotkcvj/embed/dashboards?id=7c99f78a-1340-479c-8135-38323afa8389&theme=light&autoRefresh=true&maxDataAge=60&scalingWidth=fixed&scalingHeight=fixed"
                style={{ width: "130%", height: "calc(100% - 40px)", marginLeft: "-30%", border: "none" }}
                title="Emergency Trends Dashboard"
              />
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
                sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", bgcolor: PRIMARY_COLOR, pointerEvents: "none" }}
              />
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <MotionBox initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, type: "spring", stiffness: 100 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: SECONDARY_COLOR, mb: 2, textAlign: "center", textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}>
                Recent Emergencies
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Search emergencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: PRIMARY_COLOR }} /></InputAdornment>,
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchTerm("")}><ClearIcon sx={{ color: ACCENT_COLOR }} /></IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  boxShadow: `0 4px 15px ${SHADOW_COLOR}`,
                  "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: PRIMARY_COLOR }, "&:hover fieldset": { borderColor: ACCENT_COLOR }, "&.Mui-focused fieldset": { borderColor: ACCENT_COLOR } },
                }}
              />
              <List sx={{ bgcolor: CARD_BG, borderRadius: "16px", p: 1, boxShadow: `0 4px 20px ${SHADOW_COLOR}` }}>
                {(showAllEmergencies ? filteredEmergencies : filteredEmergencies.slice(0, 5)).map((emergency, index) => (
                  <MotionListItem
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 80 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", boxShadow: `0 8px 20px ${SHADOW_COLOR}`, transition: { duration: 0.3 } }}
                    sx={{
                      borderRadius: "12px",
                      mb: 1,
                      p: 1.5,
                      borderLeft: `4px solid ${
                        emergency.severity === "High" ? "#f44336" : emergency.severity === "Critical" ? "#d50000" : "#ffca28"
                      }`,
                      background: `linear-gradient(90deg, ${CARD_BG}, rgba(${
                        emergency.severity === "High" ? "244,67,54" : emergency.severity === "Critical" ? "213,0,0" : "255,202,40"
                      },0.1))`,
                      "&:hover": { cursor: "pointer" },
                    }}
                    secondaryAction={
                      <Tooltip title="View Details">
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            bgcolor: PRIMARY_COLOR,
                            color: "#fff",
                            borderRadius: "12px",
                            "&:hover": { bgcolor: ACCENT_COLOR, transform: "scale(1.05)", transition: "all 0.3s" },
                          }}
                          onClick={() => navigate(`/emergency/${emergency._id}`)}
                        >
                          View
                        </Button>
                      </Tooltip>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            emergency.severity === "High"
                              ? "#f44336"
                              : emergency.severity === "Critical"
                              ? "#d50000"
                              : "#ffca28",
                          transform: "scale(1.1)",
                          boxShadow: `0 2px 10px ${SHADOW_COLOR}`,
                        }}
                      >
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600, color: SECONDARY_COLOR, fontSize: "1.1rem" }}>
                          {emergency.type}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <Typography component="span" variant="body2" sx={{ color: "#78909c" }}>
                            {emergency.location}
                          </Typography>
                          <Chip
                            label={emergency.status}
                            color={
                              emergency.status === "Completed"
                                ? "success"
                                : emergency.status === "In Progress"
                                ? "warning"
                                : "default"
                            }
                            size="small"
                            sx={{ fontWeight: 500, bgcolor: "rgba(15, 199, 12, 0.8)" }}
                          />
                        </Box>
                      }
                    />
                  </MotionListItem>
                ))}
              </List>
              {filteredEmergencies.length > 5 && !showAllEmergencies && (
                <Box sx={{ textAlign: "right", mt: 1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setShowAllEmergencies(true)}
                    sx={{ color: PRIMARY_COLOR, fontSize: "0.875rem", "&:hover": { color: ACCENT_COLOR, textDecoration: "underline" } }}
                  >
                    Show All Emergencies
                  </Link>
                </Box>
              )}
            </MotionBox>
          </Grid>
        </Grid>
      </MotionBox>

      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: SECONDARY_COLOR, mb: 3, textAlign: "center" }}
        >
          Resources
        </Typography>
        <Grid container spacing={3}>
          {resources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}
                sx={{
                  bgcolor: CARD_BG,
                  borderRadius: "20px",
                  p: 3,
                  textAlign: "center",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                {resource.icon}
                <Typography
                  variant="h6"
                  mt={2}
                  sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                >
                  {resource.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#78909c" }}>
                  {resource.description}
                </Typography>
                <CardActions sx={{ justifyContent: "center", mt: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: PRIMARY_COLOR,
                      color: "#fff",
                      borderRadius: "12px",
                      "&:hover": { bgcolor: "#d81b60" },
                    }}
                    onClick={() => handleResourceClick(resource.link)} // Use onClick instead of href
                  >
                    Access Now
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;