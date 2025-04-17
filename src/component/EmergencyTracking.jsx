// src/components/EmergencyTracking.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grid,
  Tooltip,
  Chip,
} from "@mui/material";
import { Done as DoneIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { getEmergencyDetails, markEmergencyCompleted, approveEmergencyCompletion } from "../services/apiCalls";
import { useAuth } from "../AuthContext";

const EmergencyTracking = () => {
  const { emergencyId } = useParams();
  const { user } = useAuth();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmergency = async () => {
    setLoading(true);
    try {
      const response = await getEmergencyDetails(emergencyId);
      console.log("Fetched emergency data:", response.data);
      setEmergency(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching emergency:", err);
      setError(
        err.status === 404
          ? `Emergency with ID ${emergencyId} not found`
          : err.data?.message || "Failed to load emergency details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergency();
  }, [emergencyId]);

  const handleMarkCompleted = async () => {
    try {
      await markEmergencyCompleted(emergencyId);
      alert("Emergency marked as completed. Awaiting victim approval.");
      fetchEmergency();
    } catch (err) {
      setError(err.data?.message || "Failed to mark as completed");
    }
  };

  const handleApprove = async () => {
    try {
      await approveEmergencyCompletion(emergencyId);
      alert("Emergency approved and completed!");
      fetchEmergency();
    } catch (err) {
      setError(err.data?.message || "Failed to approve completion");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!emergency) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          No emergency found
        </Typography>
      </Box>
    );
  }

  const isVolunteer = emergency.volunteers.some((v) => v.userId._id.toString() === user._id.toString());
  const isVictim = emergency.reportedBy._id.toString() === user._id.toString();
  const volunteerMarkedCompleted = isVolunteer && emergency.volunteers.find((v) => v.userId._id.toString() === user._id.toString())?.status === "Completed";
  const isCompleted = emergency.status === "Completed" && emergency.victimApproval;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#1a237e", textAlign: "center" }}>
          Emergency Tracking
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ffffff 0%, #e8ecef 100%)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#263238", mb: 2 }}>
                {emergency.type}
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Location:</strong> {emergency.location}
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Severity:</strong> {emergency.severity}
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Status:</strong>
                <Chip
                  label={emergency.status}
                  color={emergency.status === "Completed" ? "success" : "warning"}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Needs:</strong>{" "}
                {Object.keys(emergency.emergencyNeeds)
                  .filter((k) => emergency.emergencyNeeds[k])
                  .join(", ") || "None"}
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Reported By:</strong> {emergency.reportedBy.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                <strong>Volunteers:</strong>{" "}
                {emergency.volunteers.map((v) => `${v.userId.name} (${v.status})`).join(", ") || "None"}
              </Typography>

              <Box sx={{ mt: 2 }}>
                {isVolunteer && emergency.status === "In Progress" && !volunteerMarkedCompleted && (
                  <Tooltip title="Mark this emergency as completed">
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DoneIcon />}
                      onClick={handleMarkCompleted}
                      sx={{ mr: 2, "&:hover": { transform: "scale(1.05)", transition: "transform 0.2s" } }}
                    >
                      Mark as Completed
                    </Button>
                  </Tooltip>
                )}
                {isVolunteer && volunteerMarkedCompleted && emergency.status === "In Progress" && (
                  <Typography variant="body1" sx={{ color: "#ff9800", fontWeight: 500 }}>
                    Waiting for Victim Approval
                  </Typography>
                )}
                {isVictim &&
                  emergency.status === "In Progress" &&
                  emergency.volunteers.some((v) => v.status === "Completed") &&
                  !emergency.victimApproval && (
                    <Tooltip title="Approve the completion of this emergency">
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleApprove}
                        sx={{ "&:hover": { transform: "scale(1.05)", transition: "transform 0.2s" } }}
                      >
                        Approve Completion
                      </Button>
                    </Tooltip>
                  )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#34495e", textAlign: "center",                 marginBottom:"-10px" }}>
              History
            </Typography>
              <List>
                {emergency.history.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={`${entry.action} by ${entry.userId?.name || "Unknown"}`}
                        secondary={new Date(entry.timestamp).toLocaleString()}
                        primaryTypographyProps={{ color: "#263238" }}
                        secondaryTypographyProps={{ color: "#607d8b" }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Thank You Message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{ mt: 4, textAlign: "center" }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#4caf50", fontWeight: 500,textAlign: "center", marginTop:"40px" }}
          >
            {isVolunteer
              ? "Thank you for your heroic efforts in helping during this emergency!"
              : isVictim
              ? "We’re glad you’re safe! Thank you for your trust in our volunteers."
              : ""}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default EmergencyTracking;