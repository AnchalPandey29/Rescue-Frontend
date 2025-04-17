import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion, useAnimation, useInView } from "framer-motion";

// Color Palette (Aligned with VolunteerDashboard.jsx)
const PRIMARY_COLOR = "#1e88e5"; // Blue (from Volunteer button)
const SECONDARY_COLOR = "#263238"; // Dark Slate (from Card titles)
const ACCENT_COLOR = "#e91e63"; // Pink (from Reset button)
const BACKGROUND_COLOR = "#f4f6f8"; // Light Gray (from Dashboard background)
const CARD_BG = "#ffffff"; // White (from Cards)
const TEXT_SECONDARY = "#607d8b"; // Gray-Blue (from Card details)
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)"; // Subtle shadow

// Styled Components
const VideoBackground = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  zIndex: -1,
});

const VideoElement = styled("video")({
  width: "100%",
  height: "100vh",
  objectFit: "cover",
  filter: "brightness(0.85)",
});

const VideoOverlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  background: `linear-gradient(135deg, rgba(30, 136, 229, 0.8), rgba(38, 50, 56, 0.7))`, // Matches PRIMARY and SECONDARY
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: { xs: "20px", sm: "40px" },
});

const StyledButton = styled(Button)({
  background: PRIMARY_COLOR,
  color: "#fff",
  borderRadius: "10px",
  padding: "12px 30px",
  fontSize: "1.1rem",
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  boxShadow: `0 4px 15px ${SHADOW_COLOR}`,
  textTransform: "none",
  "&:hover": {
    background: "#1565c0", // Darker blue on hover
    boxShadow: `0 6px 20px rgba(30, 136, 229, 0.4)`,
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
});

const Section = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: CARD_BG,
  borderRadius: "15px",
  margin: theme.spacing(6, "auto"),
  boxShadow: `0 8px 24px ${SHADOW_COLOR}`,
  maxWidth: "1200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const CardContainer = styled(Card)({
  background: CARD_BG,
  borderRadius: "12px",
  boxShadow: `0 6px 20px ${SHADOW_COLOR}`,
  transition: "all 0.3s ease",
  height: "100%", // Uniform height
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 32px rgba(0, 0, 0, 0.15)`,
    border: `1px solid ${PRIMARY_COLOR}`,
  },
});

const ParallaxBox = styled(motion.div)({
  position: "relative",
  zIndex: 1,
  background: BACKGROUND_COLOR,
  marginTop: "100vh",
  paddingTop: "40px",
  borderTopLeftRadius: "40px",
  borderTopRightRadius: "40px",
  boxShadow: `0 -10px 30px ${SHADOW_COLOR}`,
});

// Animation Variants
const overlayVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
  pulse: { scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HomePage = () => {
  const whyRef = useRef(null);
  const whatRef = useRef(null);
  const whyInView = useInView(whyRef, { once: true, margin: "-100px" });
  const whatInView = useInView(whatRef, { once: true, margin: "-100px" });
  const whyControls = useAnimation();
  const whatControls = useAnimation();

  useEffect(() => {
    if (whyInView) whyControls.start("visible");
    if (whatInView) whatControls.start("visible");
  }, [whyInView, whatInView, whyControls, whatControls]);

  return (
    <div>
      {/* Video Background */}
      <VideoBackground>
        <VideoElement autoPlay loop muted playsInline>
          <source src="/rescue.webm" type="video/webm" />
          Your browser does not support the video tag.
        </VideoElement>
      </VideoBackground>

      {/* Video Overlay */}
      <VideoOverlay>
        <motion.div variants={overlayVariants} initial="hidden" animate="visible">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "4rem", md: "5.5rem" },
              color: "#fff",
              textShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
              mb: 2,
            }}
          >
            RescueChain
          </Typography>
        </motion.div>
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontSize: { xs: "1.1rem", sm: "1.6rem" },
              maxWidth: "800px",
              lineHeight: 1.6,
              fontFamily: "'Poppins', sans-serif",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              mb: 4,
            }}
          >
            Empowering disaster response with blockchain transparency and rapid relief coordination.
          </Typography>
        </motion.div>
        <motion.div
          variants={buttonVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, ...buttonVariants.pulse }}
          whileHover="hover"
          whileTap="tap"
          transition={{ delay: 0.6 }}
        >
          <StyledButton variant="contained" href="/about-us">
            Learn More
          </StyledButton>
        </motion.div>
      </VideoOverlay>

      {/* Parallax Content */}
      <ParallaxBox
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Why RescueChain Section */}
        <Section ref={whyRef}>
          <motion.div
            initial="hidden"
            animate={whyControls}
            variants={overlayVariants}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: SECONDARY_COLOR,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.5px",
                mb: 6,
              }}
            >
              Why RescueChain?
            </Typography>
          </motion.div>
          <Grid container justifyContent="center" spacing={3}>
            {[
              {
                icon: "🚨",
                title: "Rapid Response",
                description:
                  "Swiftly connecting victims to emergency services with real-time coordination.",
              },
              {
                icon: "🔗",
                title: "Blockchain Trust",
                description:
                  "Secure, tamper-proof records for transparent accountability.",
              },
              {
                icon: "📊",
                title: "Resource Efficiency",
                description:
                  "Optimizing relief distribution with data-driven insights.",
              },
            ].map((point, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={whyControls}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CardContainer>
                    <CardContent sx={{ textAlign: "center", p: 3, minHeight: "260px" }}>
                      <Typography
                        variant="h3"
                        sx={{ fontSize: "3rem", color: PRIMARY_COLOR, mb: 2 }}
                      >
                        {point.icon}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: SECONDARY_COLOR,
                          fontFamily: "'Poppins', sans-serif",
                          mb: 2,
                        }}
                      >
                        {point.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: TEXT_SECONDARY,
                          fontSize: "1.1rem",
                          lineHeight: 1.6,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {point.description}
                      </Typography>
                    </CardContent>
                  </CardContainer>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Section>

        {/* What We Do Section */}
        <Section ref={whatRef}>
          <motion.div
            initial="hidden"
            animate={whatControls}
            variants={overlayVariants}
          >
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: SECONDARY_COLOR,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.5px",
                mb: 6,
              }}
            >
              What We Do?
            </Typography>
          </motion.div>
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: "🚑",
                title: "Medical Aid",
                description:
                  "Immediate healthcare support for critical situations.",
              },
              {
                icon: "🏥",
                title: "Relief Coordination",
                description:
                  "Organizing volunteers and donations for maximum impact.",
              },
              {
                icon: "🛠️",
                title: "Infrastructure Recovery",
                description:
                  "Restoring essential services post-disaster.",
              },
              {
                icon: "📦",
                title: "Supply Management",
                description:
                  "Efficient delivery of food, water, and essentials.",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate={whatControls}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CardContainer>
                    <CardContent sx={{ textAlign: "center", p: 3, minHeight: "260px" }}>
                      <Typography
                        variant="h3"
                        sx={{ fontSize: "3rem", color: ACCENT_COLOR, mb: 2 }}
                      >
                        {service.icon}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: SECONDARY_COLOR,
                          fontFamily: "'Poppins', sans-serif",
                          mb: 2,
                        }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: TEXT_SECONDARY,
                          fontSize: "1.1rem",
                          lineHeight: 1.6,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </CardContainer>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Section>
      </ParallaxBox>
    </div>
  );
};

export default HomePage;