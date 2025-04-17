// src/components/VolunteerHistory.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Tooltip,
  Chip,
} from "@mui/material";
import { TrackChanges as TrackIcon, Sort as SortIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getVolunteerHistory } from "../services/apiCalls";
import { useAuth } from "../AuthContext";

const VolunteerHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("completedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getVolunteerHistory();
        console.log("Volunteer history:", response.data);
        setHistory(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching volunteer history:", err.response || err);
        setError(err.response?.data?.message || "Failed to load volunteer history");
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
    setHistory((prev) =>
      [...prev].sort((a, b) => {
        const valA = a[field] || "";
        const valB = b[field] || "";
        return isAsc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      })
    );
  };

  const handleTrack = (emergencyId) => {
    navigate(`/dashboard/emergency/${emergencyId}`);
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1a237e", textAlign: "center" }}
        >
          My Volunteer History
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 1000,
            mx: "auto",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #ffffff 0%, #e8ecef 100%)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600, color: "#263238", cursor: "pointer" }}
                  onClick={() => handleSort("emergencyId")}
                >
                  Emergency ID <SortIcon fontSize="small" />
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#263238", cursor: "pointer" }}
                  onClick={() => handleSort("type")}
                >
                  Type <SortIcon fontSize="small" />
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#263238", cursor: "pointer" }}
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon fontSize="small" />
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#263238", cursor: "pointer" }}
                  onClick={() => handleSort("completedAt")}
                >
                  Completed At <SortIcon fontSize="small" />
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#263238", cursor: "pointer" }}
                  onClick={() => handleSort("incentivesEarned")}
                >
                  Incentives <SortIcon fontSize="small" />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#263238" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ backgroundColor: "#f5f5f5", transition: { duration: 0.2 } }}
                  >
                    <TableCell>{entry.emergencyId}</TableCell>
                    <TableCell>{entry.type || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={entry.status}
                        color={entry.status === "Completed" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {entry.completedAt ? new Date(entry.completedAt).toLocaleString() : "Pending"}
                    </TableCell>
                    <TableCell>{entry.incentivesEarned || 0} points</TableCell>
                    <TableCell>
                      <Tooltip title="Track this emergency">
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<TrackIcon />}
                          onClick={() => handleTrack(entry.emergencyId)}
                          sx={{ "&:hover": { transform: "scale(1.05)", transition: "transform 0.2s" } }}
                        >
                          Track
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No volunteer history found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
};

export default VolunteerHistory;