// src/components/VolunteerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Divider,
  Autocomplete,
  TextField,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion } from "framer-motion";
import { getActiveEmergencies, volunteerForEmergency } from "../services/apiCalls";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { useAuth } from "../AuthContext";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.MapApi; // Replace with your working key

// Load Google Maps script dynamically
function loadScript(src, position, callback) {
  if (!document.querySelector("#google-maps")) {
    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", "google-maps");
    script.src = src;
    script.onload = callback;
    position.appendChild(script);
    return script;
  }
  return null;
}

// Fallback suggestions for testing
const fallbackSuggestions = [
  {
    description: "Lucknow, Uttar Pradesh, India",
    structured_formatting: {
      main_text: "Lucknow",
      main_text_matched_substrings: [{ offset: 0, length: 7 }],
      secondary_text: "Uttar Pradesh, India",
    },
  },
  {
    description: "Ludhiana, Punjab, India",
    structured_formatting: {
      main_text: "Ludhiana",
      main_text_matched_substrings: [{ offset: 0, length: 8 }],
      secondary_text: "Punjab, India",
    },
  },
  {
    description: "Mumbai, Maharashtra, India",
    structured_formatting: {
      main_text: "Mumbai",
      main_text_matched_substrings: [{ offset: 0, length: 6 }],
      secondary_text: "Maharashtra, India",
    },
  },
];

// Debounced fetch for Google Maps Places API (simplified, no coordinates needed)
const fetchPlaces = debounce(async (request, callback) => {
  try {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      throw new Error("Google Maps API not fully loaded");
    }

    const { suggestions } =
      await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
        request
      );
    console.log("Google Maps Suggestions Raw:", suggestions);

    const enrichedSuggestions = suggestions.map((suggestion) => {
      const place = suggestion.placePrediction;
      return {
        description: place.text.text,
        structured_formatting: {
          main_text: place.mainText.text,
          main_text_matched_substrings: place.mainText.matches.map((match) => ({
            offset: match.startOffset,
            length: match.endOffset - match.startOffset,
          })),
          secondary_text: place.secondaryText?.text || "",
        },
      };
    });

    console.log("Enriched Suggestions:", enrichedSuggestions);
    callback(enrichedSuggestions);
  } catch (err) {
    console.error("Google Maps API Error:", err);
    const filteredFallback = fallbackSuggestions.filter((suggestion) =>
      suggestion.description.toLowerCase().includes(request.input.toLowerCase())
    );
    console.log("Using fallback suggestions:", filteredFallback);
    callback(filteredFallback);
  }
}, 400);

// Severity color mapping
const severityColors = {
  Critical: "#d32f2f", // Red
  High: "#f57c00", // Orange
  Medium: "#0288d1", // Blue
  Low: "#388e3c", // Green
};

const VolunteerDashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [filteredEmergencies, setFilteredEmergencies] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    severity: "",
    resources: [],
  });
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationValue, setLocationValue] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load Google Maps script
  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`,
      document.querySelector("head"),
      () => {
        console.log("Google Maps API Script Loaded");
        const checkPlacesLoaded = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            console.log("Google Maps Places API Fully Loaded");
            setGoogleLoaded(true);
            clearInterval(checkPlacesLoaded);
          }
        }, 100);
      }
    );
  }, []);

  // Fetch location suggestions
  useEffect(() => {
    if (!googleLoaded) {
      console.log("Waiting for Google Maps Places API to load...");
      return;
    }

    let active = true;
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken();

    if (locationInputValue === "") {
      setLocationOptions(locationValue ? [locationValue] : []);
      return;
    }

    console.log("Fetching suggestions for:", locationInputValue);
    fetchPlaces({ input: locationInputValue, sessionToken }, (results) => {
      if (active) {
        let newOptions = results || [];
        if (locationValue) {
          newOptions = [
            locationValue,
            ...results.filter((result) => result.description !== locationValue.description),
          ];
        }
        setLocationOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [googleLoaded, locationValue, locationInputValue]);

  // Fetch emergencies
  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (filters.location) {
          params.append("location", filters.location); // Send location as a string
        }
        if (filters.type) params.append("type", filters.type);
        if (filters.severity) params.append("severity", filters.severity);
        if (filters.resources.length > 0) params.append("resources", filters.resources.join(","));
        if (sortBy) params.append("sortBy", sortBy);

        console.log("Sending params:", params.toString());
        const response = await getActiveEmergencies(params.toString());
        console.log("API Response:", response);

        if (response.status && response.status >= 400) {
          throw new Error(response.message || "Failed to fetch emergencies");
        }

        const emergencyData = Array.isArray(response.data) ? response.data : [];
        console.log("Emergency Data:", emergencyData);
        setEmergencies(emergencyData);
        setFilteredEmergencies(emergencyData); // Initially set filtered to all
        setLoading(false);
      } catch (error) {
        console.error("Error fetching emergencies:", error);
        setError(error.message || "Failed to load emergencies");
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, [filters, sortBy]);

  // Frontend filter for location (string-based with guard)
  useEffect(() => {
    if (!filters.location) {
      setFilteredEmergencies(emergencies);
      return;
    }

    const filtered = emergencies.filter((emergency) => {
      const location = emergency.location || ""; // Fallback to empty string if undefined
      return location.toLowerCase().includes(filters.location.toLowerCase());
    });
    console.log("Filtered Emergencies by Location:", filtered);
    setFilteredEmergencies(filtered);
  }, [emergencies, filters.location]);

  const handleVolunteer = async (emergencyId) => {
    try {
      await volunteerForEmergency(emergencyId);
      alert("You have successfully volunteered!");
      navigate(`/dashboard/emergency/${emergencyId}`);
    } catch (err) {
      console.error("Error volunteering:", err);
      setError("Failed to volunteer. Please try again.");
    }
  };

  const handleResourceChange = (event) => {
    setFilters({ ...filters, resources: event.target.value });
  };

  const resetFilters = () => {
    setFilters({ location: "", type: "", severity: "", resources: [] });
    setSortBy("");
    setLocationValue(null);
    setLocationInputValue("");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1a237e",
            mb: 4,
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Emergency Reports
        </Typography>
      </motion.div>

      {/* Filter Section */}
      <Paper
        elevation={6}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ffffff 0%, #e8ecef 100%)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#34495e", mb: 2, fontFamily: "'Poppins', sans-serif" }}
          >
            Filter & Sort Emergencies
          </Typography>
          <Divider sx={{ mb: 3, borderColor: "#e0e0e0" }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.description
                }
                filterOptions={(x) => x}
                options={locationOptions}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={locationValue}
                noOptionsText="No locations"
                onChange={(event, newValue) => {
                  setLocationOptions(newValue ? [newValue, ...locationOptions] : locationOptions);
                  setLocationValue(newValue);
                  setFilters({
                    ...filters,
                    location: newValue ? newValue.description : "",
                  });
                }}
                onInputChange={(event, newInputValue) => {
                  setLocationInputValue(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Location"
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#cfd8dc" },
                        "&:hover fieldset": { borderColor: "#90a4ae" },
                        "&.Mui-focused fieldset": { borderColor: "#1e88e5" },
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const matches = option.structured_formatting.main_text_matched_substrings;
                  const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length])
                  );
                  return (
                    <li key={key} {...optionProps}>
                      <Grid container sx={{ alignItems: "center" }}>
                        <Grid item sx={{ display: "flex", width: 44 }}>
                          <LocationOnIcon sx={{ color: "#78909c" }} />
                        </Grid>
                        <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                          {parts.map((part, index) => (
                            <Box
                              key={index}
                              component="span"
                              sx={{
                                fontWeight: part.highlight ? 600 : 400,
                                color: "#263238",
                              }}
                            >
                              {part.text}
                            </Box>
                          ))}
                          {option.structured_formatting.secondary_text && (
                            <Typography variant="body2" sx={{ color: "#607d8b" }}>
                              {option.structured_formatting.secondary_text}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </li>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  label="Type"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#90a4ae" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e88e5" },
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {["Fire", "Flood", "Earthquake", "Accident", "Medical Emergency", "Crime", "Other"].map(
                    (t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  label="Severity"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#90a4ae" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e88e5" },
                  }}
                >
                  <MenuItem value="">All Severities</MenuItem>
                  {["Critical", "High", "Medium", "Low"].map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Resources Needed</InputLabel>
                <Select
                  multiple
                  value={filters.resources}
                  onChange={handleResourceChange}
                  label="Resources Needed"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" color="primary" />
                      ))}
                    </Box>
                  )}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#90a4ae" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e88e5" },
                  }}
                >
                  {["medicalAid", "food", "shelter", "clothes", "rescueTeam", "firefighters", "lawEnforcement"].map(
                    (r) => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd8dc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#90a4ae" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e88e5" },
                  }}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="severity">Severity</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="time">Time (Newest)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetFilters}
                fullWidth
                sx={{
                  mt: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#e91e63",
                  borderColor: "#e91e63",
                  "&:hover": { backgroundColor: "#fce4ec", borderColor: "#f06292" },
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </motion.div>
      </Paper>

      {/* Emergency List */}
      {loading ? (
        <Typography variant="h6" align="center" sx={{ color: "#78909c", fontFamily: "'Poppins', sans-serif" }}>
          Loading emergencies...
        </Typography>
      ) : error ? (
        <Typography variant="h6" align="center" sx={{ color: "#d32f2f", fontFamily: "'Poppins', sans-serif" }}>
          {error}
        </Typography>
      ) : filteredEmergencies.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#78909c", fontFamily: "'Poppins', sans-serif" }}>
          No active emergencies found
        </Typography>
      ) : (
        <Grid container spacing={3}>
        {filteredEmergencies.map((emergency, index) => (
          <Grid item xs={12} sm={6} md={4} key={emergency._id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  borderLeft: `6px solid ${severityColors[emergency.severity] || "#9e9e9e"}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ padding: "20px" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#263238", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    {emergency.type}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: severityColors[emergency.severity] || "#9e9e9e", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    <strong>Severity:</strong> {emergency.severity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#607d8b", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    <strong>Location:</strong> {emergency.location || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#607d8b", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    <strong>Needs:</strong>{" "}
                    {Object.keys(emergency.emergencyNeeds || {})
                      .filter((k) => emergency.emergencyNeeds[k])
                      .join(", ") || "None"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#607d8b", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    <strong>Reported By:</strong> {emergency.reportedBy?.name || "Unknown"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#607d8b", fontFamily: "'Poppins', sans-serif", mb: 1 }}>
                    <strong>Time:</strong> {new Date(emergency.time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#607d8b", fontFamily: "'Poppins', sans-serif" }}>
                    <strong>Status:</strong> {emergency.status}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", padding: "16px 20px" }}>
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 500,
                      backgroundColor: "#1e88e5",
                      "&:hover": { backgroundColor: "#1565c0" },
                      padding: "6px 20px",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    onClick={() => handleVolunteer(emergency._id)}
                    disabled={emergency.status !== "Pending" || !user}
                  >
                    Volunteer
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      )}
    </Box>
  );
};

export default VolunteerDashboard;