import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Phone as PhoneIcon, // Fallback for unavailable icons
  LocalHospital,
  LocalPolice,
  LocalFireDepartment,
  Warning,
  Female,
  ChildCare,
  ReportProblem, // Replaced Hiv (not available)
  GasMeter,
  Agriculture,
  Train,
  DirectionsCar,
  Elderly,
  Psychology,
  BeachAccess,
  Traffic,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const PRIMARY_COLOR = "#fa255e";
const BACKGROUND_GRADIENT = "linear-gradient(135deg, #f8bbd0 0%, #fce4ec 100%)";

const MotionCard = motion(Card);

// Updated contacts with available icons or fallbacks
const contacts = [
  { name: "AIDS Helpline", number: "1097", category: "Medical", icon: <ReportProblem sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> }, // Hiv not available
  { name: "Ambulance", number: "102", category: "Medical", icon: <LocalHospital sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Anti-Poison", number: "1066", category: "Medical", icon: <ReportProblem sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Child Helpline", number: "1098", category: "Child Safety", icon: <ChildCare sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Disaster Management", number: "108", category: "Disaster", icon: <Warning sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Domestic Abuse", number: "181", category: "Women Safety", icon: <Female sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Fire Department", number: "101", category: "Fire", icon: <LocalFireDepartment sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Highways Emergency", number: "1033", category: "Transport", icon: <Traffic sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Kisan Call Centre", number: "1551", category: "Agriculture", icon: <Agriculture sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "LPG Leak", number: "1906", category: "Gas Safety", icon: <GasMeter sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Mental Health", number: "1800-599-0019", category: "Mental Health", icon: <Psychology sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "National Emergency", number: "112", category: "General", icon: <PhoneIcon sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Police", number: "100", category: "Police", icon: <LocalPolice sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Railway Accident", number: "1072", category: "Transport", icon: <Train sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Road Accident", number: "1073", category: "Transport", icon: <DirectionsCar sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Senior Citizen", number: "1291", category: "Elderly Support", icon: <Elderly sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Tourist Helpline", number: "1363", category: "Tourism", icon: <BeachAccess sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
  { name: "Women Helpline", number: "1091", category: "Women Safety", icon: <Female sx={{ color: PRIMARY_COLOR, fontSize: 24 }} /> },
];

const EmergencyContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm) ||
      contact.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2, md: 3 },
        bgcolor: BACKGROUND_GRADIENT,
        minHeight: "100vh",
        color: "#712F3A",
      }}
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold", 
            color: PRIMARY_COLOR, 
            textAlign: "center", 
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" }
          }}
        >
          Emergency Contacts (India)
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "Open Sans, sans-serif",
            textAlign: "center", 
            mb: 4, 
            color: "#78909c",
            fontSize: { xs: "0.9rem", md: "1rem" }
          }}
        >
          Quick access to key helplines.
        </Typography>
      </motion.div>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} /></InputAdornment>,
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchTerm("")}>
                <ClearIcon sx={{ color: PRIMARY_COLOR, fontSize: 20 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ 
          mb: 4, 
          bgcolor: "#fff", 
          borderRadius: "8px", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          "& .MuiOutlinedInput-root": { 
            py: 0.75,
            fontSize: "0.9rem",
            "& fieldset": { borderColor: PRIMARY_COLOR },
            "&:hover fieldset": { borderColor: PRIMARY_COLOR }
          }
        }}
      />

      {/* Contacts List */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} justifyContent="center">
        {filteredContacts.map((contact, index) => (
          <Grid 
            item 
            xs={12}
            sm={4}
            md={3}
            lg={2}
            key={index}
          >
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.03, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
              sx={{ 
                bgcolor: "#fff", 
                borderRadius: "12px", 
                p: 1.5,
                minHeight: "auto",
                border: `1px solid rgba(250, 37, 94, 0.1)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <CardContent sx={{ p: 1, textAlign: "center" }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {contact.icon}
                </motion.div>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600, 
                    color: "#712F3A",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    lineHeight: 1.2
                  }}
                >
                  {contact.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: "Open Sans, sans-serif",
                    color: "#78909c",
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    mt: 0.5
                  }}
                >
                  {contact.number}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: "Open Sans, sans-serif",
                    color: "#ff5722", 
                    fontSize: { xs: "0.75rem", md: "0.8rem" }
                  }}
                >
                  {contact.category}
                </Typography>
              </CardContent>
              <Button
                variant="outlined"
                size="small"
                sx={{ 
                  color: PRIMARY_COLOR, 
                  borderColor: PRIMARY_COLOR,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "6px",
                  px: 1.5,
                  py: 0.25,
                  mb: 1,
                  "&:hover": { 
                    backgroundColor: "rgba(250, 37, 94, 0.1)",
                    borderColor: PRIMARY_COLOR
                  }
                }}
                href={`tel:${contact.number}`}
              >
                Call
              </Button>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmergencyContacts;