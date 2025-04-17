import React, { useState } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import { motion } from "framer-motion";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmergencyIcon from "@mui/icons-material/Emergency";

const iconData = [
  {
    id: 1,
    icon: <SupportAgentIcon fontSize="large" />,
    title: "24/7 Assistance",
    description: "We are always available to assist you in emergencies.",
  },
  {
    id: 2,
    icon: <SecurityIcon fontSize="large" />,
    title: "Secure & Reliable",
    description: "Your safety is our top priority with trusted services.",
  },
  {
    id: 3,
    icon: <VerifiedIcon fontSize="large" />,
    title: "Certified Professionals",
    description: "Our team consists of verified and skilled professionals.",
  },
  {
    id: 4,
    icon: <LocalHospitalIcon fontSize="large" />,
    title: "Medical Assistance",
    description: "Instant medical help during emergency situations.",
  },
  {
    id: 5,
    icon: <EmergencyIcon fontSize="large" />,
    title: "Quick Response",
    description: "Faster response time for all rescue operations.",
  },
];

const AboutUs = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 🔴 Top Section (1/3) - Gradient Background */}
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #482F41, #712F3A)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: { xs: "20px", sm: "40px" },
        }}
      >
        {/* 🔹 Header */}
        <Typography variant="h3" fontWeight="bold">
          About Us
        </Typography>

        {/* 🔹 Highlighted Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h6" color="#fa255e" mt={2} fontWeight="bold" sx={{textShadow: "1px 1px 1px rgba(215, 60, 78, 0.8)",}}>
            "RescueChain - Fast, Secure, and Reliable Emergency Assistance"
          </Typography>
        </motion.div>
      </Box>

      {/* 🟠 Bottom Section (2/3) - Light Pink Background */}
      <Box
        sx={{
          flex: 2,
          background: "rgba(250, 224, 228, 0.64)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "30px", sm: "50px", md: "50px" },
          textAlign: "center",
        }}
      >
        {/* 🔹 Concise Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Typography
            variant="body1"
            maxWidth="600px"
            textAlign="center"
            fontSize={{ xs: "14px", sm: "16px" }}
            px={{ xs: 2, sm: 3 }}
          >
            RescueChain is dedicated to providing immediate support in crisis situations.
            Our secure and rapid response system ensures help reaches you when you need it most. 
            From medical aid to emergency rescue, we've got you covered.
          </Typography>
        </motion.div>

        {/* 🔹 Interactive Icons Section */}
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Grid container spacing={5} justifyContent="center">
            {iconData.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={2.4}>
                <motion.div
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "15px",
                    borderRadius: "10px",
                    transition: "all 0.3s ease-in-out",
                  }}
                  animate={{
                    scale: hoveredId === item.id ? 1.2 : 1,
                    background: hoveredId === item.id ? "#fa255e" : "transparent",
                    color: hoveredId === item.id ? "#fff" : "#000",
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" mt={1}>
                    {item.title}
                  </Typography>
                  {hoveredId === item.id && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontSize: "14px",
                        color: "#fff",
                        marginTop: "5px",
                      }}
                    >
                      {item.description}
                    </motion.p>
                  )}
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;
