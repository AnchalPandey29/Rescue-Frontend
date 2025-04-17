import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  RadioGroup,
  Radio,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  Grid,
  Paper,
} from "@mui/material";
import {
  LocationOn,
  PhotoCamera,
  Send,
  AccessTime,
  Delete,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createReport } from "../services/apiCalls";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.MapApi; // Replace with your key

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

// Debounced fetch for Google Maps Places API (no coordinates needed)
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
          secondary_text: place.secondaryText?.text,
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

// Disaster types with descriptions
const disasterTypes = [
  { value: "Fire", label: "Fire", desc: "A blaze causing destruction or injury." },
  { value: "Flood", label: "Flood", desc: "Overflow of water submerging land." },
  { value: "Earthquake", label: "Earthquake", desc: "Sudden shaking of the ground." },
  { value: "Accident", label: "Accident", desc: "Unintentional event causing harm." },
  { value: "Medical Emergency", label: "Medical Emergency", desc: "Urgent health crisis." },
  { value: "Crime", label: "Crime", desc: "Illegal activity requiring intervention." },
  { value: "Other", label: "Other", desc: "Specify a custom incident type." },
];

const severityLevels = ["Critical", "High", "Medium", "Low"];
const steps = ["Disaster Details", "Description & Location", "Files & Review"];

// Hashtags based on disaster type
const disasterHashtags = {
  Fire: ["#FireEmergency", "#RescueTeam", "#Firefighters"],
  Flood: ["#FloodRelief", "#WaterRescue", "#EmergencyShelter"],
  Earthquake: ["#EarthquakeAlert", "#RescueOperation", "#EmergencyResponse"],
  Accident: ["#RoadAccident", "#EmergencyServices", "#RescueTeam"],
  "Medical Emergency": ["#MedicalHelp", "#Ambulance", "#EmergencyCare"],
  Crime: ["#CrimeAlert", "#PoliceHelp", "#EmergencyResponse"],
  Other: ["#EmergencyAlert", "#HelpNeeded", "#DisasterResponse"],
};

// Button animation variants
const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

// Initial form data
const initialFormData = {
  type: "",
  customType: "",
  severity: "",
  description: "",
  location: "", // Changed to string
  time: new Date(),
  tags: [],
  emergencyNeeds: {
    medicalAid: false,
    food: false,
    shelter: false,
    clothes: false,
    dailyEssentials: false,
    rescueTeam: false,
    firefighters: false,
    lawEnforcement: false,
  },
  contact: { phone: "", email: "" },
  emergencyContact: { name: "", phone: "", relationship: "" },
  media: [],
  priority: "",
  manualLat: "", // Still included for manual input option
  manualLng: "",
};

// Color Palette
const PRIMARY_COLOR = "#fa255e"; // Vibrant Pink
const SECONDARY_COLOR = "#712F3A"; // Deep Red
const BACKGROUND_GRADIENT = "linear-gradient(135deg, #f8bbd0 0%, #fce4ec 100%)";

// Form Animation Variants
const formVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const ReportEmergency = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [locationMethod, setLocationMethod] = useState("search");
  const [locationValue, setLocationValue] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [googleLoaded, setGoogleLoaded] = useState(false);

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

  // Fetch user details from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contact: { phone: user.contact || "", email: user.email || "" },
      }));
    }
  }, []);

  // Auto-add hashtags based on disaster type
  useEffect(() => {
    if (formData.type && disasterHashtags[formData.type]) {
      setFormData((prev) => ({
        ...prev,
        tags: [...new Set([...prev.tags, ...disasterHashtags[formData.type]])],
      }));
    }
  }, [formData.type]);

  // Dynamic severity suggestion based on disaster type
  useEffect(() => {
    if (formData.type && !formData.severity) {
      const defaultSeverity = {
        Earthquake: "Critical",
        Fire: "High",
        Flood: "High",
        "Medical Emergency": "Critical",
      }[formData.type] || "Medium";
      setFormData({ ...formData, severity: defaultSeverity });
    }
  }, [formData.type]);

  // Auto-calculate priority
  useEffect(() => {
    const priority =
      formData.severity === "Critical" && ["Earthquake", "Medical Emergency"].includes(formData.type)
        ? "Highest"
        : formData.severity === "Critical"
        ? "High"
        : "Normal";
    setFormData({ ...formData, priority });
  }, [formData.type, formData.severity]);

  // Update location based on manual coordinates (optional string format)
  useEffect(() => {
    if (locationMethod === "current") {
      const lat = parseFloat(formData.manualLat);
      const lng = parseFloat(formData.manualLng);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setFormData((prev) => ({
          ...prev,
          location: `Lat: ${lat}, Lng: ${lng}`, // Store as a string
        }));
      } else {
        setFormData((prev) => ({ ...prev, location: "" }));
      }
    }
  }, [formData.manualLat, formData.manualLng, locationMethod]);

  // Handle emergency needs checkbox changes
  const handleEmergencyNeedsChange = (event) => {
    setFormData({
      ...formData,
      emergencyNeeds: {
        ...formData.emergencyNeeds,
        [event.target.name]: event.target.checked,
      },
    });
  };

  // Get current location using Geolocation API
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData((prev) => ({
            ...prev,
            manualLat: lat.toString(),
            manualLng: lng.toString(),
            location: `Lat: ${lat}, Lng: ${lng}`, // Store as a string
          }));
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to retrieve your location. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Validation for each step
  const validateStep = (currentStep) => {
    let newErrors = {};
    if (currentStep === 0) {
      if (!formData.type) newErrors.type = "Disaster type is required";
      if (formData.type === "Other" && !formData.customType)
        newErrors.customType = "Please specify the disaster";
      if (!formData.severity) newErrors.severity = "Severity is required";
    } else if (currentStep === 1) {
      if (!formData.description) newErrors.description = "Description is required";
      if (!formData.location) newErrors.location = "Location is required"; // Check for non-empty string
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next/previous steps
  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  // Handle media upload with validation
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "video/mp4"].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValidType) alert(`${file.name} is not a supported file type`);
      if (!isValidSize) alert(`${file.name} exceeds 10MB limit`);
      return isValidType && isValidSize;
    });
    setFormData({ ...formData, media: [...formData.media, ...validFiles] });
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFormData({ ...formData, tags: [...formData.tags, e.target.value] });
      e.target.value = "";
      e.preventDefault();
    }
  };

  const handleSubmitButtonClick = async () => {
    if (step === steps.length - 1 && validateStep(step)) {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        const user = JSON.parse(localStorage.getItem("userData"));
        if (user && user._id) {
          formDataToSend.append("reportedBy", user._id);
        } else {
          throw new Error("User ID not found. Please log in again.");
        }
        formDataToSend.append("type", formData.type);
        formDataToSend.append("customType", formData.customType);
        formDataToSend.append("severity", formData.severity);
        formDataToSend.append("description", formData.description);
        if (formData.location) {
          formDataToSend.append("location", formData.location); // Send as string
        } else {
          throw new Error("Location is missing.");
        }
        let reportTime = new Date(formData.time);
        if (!isNaN(reportTime.getTime())) {
          formDataToSend.append("time", reportTime.toISOString());
        } else {
          throw new Error("Invalid date format");
        }
        formDataToSend.append("tags", JSON.stringify(formData.tags));
        formDataToSend.append("emergencyNeeds", JSON.stringify(formData.emergencyNeeds));
        formDataToSend.append("contact", JSON.stringify(formData.contact));
        formDataToSend.append("emergencyContact", JSON.stringify(formData.emergencyContact));
        formDataToSend.append("priority", formData.priority);
        formData.media.forEach((file) => {
          formDataToSend.append("media", file);
        });
        const response = await createReport(formDataToSend);
        if (response.status === 201) {
          toast.success("Emergency report submitted successfully!");
          setFormData(initialFormData);
          setStep(0);
          setLocationValue(null);
          setLocationInputValue("");
        } else {
          const errorMessage = response.data?.message || "Unknown error";
          toast.error(`Failed to submit emergency report: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error submitting emergency report:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "An unexpected error occurred";
        toast.error(`An error occurred while submitting the report: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Prevent form submission on Enter key press
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Save draft
  const saveDraft = () => {
    localStorage.setItem("emergencyDraft", JSON.stringify(formData));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("emergencyDraft");
    if (draft) setFormData(JSON.parse(draft));
  }, []);

  // Enhanced button styles
  const buttonStyles = {
    bgcolor: PRIMARY_COLOR,
    color: "white",
    borderRadius: "20px",
    px: 3,
    py: 1,
    "&:hover": { bgcolor: "#d81b60", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" },
    transition: "all 0.3s",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: BACKGROUND_GRADIENT,
        p: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 900,
          width: "100%",
          p: { xs: 2, sm: 4 },
          borderRadius: "20px",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: 700, color: SECONDARY_COLOR }}>
            🚨 Report an Emergency
          </Typography>
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ "& .MuiStepLabel-label": { fontWeight: 500, color: step >= steps.indexOf(label) ? PRIMARY_COLOR : "grey" } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </motion.div>

        <motion.div variants={formVariants} initial="hidden" animate="visible">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Disaster Details */}
            {step === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.type}>
                    <InputLabel sx={{ color: SECONDARY_COLOR }}>Disaster Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                      aria-describedby="disaster-desc"
                      sx={{ borderRadius: "12px", "& .MuiOutlinedInput-notchedOutline": { borderColor: PRIMARY_COLOR } }}
                    >
                      {disasterTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formData.type && (
                      <Typography variant="caption" id="disaster-desc" sx={{ mt: 1, color: "#78909c" }}>
                        {disasterTypes.find((t) => t.value === formData.type)?.desc}
                      </Typography>
                    )}
                    {errors.type && <Typography color="error">{errors.type}</Typography>}
                  </FormControl>
                </Grid>

                {formData.type === "Other" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Specify Disaster Type"
                      value={formData.customType}
                      onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                      sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                      error={!!errors.customType}
                      helperText={errors.customType}
                      required
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.severity}>
                    <InputLabel sx={{ color: SECONDARY_COLOR }}>Severity Level</InputLabel>
                    <Select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      required
                      sx={{ borderRadius: "12px", "& .MuiOutlinedInput-notchedOutline": { borderColor: PRIMARY_COLOR } }}
                    >
                      {severityLevels.map((level) => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                      ))}
                    </Select>
                    {errors.severity && <Typography color="error">{errors.severity}</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Incident Time"
                      value={formData.time}
                      onChange={(newValue) => setFormData({ ...formData, time: newValue })}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            )}

            {/* Step 2: Description & Location */}
            {step === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: SECONDARY_COLOR }}>Description</Typography>
                  <ReactQuill
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    theme="snow"
                    placeholder="Describe the incident in detail..."
                    style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                  />
                  {errors.description && <Typography color="error">{errors.description}</Typography>}
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ color: SECONDARY_COLOR }}>Location Input Method</Typography>
                    <RadioGroup
                      row
                      value={locationMethod}
                      onChange={(e) => {
                        setLocationMethod(e.target.value);
                        setFormData({
                          ...formData,
                          location: "",
                          manualLat: "",
                          manualLng: "",
                        });
                        setLocationValue(null);
                        setLocationInputValue("");
                      }}
                      sx={{ "& .MuiRadio-root": { color: PRIMARY_COLOR } }}
                    >
                      <FormControlLabel value="search" control={<Radio />} label="Search Location" />
                      <FormControlLabel value="current" control={<Radio />} label="Enter Current Location" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {locationMethod === "search" && (
                  <Grid item xs={12}>
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
                        console.log("Selected location:", newValue); // Debugging
                        setLocationOptions(newValue ? [newValue, ...locationOptions] : locationOptions);
                        setLocationValue(newValue);
                        setFormData({
                          ...formData,
                          location: newValue ? newValue.description : "", // Store as string
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
                          sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                          error={!!errors.location}
                          helperText={errors.location}
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
                                <LocationOn sx={{ color: PRIMARY_COLOR }} />
                              </Grid>
                              <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                                {parts.map((part, index) => (
                                  <Box
                                    key={index}
                                    component="span"
                                    sx={{
                                      fontWeight: part.highlight ? "bold" : "regular",
                                    }}
                                  >
                                    {part.text}
                                  </Box>
                                ))}
                                {option.structured_formatting.secondary_text && (
                                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
                )}

                {locationMethod === "current" && (
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <TextField
                        fullWidth
                        label="Latitude"
                        value={formData.manualLat}
                        onChange={(e) => setFormData({ ...formData, manualLat: e.target.value })}
                        sx={{ mb: 1, mr: 1, flex: 1, minWidth: 120, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                        helperText="Enter a value between -90 and 90"
                      />
                      <TextField
                        fullWidth
                        label="Longitude"
                        value={formData.manualLng}
                        onChange={(e) => setFormData({ ...formData, manualLng: e.target.value })}
                        sx={{ mb: 1, mr: 1, flex: 1, minWidth: 120, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                        helperText="Enter a value between -180 and 180"
                      />
                      <IconButton sx={{ marginTop: "-35px", color: PRIMARY_COLOR }} onClick={getCurrentLocation}>
                        <LocationOn />
                      </IconButton>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: SECONDARY_COLOR }}>
                    Emergency Needs/Resources Required
                  </Typography>
                  <FormGroup sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.medicalAid}
                          onChange={handleEmergencyNeedsChange}
                          name="medicalAid"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Medical Aid"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.food}
                          onChange={handleEmergencyNeedsChange}
                          name="food"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Food"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.shelter}
                          onChange={handleEmergencyNeedsChange}
                          name="shelter"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Shelter"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.clothes}
                          onChange={handleEmergencyNeedsChange}
                          name="clothes"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Clothes"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.dailyEssentials}
                          onChange={handleEmergencyNeedsChange}
                          name="dailyEssentials"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Daily Essentials"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.rescueTeam}
                          onChange={handleEmergencyNeedsChange}
                          
                          name="rescueTeam"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Rescue Team"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.firefighters}
                          onChange={handleEmergencyNeedsChange}
                          name="firefighters"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Firefighters"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
<FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.clothes}
                          onChange={handleEmergencyNeedsChange}
                          name="ambulance"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Ambulance"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emergencyNeeds.lawEnforcement}
                          onChange={handleEmergencyNeedsChange}
                          name="lawEnforcement"
                          sx={{ color: PRIMARY_COLOR }}
                        />
                      }
                      label="Law Enforcement"
                      sx={{ flex: "1 0 30%", bgcolor: "rgba(250, 37, 94, 0.1)", borderRadius: "8px", p: 1 }}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            )}

            {/* Step 3: Files & Review */}
            {step === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<PhotoCamera />}
                      sx={{ ...buttonStyles, mb: 2 }}
                    >
                      Upload Files
                      <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png,video/mp4"
                        multiple
                        onChange={handleMediaUpload}
                      />
                    </Button>
                  </motion.div>
                  {formData.media.map((file, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1, bgcolor: "#f5f5f5", p: 1, borderRadius: "8px" }}>
                      <Typography>{file.name}</Typography>
                      {file.type.startsWith("image") && (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          style={{ width: 50, height: 50, marginLeft: 8, borderRadius: "4px" }}
                        />
                      )}
                      <IconButton
                        onClick={() =>
                          setFormData({
                            ...formData,
                            media: formData.media.filter((_, i) => i !== idx),
                          })
                        }
                      >
                        <Delete sx={{ color: PRIMARY_COLOR }} />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Add Tags (press Enter)"
                    onKeyDown={handleAddTag}
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                  <Box sx={{ mb: 2 }}>
                    {formData.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        onDelete={() =>
                          setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
                        }
                        sx={{ mr: 1, mb: 1, bgcolor: PRIMARY_COLOR, color: "white" }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone (Optional)"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                    }
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Email (Optional)"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                    }
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: SECONDARY_COLOR }}>Emergency Contact (Optional)</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                      })
                    }
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                      })
                    }
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: {
                          ...formData.emergencyContact,
                          relationship: e.target.value,
                        },
                      })
                    }
                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: SECONDARY_COLOR }}>
                    Priority: <strong>{formData.priority || "Calculating..."}</strong>
                  </Typography>
                </Grid>
              </Grid>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2, flexWrap: "wrap" }}>
              {step > 0 && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      ...buttonStyles,
                      bgcolor: "transparent",
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      "&:hover": { bgcolor: "rgba(250, 37, 94, 0.1)" },
                    }}
                  >
                    Back
                  </Button>
                </motion.div>
              )}
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="outlined"
                  onClick={saveDraft}
                  sx={{
                    ...buttonStyles,
                    bgcolor: draftSaved ? "#4caf50" : "transparent",
                    borderColor: PRIMARY_COLOR,
                    color: draftSaved ? "white" : PRIMARY_COLOR,
                    "&:hover": { bgcolor: draftSaved ? "#388e3c" : "rgba(250, 37, 94, 0.1)" },
                  }}
                >
                  {draftSaved ? "Draft Saved!" : "Save Draft"}
                </Button>
              </motion.div>
              {step < steps.length - 1 ? (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button variant="contained" onClick={handleNext} sx={buttonStyles}>
                    Next
                  </Button>
                </motion.div>
              ) : (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                    disabled={loading}
                    onClick={handleSubmitButtonClick}
                    sx={buttonStyles}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </motion.div>
              )}
            </Box>
          </form>
        </motion.div>
      </Paper>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default ReportEmergency;