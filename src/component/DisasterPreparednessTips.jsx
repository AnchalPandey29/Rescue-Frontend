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
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { 
  Search as SearchIcon, 
  Clear as ClearIcon, 
  LocalFireDepartment, 
  Flood, 
  CarCrash, 
  Favorite, 
  ElectricBolt,
  Vibration,  // Replaced Earthquake
  Storm,      // Replaced Tornado
  PowerOff,
  Warning,
  Pets
} from "@mui/icons-material";
import { motion } from "framer-motion";

const PRIMARY_COLOR = "#1e40af";
const ACCENT_COLOR = "#f97316";
const BACKGROUND_GRADIENT = "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)";

const MotionCard = motion(Card);

const preparednessTips = [
  {
    title: "Fire Safety",
    description: "Stay low, use exits, and avoid smoke inhalation.",
    icon: <LocalFireDepartment sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Install smoke alarms on every level of your home and test them monthly.",
      "Plan and practice two escape routes from each room.",
      "If caught in smoke, crawl low under it to an exit—smoke rises.",
      "Use a fire extinguisher: Pull, Aim, Squeeze, Sweep (PASS).",
      "Never re-enter a burning building—call emergency services from outside."
    ]
  },
  {
    title: "Flood Preparedness",
    description: "Move to higher ground and avoid floodwaters.",
    icon: <Flood sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Know your area’s flood risk and evacuation routes.",
      "Elevate appliances and valuables above potential flood levels.",
      "Avoid walking or driving through floodwaters—6 inches can sweep you away.",
      "Prepare an emergency kit with water, food, and sandbags.",
      "Turn off utilities if flooding is imminent and time permits."
    ]
  },
  {
    title: "Accident Response",
    description: "Ensure safety, call help, and provide first aid.",
    icon: <CarCrash sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Secure the scene—turn on hazard lights and set up warning signs if possible.",
      "Call emergency services immediately with your exact location.",
      "Check for injuries and provide first aid—apply pressure to bleeding wounds.",
      "Do not move injured persons unless they’re in immediate danger.",
      "Stay calm and follow dispatcher instructions until help arrives."
    ]
  },
  {
    title: "Heart Attack Action",
    description: "Recognize signs, call help, and assist calmly.",
    icon: <Favorite sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Recognize symptoms: chest pain, shortness of breath, nausea.",
      "Call emergency services immediately—don’t delay.",
      "If conscious, have the person sit or lie down and stay calm.",
      "Administer aspirin (if not allergic) to chew slowly—325 mg dose.",
      "Perform CPR if trained and the person stops breathing."
    ]
  },
  {
    title: "Electric Shock Safety",
    description: "Turn off power and avoid direct contact.",
    icon: <ElectricBolt sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Turn off the power source if safe—do not touch the person directly.",
      "Use a non-conductive object (e.g., wooden stick) to separate them from the source.",
      "Call emergency services as soon as the person is safe.",
      "Check for breathing and pulse—begin CPR if trained and needed.",
      "Keep the person warm and still until help arrives."
    ]
  },
  {
    title: "Earthquake Readiness",
    description: "Drop, cover, and hold on during shaking.",
    icon: <Vibration sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Secure heavy objects and furniture to prevent tipping.",
      "Identify safe spots—under sturdy tables or against interior walls.",
      "When shaking starts, drop to your hands and knees, cover your head, and hold on.",
      "Stay indoors until shaking stops; avoid doorways and windows.",
      "Afterward, check for injuries and gas leaks—evacuate if unsafe."
    ]
  },
  {
    title: "Tornado Protection",
    description: "Seek shelter in a basement or interior room.",
    icon: <Storm sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Monitor weather alerts for tornado warnings.",
      "Identify a safe room—basement, storm shelter, or interior room on the lowest floor.",
      "Stay away from windows, doors, and outside walls.",
      "Protect yourself with mattresses, helmets, or heavy furniture.",
      "After the tornado, avoid downed power lines and damaged buildings."
    ]
  },
  {
    title: "Power Outage Plan",
    description: "Prepare backup power and stay warm.",
    icon: <PowerOff sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Keep flashlights, batteries, and a battery-powered radio ready.",
      "Store extra blankets and non-perishable food for extended outages.",
      "Unplug appliances to avoid surges when power returns.",
      "Use generators safely—outside, away from windows.",
      "Check on vulnerable neighbors, especially in extreme weather."
    ]
  },
  {
    title: "Chemical Spill Safety",
    description: "Evacuate and avoid inhalation of fumes.",
    icon: <Warning sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "If indoors, close windows and turn off ventilation systems.",
      "Evacuate upwind of the spill—avoid low-lying areas where fumes settle.",
      "Do not touch or walk through spilled substances.",
      "Call emergency services and report the spill’s location and type if known.",
      "Decontaminate by removing clothing and washing skin if exposed."
    ]
  },
  {
    title: "Animal Bite Response",
    description: "Clean the wound and seek medical help.",
    icon: <Pets sx={{ color: ACCENT_COLOR, fontSize: 36 }} />,
    details: [
      "Wash the bite with soap and water for at least 5 minutes.",
      "Apply a clean bandage and control bleeding with pressure.",
      "Seek medical attention immediately—rabies risk may require a vaccine.",
      "Report the incident to local animal control if the animal is unknown.",
      "Monitor for signs of infection: redness, swelling, or fever."
    ]
  }
];

const DisasterPreparednessTips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTip, setSelectedTip] = useState(null);

  const filteredTips = preparednessTips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLearnMore = (tip) => {
    setSelectedTip(tip);
  };

  const handleClose = () => {
    setSelectedTip(null);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: BACKGROUND_GRADIENT,
        minHeight: "100vh",
        color: "#1e293b",
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
            fontWeight: 700, 
            color: PRIMARY_COLOR, 
            textAlign: "center", 
            mb: 2,
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" }
          }}
        >
          Emergency Preparedness Guide
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "Open Sans, sans-serif",
            textAlign: "center", 
            mb: 4, 
            color: "#64748b",
            fontSize: { xs: "1rem", md: "1.25rem" }
          }}
        >
          Equip yourself with the knowledge to face any crisis confidently.
        </Typography>
      </motion.div>

      {/* Search Bar */}
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
              <IconButton onClick={() => setSearchTerm("")}>
                <ClearIcon sx={{ color: ACCENT_COLOR }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ 
          mb: 5, 
          bgcolor: "#fff", 
          borderRadius: "10px", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: PRIMARY_COLOR },
            "&:hover fieldset": { borderColor: ACCENT_COLOR }
          }
        }}
      />

      {/* Tips List */}
      <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="center">
        {filteredTips.map((tip, index) => (
          <Grid 
            item 
            xs={12}    // 1 card per row on mobile (<600px)
            sm={4}     // 3 cards per row on tablet (≥600px)
            md={3}     // 4 cards per row on laptop (≥960px)
            lg={3}     // 4 cards per row on large screens (≥1280px)
            key={index}
          >
            <MotionCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 20px rgba(59, 130, 246, 0.15)" 
              }}
              sx={{ 
                bgcolor: "#fff", 
                borderRadius: "16px", 
                p: 2, 
                border: `1px solid rgba(59, 130, 246, 0.1)`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {tip.icon}
                </motion.div>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600, 
                    color: PRIMARY_COLOR, 
                    mt: 2,
                    fontSize: { xs: "1.1rem", md: "1.25rem" }
                  }}
                >
                  {tip.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: "Open Sans, sans-serif",
                    color: "#64748b", 
                    mt: 1,
                    fontSize: { xs: "0.9rem", md: "1rem" }
                  }}
                >
                  {tip.description}
                </Typography>
              </CardContent>
              <Button
                variant="outlined"
                sx={{ 
                  color: ACCENT_COLOR, 
                  borderColor: ACCENT_COLOR,
                  mt: 2,
                  mb: 2,
                  mx: "auto",
                  display: "block",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": { 
                    backgroundColor: "rgba(249, 115, 22, 0.1)",
                    borderColor: ACCENT_COLOR
                  }
                }}
                onClick={() => handleLearnMore(tip)}
              >
                Learn More
              </Button>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Steps Modal */}
      <Dialog
        open={!!selectedTip}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "12px", p: 2 } }}
      >
        <DialogTitle 
          sx={{ 
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600, 
            color: PRIMARY_COLOR, 
            textAlign: "center",
            fontSize: { xs: "1.25rem", md: "1.5rem" }
          }}
        >
          {selectedTip?.title} Preparedness Steps
        </DialogTitle>
        <DialogContent>
          <List sx={{ p: 0 }}>
            {selectedTip?.details.map((step, index) => (
              <ListItem key={index} sx={{ alignItems: "flex-start", py: 1 }}>
                <ListItemText
                  primary={
                    <Typography 
                      sx={{ 
                        fontFamily: "Open Sans, sans-serif",
                        color: "#1e293b", 
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.6
                      }}
                    >
                      <strong>{index + 1}.</strong> {step}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ 
              mt: 2, 
              mx: "auto", 
              display: "block", 
              backgroundColor: PRIMARY_COLOR,
              "&:hover": { backgroundColor: "#1e3a8a" },
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
              borderRadius: "8px"
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DisasterPreparednessTips;