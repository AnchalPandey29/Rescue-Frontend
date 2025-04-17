import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import { getCoinBalance, withdrawToBank, saveBankDetails, getBankDetailsTransaction } from "../../services/apiCalls";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "white",
  maxWidth: 500,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)",
  borderRadius: "25px",
  padding: theme.spacing(1.5, 4),
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #c0392b 30%, #e74c3c 90%)",
  },
}));

const WithdrawBank = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceData = await getCoinBalance();
        setCoins(balanceData.data.incentives);
        const bankData = await getBankDetailsTransaction();
        console.log("Bank data:", bankData);
        if (bankData) {
          setBankDetails(bankData.data);
          setAccountNumber(bankData.data.accountNumber || "");
          setIfscCode(bankData.data.ifscCode || "");
          setBankName(bankData.data.bankName || "");
          setUpiId(bankData.data.upiId || "");
          setTabValue(bankData.data.upiId ? 1 : 0); // Default to UPI if present, else bank
        }
      } catch (err) {
        setError(err.message);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveDetails = async () => {
    try {
      const details = tabValue === 0 ? { accountNumber, ifscCode, bankName } : { upiId };
      await saveBankDetails(details);
      setBankDetails({ ...bankDetails, ...details }); // Merge new details with existing
      setMessage(`${tabValue === 0 ? "Bank" : "UPI"} details saved successfully`);
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleWithdraw = async () => {
    if (coins < 1000) {
      setError("You need at least 1000 coins to withdraw (minimum 10 INR)");
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const response = await withdrawToBank();
      const withdrawnAmount = Math.floor(coins / 1000) * 10;
      setMessage(response.message);
      setCoins((prev) => prev - Math.floor(prev / 1000) * 1000);
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const hasBankDetails = bankDetails?.accountNumber && bankDetails?.ifscCode && bankDetails?.bankName;
  const hasUpiDetails = bankDetails?.upiId;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: "#e74c3c" }} />
      ) : (
        <StyledPaper>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                color: "#2c3e50",
                fontWeight: "bold",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Withdraw to Bank
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#34495e", textAlign: "center" }}>
              Your Coins: <strong>{coins}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#7f8c8d", textAlign: "center" }}>
              Available: {Math.floor(coins / 1000) * 10} INR
            </Typography>

            <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{ mb: 3 }}
                TabIndicatorProps={{ style: { backgroundColor: "#e74c3c" } }}
              >
                <Tab
                  label="Bank Account"
                  icon={<AccountBalanceIcon />}
                  sx={{ color: tabValue === 0 ? "#e74c3c" : "#7f8c8d" }}
                />
                <Tab
                  label="UPI"
                  icon={<PaymentIcon />}
                  sx={{ color: tabValue === 1 ? "#e74c3c" : "#7f8c8d" }}
                />
              </Tabs>

              {tabValue === 0 && !hasBankDetails ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    label="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: "10px" } }}
                  />
                  <TextField
                    label="IFSC Code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: "10px" } }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Bank Name</InputLabel>
                    <Select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="SBI">State Bank of India</MenuItem>
                      <MenuItem value="HDFC">HDFC Bank</MenuItem>
                      <MenuItem value="ICICI">ICICI Bank</MenuItem>
                    </Select>
                  </FormControl>
                  <GradientButton onClick={handleSaveDetails} fullWidth>
                    Save Bank Details
                  </GradientButton>
                </motion.div>
              ) : tabValue === 1 && !hasUpiDetails ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    label="UPI ID (e.g., name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: "10px" } }}
                    helperText="Enter a valid UPI ID linked to your bank"
                  />
                  <GradientButton onClick={handleSaveDetails} fullWidth>
                    Save UPI Details
                  </GradientButton>
                </motion.div>
              ) : (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, color: "#34495e", fontStyle: "italic" }}
                  >
                    Linked {bankDetails.upiId ? "UPI ID" : "Bank"}: {bankDetails.upiId || `${bankDetails.bankName} (${bankDetails.accountNumber})`}
                  </Typography>
                  <GradientButton
                    onClick={handleWithdraw}
                    disabled={loading || coins < 1000}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Withdraw Now"}
                  </GradientButton>
                </Box>
              )}
            </Box>
          </motion.div>
        </StyledPaper>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity={error ? "error" : "success"}
          sx={{ width: "100%", backgroundColor: error ? "#e74c3c" : "#2ecc71", color: "white" }}
        >
          {message || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WithdrawBank;