import React from "react";
import { Container, Grid, Typography, Link, Box, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, GitHub } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(15deg, #1a237e 0%, #3f51b5 100%)",
        color: "white",
        padding: "40px 0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              RescueChain
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your trusted platform for seamless blockchain-based rescue operations. Stay connected and make an impact!
            </Typography>
          </Grid>

          {/* Products */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold">
              Products
            </Typography>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Rescue Token
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Donation Platform
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              AI Assistance
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Analytics
            </Link>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold">
              Useful Links
            </Typography>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Pricing
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Settings
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Orders
            </Link>
            <Link href="#" color="inherit" underline="none" sx={styles.link}>
              Help
            </Link>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold">
              Contact
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <i className="fas fa-home"></i> New York, NY 10012, US
            </Typography>
            <Typography variant="body2">
              <i className="fas fa-envelope"></i> support@rescuechain.com
            </Typography>
            <Typography variant="body2">
              <i className="fas fa-phone"></i> +1 234 567 88
            </Typography>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box mt={4} display="flex" justifyContent="center">
          <IconButton href="#" sx={styles.icon}>
            <Facebook />
          </IconButton>
          <IconButton href="#" sx={styles.icon}>
            <Twitter />
          </IconButton>
          <IconButton href="#" sx={styles.icon}>
            <Instagram />
          </IconButton>
          <IconButton href="#" sx={styles.icon}>
            <LinkedIn />
          </IconButton>
          <IconButton href="#" sx={styles.icon}>
            <GitHub />
          </IconButton>
        </Box>

        {/* Copyright */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 RescueChain | All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Custom Styles
const styles = {
  link: {
    display: "block",
    mt: 1,
    transition: "color 0.3s",
    "&:hover": { color: "#fa255e" },
  },
  icon: {
    color: "white",
    transition: "color 0.3s",
    "&:hover": { color: "#fa255e" },
  },
};

export default Footer;
