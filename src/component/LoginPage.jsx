import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Link,
  Divider,
  Container,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { loginUser, loginUserMeta } from "../services/apiCalls";
import { useAuth } from "../AuthContext";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import Web3 from "web3";

const LoginPage = () => {
  const { login } = useAuth(); // Auth context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const detectProvider = () => {
    if (window.ethereum) return window.ethereum;
    if (window.web3) return window.web3.currentProvider;
    toast.error("Non-Ethereum browser detected. Please install MetaMask.");
    return null;
  };

  const handleMetaMaskLogin = async () => {
    const provider = detectProvider();
    if (provider) {
      try {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const response = await loginUserMeta({ account });
        if (response.status === 200) {
          const { user: userData, token } = response.data;
          toast.success("MetaMask login successful!");
          login(userData, token);
          navigate("/dashboard");
        } else {
          toast.error(response.data.message || "Error occurred, try again");
        }
      } catch (error) {
        toast.error("MetaMask login failed. Ensure MetaMask is unlocked.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      if (response.status === 200) {
        const { token, user: userData } = response.data;
        toast.success("Login successful");
        login(userData, token);
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Error occurred, try again");
      }
    } catch (error) {
      toast.error("Login failed, please check your credentials and try again");
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(15deg, #1a237e 0%, #3f51b5 100%)",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(15deg, #1a237e 0%, #3f51b5 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: "30px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ fontWeight: "bold", color: "#482F41" }}
            >
              Login
            </Typography>

            {/* Login Form */}
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={{ marginTop: "20px" }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange}
                sx={{ marginTop: "20px" }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  marginTop: "20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding: "12px",
                  backgroundColor: "#712F3A",
                  "&:hover": { backgroundColor: "#5a2530" },
                }}
                type="submit"
              >
                Login
              </Button>
            </form>

            {/* Divider */}
            <Divider sx={{ margin: "20px 0", color: "#712F3A" }}>OR</Divider>

            {/* MetaMask Login */}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleMetaMaskLogin}
              startIcon={<WalletRoundedIcon />}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                padding: "12px",
                borderColor: "#712F3A",
                color: "#712F3A",
                "&:hover": { backgroundColor: "#f8e5e5" },
              }}
            >
              Login with MetaMask
            </Button>

            {/* Links */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <Link
                href="/forgot-password"
                variant="body2"
                sx={{ fontSize: "14px", color: "#712F3A" }}
              >
                Forgot password?
              </Link>
              <Link
                href="/signup"
                variant="body2"
                sx={{ fontSize: "14px", color: "#712F3A" }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
