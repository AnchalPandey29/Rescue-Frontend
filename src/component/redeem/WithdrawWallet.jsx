import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import { getCoinBalance, withdrawToWallet, saveWalletDetails, getWalletDetails } from "../../services/apiCalls";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

// Styled components for Web3-themed UI
const CryptoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  color: "white",
  maxWidth: 500,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const CryptoButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #00d4ff 30%, #00b4d8 90%)",
  borderRadius: "25px",
  padding: theme.spacing(1.5, 4),
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #00b4d8 30%, #00d4ff 90%)",
  },
}));

const WithdrawWallet = () => {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceData = await getCoinBalance();
        setCoins(balanceData.data.incentives);
        const walletData = await getWalletDetails();
        if (walletData && walletData.wallet) {
          setWalletDetails(walletData);
          setWalletAddress(walletData.wallet);
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

  const handleSaveWalletDetails = async () => {
    // Basic Ethereum address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError("Please enter a valid Ethereum wallet address");
      setOpenSnackbar(true);
      return;
    }
    try {
      await saveWalletDetails({ walletAddress });
      setWalletDetails({ wallet: walletAddress });
      setMessage("Crypto wallet linked successfully");
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleWithdraw = async () => {
    if (coins < 1000) {
      setError("You need at least 1000 coins to withdraw (minimum 0.01 ETH)");
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const response = await withdrawToWallet();
      const withdrawnAmount = Math.floor(coins / 1000) * 0.01; // 1000 coins = 0.01 ETH (example rate)
      setMessage(`Successfully withdrew ${withdrawnAmount} ETH to your crypto wallet`);
      setCoins((prev) => prev - Math.floor(prev / 1000) * 1000);
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: "#00d4ff" }} />
      ) : (
        <CryptoPaper>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                color: "#00d4ff",
                fontWeight: "bold",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Withdraw to Crypto Wallet
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#e0e0e0", textAlign: "center" }}>
              Your Coins: <strong>{coins}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#b0bec5", textAlign: "center" }}>
              Available: {Math.floor(coins / 1000) * 0.01} ETH
            </Typography>

            {!walletDetails ? (
              <Box>
                <TextField
                  label="Crypto Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": { borderRadius: "10px", background: "#16213e", color: "white" },
                    "& .MuiInputLabel-root": { color: "#b0bec5" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00d4ff" },
                  }}
                  variant="outlined"
                  placeholder="e.g., 0x1234..."
                  helperText="Enter your Ethereum wallet address (e.g., MetaMask)"
                  FormHelperTextProps={{ style: { color: "#b0bec5" } }}
                />
                <CryptoButton onClick={handleSaveWalletDetails} fullWidth>
                  Link Wallet
                </CryptoButton>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "#e0e0e0", fontStyle: "italic" }}
                >
                  Linked Wallet: {walletDetails.wallet.slice(0, 6)}...{walletDetails.wallet.slice(-4)}
                </Typography>
                <CryptoButton
                  onClick={handleWithdraw}
                  disabled={loading || coins < 1000}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Withdraw Now"}
                </CryptoButton>
              </Box>
            )}
          </motion.div>
        </CryptoPaper>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
        <Alert
          severity={error ? "error" : "success"}
          sx={{ width: "100%", backgroundColor: error ? "#ff6b6b" : "#00d4ff", color: "white" }}
        >
          {message || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WithdrawWallet;