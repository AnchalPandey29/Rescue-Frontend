import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Link,
} from "@mui/material";
import { 
  MedicalServices as MedicalIcon, 
  ExpandMore as ExpandMoreIcon,
  LocalFireDepartment,
  Healing,
  Sick,
  AcUnit,
  WbSunny,
  Warning,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const PRIMARY_COLOR = "#d32f2f"; // Red for urgency
const ACCENT_COLOR = "#1976d2"; // Blue for contrast
const BACKGROUND_GRADIENT = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)";

const MotionCard = motion(Card);
const MotionIcon = motion(MedicalIcon);

const firstAidSteps = [
  {
    title: "CPR",
    icon: <MedicalIcon sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "For cardiac arrest",
    steps: [
      "Check responsiveness by tapping and shouting.",
      "Call emergency services immediately.",
      "Perform chest compressions: 100-120 per minute, 2 inches deep.",
      "Give 2 rescue breaths after 30 compressions if trained.",
    ],
    video: "https://youtu.be/BQNNOh8c8ks?si=8GQlOCpsPlk8WciO", 
  },
  {
    title: "Choking",
    icon: <Sick sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Blocked airway",
    steps: [
      "Encourage coughing to dislodge the blockage.",
      "Perform 5 back blows between the shoulder blades with the heel of your hand.",
      "Give 5 abdominal thrusts (Heimlich maneuver) if back blows fail.",
      "Repeat until the obstruction is cleared or help arrives.",
    ],
    video: "https://youtu.be/MkTZlRyXQiY?si=p_wbJyGAdIVJQM65", 
  },
  {
    title: "Severe Bleeding",
    icon: <Healing sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Heavy blood loss",
    steps: [
      "Apply firm, direct pressure with a clean cloth or bandage.",
      "Elevate the wound above heart level if possible.",
      "Secure with a tight bandage; add more layers if bleeding soaks through.",
      "Seek medical help immediately if bleeding doesn’t stop.",
    ],
    video: "https://youtu.be/NxO5LvgqZe0?si=Wx3T9DH1S4tx5NCt", 
  },
  {
    title: "Burns",
    icon: <LocalFireDepartment sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Thermal injury",
    steps: [
      "Cool the burn with cool (not cold) running water for 10-15 minutes.",
      "Remove tight clothing or jewelry near the burn, if not stuck.",
      "Cover with a sterile, non-stick dressing or clean cloth.",
      "Do not apply ice, butter, or ointments; seek help for severe burns.",
    ],
    video: "https://youtu.be/XJGPzl3ENKo?si=_dTsZlyjNSYdbP4K",
  },
  {
    title: "Fractures",
    icon: <Healing sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Broken bones",
    steps: [
      "Keep the injured area still—do not attempt to realign the bone.",
      "Support the injury with a splint or padding (e.g., rolled towel).",
      "Apply ice packs wrapped in cloth to reduce swelling.",
      "Seek medical attention promptly; call emergency if severe.",
    ],
    video: "https://youtu.be/2v8vlXgGXwE?si=4uo8QfmVNeVSkVvz", 
  },
  {
    title: "Poisoning",
    icon: <Warning sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Toxic ingestion",
    steps: [
      "Identify the poison if possible and keep the container.",
      "Call poison control or emergency services immediately.",
      "Do not induce vomiting unless instructed by a professional.",
      "If safe, give small sips of water; monitor breathing and consciousness.",
    ],
    video: "https://youtu.be/S5qK35nCyeA?si=EeVZ3US3yjOftlbo", 
  },
  {
    title: "Heatstroke",
    icon: <WbSunny sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Overheating",
    steps: [
      "Move the person to a cool, shaded area.",
      "Cool them rapidly with water, wet cloths, or a fan.",
      "Offer sips of cool water if they’re conscious and able to drink.",
      "Seek emergency help if symptoms (e.g., confusion, no sweating) persist.",
    ],
    video: "https://youtu.be/_UT7PO_gd50?si=AbS42dH_RbQ8It7C", 
  },
  {
    title: "Hypothermia",
    icon: <AcUnit sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Extreme cold",
    steps: [
      "Move the person to a warm, dry place.",
      "Remove wet clothing and wrap them in blankets or warm layers.",
      "Provide warm (not hot) drinks if they’re conscious.",
      "Seek medical help if shivering stops or confusion increases.",
    ],
    video: "https://youtu.be/69aOm_rPHPk?si=qIUY1_UV0ztPmgBv",
  },
  {
    title: "Allergic Reaction",
    icon: <Warning sx={{ color: PRIMARY_COLOR, fontSize: 36 }} />,
    tooltip: "Anaphylaxis",
    steps: [
      "Check for an epinephrine auto-injector (e.g., EpiPen) and use it if available.",
      "Call emergency services immediately.",
      "Keep the person calm and lying down with legs elevated if possible.",
      "Monitor breathing; perform CPR if they stop breathing.",
    ],
    video: "https://youtu.be/ZYJPmC0DmQM?si=z_GpUHKRGcZq04L5", 
  },
];

const FirstAidGuide = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
          First Aid Essentials
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "Open Sans, sans-serif",
            textAlign: "center", 
            mb: 5, 
            color: "#64748b",
            fontSize: { xs: "1rem", md: "1.25rem" }
          }}
        >
          Quick, life-saving steps for any emergency—watch and learn!
        </Typography>
      </motion.div>

      {/* Guide List */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          {firstAidSteps.map((step, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(211, 47, 47, 0.15)" }}
              sx={{ 
                bgcolor: "#fff", 
                borderRadius: "16px", 
                mb: 2, 
                border: `1px solid rgba(211, 47, 47, 0.1)` 
              }}
            >
              <Accordion
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{ boxShadow: "none" }}
              >
                <AccordionSummary
                  expandIcon={
                    <MotionIcon
                      whileHover={{ rotate: 180, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                      sx={{ color: ACCENT_COLOR }}
                    >
                      <ExpandMoreIcon />
                    </MotionIcon>
                  }
                  sx={{ 
                    bgcolor: "#fff", 
                    "&:hover": { bgcolor: "#f8f8f8" },
                    borderBottom: expanded === index ? "none" : "1px solid rgba(211, 47, 47, 0.1)"
                  }}
                >
                  <Tooltip title={step.tooltip} arrow>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.div>
                  </Tooltip>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600, 
                      color: PRIMARY_COLOR, 
                      ml: 2,
                      fontSize: { xs: "1.1rem", md: "1.25rem" }
                    }}
                  >
                    {step.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "#fafafa" }}>
                  <CardContent>
                    {step.steps.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontFamily: "Open Sans, sans-serif",
                            color: "#455a64", 
                            mb: 1.5,
                            fontSize: { xs: "0.95rem", md: "1rem" }
                          }}
                        >
                          <strong>{i + 1}.</strong> {s}
                        </Typography>
                      </motion.div>
                    ))}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: "Open Sans, sans-serif",
                        color: ACCENT_COLOR, 
                        mt: 2,
                        fontStyle: "italic"
                      }}
                    >
                      Watch a demonstration:{" "}
                      <Link 
                        href={step.video} 
                        target="_blank" 
                        rel="noopener" 
                        sx={{ color: ACCENT_COLOR, textDecoration: "underline" }}
                      >
                        Video Tutorial
                      </Link>
                    </Typography>
                  </CardContent>
                </AccordionDetails>
              </Accordion>
            </MotionCard>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FirstAidGuide;