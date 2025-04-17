// src/components/UserEmergencyReports.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  ReportProblem as ReportIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CompletedIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { getUserReportedEmergencies } from "../services/apiCalls";
import { useNavigate } from "react-router-dom";

const UserEmergencyReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch emergencies reported by the user
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getUserReportedEmergencies();
      console.log("Fetched user reports:", response.data);
      setEmergencies(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user reports:", err);
      setError(
        err.status === 401
          ? "Unauthorized. Please log in again."
          : err.data?.message || "Failed to load your emergency reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Status icon mapping
  const statusIcons = {
    "In Progress": <ReportIcon sx={{ color: "#ff5722" }} />,
    "Pending Approval": <PendingIcon sx={{ color: "#ff9800" }} />,
    Completed: <CompletedIcon sx={{ color: "#4caf50" }} />,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f4f6f8",
        }}
      >
        <CircularProgress size={60} thickness={5} sx={{ color: "#1a237e" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#1a237e" }}>
          Loading Your Reports...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchReports}
          sx={{ mt: 2, borderRadius: "20px" }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #f4f6f8 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
              fontWeight: 700,
              color: "#1a237e",
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Your Emergency Reports
          </Typography>
          <Tooltip title="Refresh Reports">
            <IconButton
              onClick={fetchReports}
              sx={{
                bgcolor: "#1a237e",
                color: "#fff",
                "&:hover": { bgcolor: "#1565c0", transform: "rotate(360deg)", transition: "transform 0.5s" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </motion.div>

      {/* Reports List */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          {emergencies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: "16px",
                  bgcolor: "#fff",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" sx={{ color: "#607d8b" }}>
                  You haven’t reported any emergencies yet.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/dashboard/report")} 
                  sx={{ mt: 2, borderRadius: "20px" }}
                >
                  Report an Emergency
                </Button>
              </Paper>
            </motion.div>
          ) : (
            emergencies.map((emergency, index) => (
              <motion.div
                key={emergency._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Accordion
                  sx={{
                    mb: 2,
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                    "&:hover": { boxShadow: "0 8px 35px rgba(0,0,0,0.15)" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#1a237e" }} />}
                    sx={{
                      bgcolor: "linear-gradient(135deg, #ffffff 0%, #eceff1 100%)",
                      p: 2,
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                      {statusIcons[emergency.status]}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#263238",
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}
                      >
                        {emergency.type} - {emergency.location}
                      </Typography>
                    </Box>
                    <Chip
                      label={emergency.status}
                      color={
                        emergency.status === "Completed"
                          ? "success"
                          : emergency.status === "Pending Approval"
                          ? "warning"
                          : "primary"
                      }
                      size="small"
                      sx={{ fontWeight: 500 , marginTop:"6px"}}
                    />
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: "#fff", p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                          <strong>Severity:</strong> {emergency.severity}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                          <strong>Needs:</strong>{" "}
                          {Object.keys(emergency.emergencyNeeds)
                            .filter((k) => emergency.emergencyNeeds[k])
                            .join(", ") || "None"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                          <strong>Volunteers:</strong>{" "}
                          {emergency.volunteers.map((v) => `${v.userId.name} (${v.status})`).join(", ") || "None"}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                          <strong>Reported By:</strong> {emergency.reportedBy.name} (You)
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* History Section */}
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#34495e", mt: 2, mb: 1 }}
                    >
                      History
                    </Typography>
                    <Paper
                      elevation={1}
                      sx={{ maxHeight: 200, overflowY: "auto", bgcolor: "#fafafa", borderRadius: "8px" }}
                    >
                      <List dense>
                        {emergency.history.map((entry, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                          >
                            <ListItem
                              sx={{
                                "&:hover": { bgcolor: "#f0f0f0", transition: "background-color 0.2s" },
                              }}
                            >
                              <ListItemText
                                primary={`${entry.action} by ${entry.userId?.name || "Unknown"}`}
                                secondary={new Date(entry.timestamp).toLocaleString()}
                                primaryTypographyProps={{ color: "#263238", fontWeight: 500 }}
                                secondaryTypographyProps={{ color: "#78909c" }}
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </Paper>

                    {/* View Details Button */}
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => navigate(`/dashboard/emergency/${emergency._id}`)}
                      sx={{ mt: 2, fontWeight: 600 }}
                    >
                      View Full Tracking Details
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserEmergencyReports;