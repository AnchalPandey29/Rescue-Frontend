import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
  { icon: <AccountBalanceIcon />, text: "Check your coin balance" },
  { icon: <PaymentIcon />, text: "Choose your withdrawal method" },
  { icon: <CheckCircleIcon />, text: "Withdraw your coins" },
];

const RedeemIntroduction = () => {
  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, color: "#2c3e50", fontWeight: "bold" }}>
        How to Withdraw Your Coins
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#34495e" }}>
        Follow these simple steps to convert your coins into real money.
      </Typography>
      <List>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            <ListItem>
              <ListItemIcon sx={{ color: "#e74c3c" }}>{step.icon}</ListItemIcon>
              <ListItemText primary={step.text} sx={{ color: "#34495e" }} />
            </ListItem>
          </motion.div>
        ))}
      </List>
      <Button
        variant="contained"
        sx={{
          mt: 4,
          px: 4,
          py: 1.5,
          backgroundColor: "#e74c3c",
          "&:hover": { backgroundColor: "#c0392b" },
          borderRadius: "20px",
          fontWeight: "bold",
        }}
        component={Link}
        to="/dashboard/redeem/select-mode"
      >
        Proceed
      </Button>
    </Box>
  );
};

export default RedeemIntroduction;