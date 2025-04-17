// components/RedeemIncentives.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import { checkRedeemEligibility, redeemCoins, getTransactions } from "../services/apiCalls";

const MotionCard = motion(Card);

const dummyTransactions = [
  { id: 1, date: "2025-03-28", amount: 20, method: "Bank", status: "Completed" },
  { id: 2, date: "2025-03-27", amount: 10, method: "Wallet", status: "Completed" },
];

const RedeemIncentives = () => {
  const [eligible, setEligible] = useState(false);
  const [incentives, setIncentives] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeemTo, setRedeemTo] = useState("bank");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eligibilityData = await checkRedeemEligibility();
        console.log("Eligibility response:", eligibilityData);
        setEligible(eligibilityData.data.eligible || false);
        setIncentives(eligibilityData.data.coins || 0);

        const transactionData = await getTransactions();
        console.log("Transactions response:", transactionData);
        setTransactions(transactionData.length > 0 ? transactionData : dummyTransactions);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data");
        setOpenSnackbar(true);
        setTransactions(dummyTransactions);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const responseMessage = await redeemCoins(redeemTo);
      console.log("Redeem response message:", responseMessage);
      setMessage(responseMessage.message); 
      setOpenSnackbar(true);
      const deducted = Math.floor(incentives / 1000) * 1000;
      setIncentives((prev) => prev - deducted);
      setEligible(incentives - deducted >= 1000);
    } catch (err) {
      console.error("Redeem error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Redemption failed");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} sx={{ color: "#1a237e" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        background: "linear-gradient(135deg, #e8eaf6 0%, #fce4ec 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          maxWidth: 600,
          width: "100%",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            bgcolor: "#1a237e",
            "& .MuiTab-root": { color: "#fff", fontWeight: "bold" },
            "& .Mui-selected": { color: "#d81b60" },
            "& .MuiTabs-indicator": { bgcolor: "#d81b60" },
          }}
        >
          <Tab label="Redeem" />
          <Tab label="Transactions" />
        </Tabs>
        <CardContent sx={{ p: 4 }}>
          {tabValue === 0 ? (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#1a237e",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                Redeem Your Incentives
              </Typography>
              <Typography variant="h6" sx={{ color: "#d81b60", mb: 2, textAlign: "center" }}>
                Current Incentives: {incentives}
              </Typography>
              {eligible ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <FormLabel
                      component="legend"
                      sx={{ color: "#1a237e", fontWeight: 600 }}
                    >
                      Redeem To:
                    </FormLabel>
                    <RadioGroup
                      row
                      value={redeemTo}
                      onChange={(e) => setRedeemTo(e.target.value)}
                      sx={{ justifyContent: "center" }}
                    >
                      <FormControlLabel
                        value="bank"
                        control={<Radio sx={{ color: "#d81b60" }} />}
                        label="Bank Account"
                      />
                      <FormControlLabel
                        value="wallet"
                        control={<Radio sx={{ color: "#d81b60" }} />}
                        label="Wallet"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleRedeem}
                    disabled={loading}
                    sx={{
                      bgcolor: "#1a237e",
                      color: "#fff",
                      "&:hover": { bgcolor: "#d81b60", transform: "scale(1.05)" },
                      transition: "all 0.3s ease",
                      borderRadius: "25px",
                      px: 5,
                      py: 1.5,
                      fontWeight: "bold",
                      display: "block",
                      mx: "auto",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Redeem Now"
                    )}
                  </Button>
                </motion.div>
              ) : (
                <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
                  You need at least 1000 incentives to redeem!
                </Typography>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#1a237e",
                  textAlign: "center",
                  mb: 3,
                }}
              >
                Transaction History
              </Typography>
              {transactions.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        component={motion.tr}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: tx.id * 0.1 }}
                        sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" } }}
                      >
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.amount} ₹</TableCell>
                        <TableCell>{tx.method}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: tx.status === "Completed" ? "#4caf50" : "#ff9800",
                              fontWeight: 500,
                            }}
                          >
                            {tx.status}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", color: "grey.600" }}>
                  No transactions yet.
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </MotionCard>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {message || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RedeemIncentives;