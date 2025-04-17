import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Paper,
  Link,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../services/apiCalls";
import { useNavigate } from "react-router-dom";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import Web3 from "web3";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    account: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const detectProvider = () => {
    if (window.ethereum) return window.ethereum;
    if (window.web3) return window.web3.currentProvider;
    toast.error("Non-Ethereum browser detected. Please install MetaMask.");
    return null;
  };

  const onConnect = async () => {
    const provider = detectProvider();
    if (provider) {
      try {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setFormData((prev) => ({ ...prev, account: accounts[0] }));
      } catch (error) {
        toast.error("Failed to connect to MetaMask.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const { name, email, mobile, password, confirmPassword, account } = formData;
    setIsFormValid(name && email && mobile && password && confirmPassword);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Signing up...");

    try {
      setLoading(true);
      console.dir(formData);
      const response = await createUser(formData);
      toast.dismiss(loadingToastId);
      console.log('here is response');
      console.dir(response);
      if (response.status === 200) {
        toast.success("Signup successful!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          account: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      } else {
        toast.error("Signup failed, please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("An error occurred, please try again later.");
    } finally {
      setLoading(false);
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
          padding: "50px",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          // background: "linear-gradient(135deg, #482F41, #712F3A)",
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
              Create Your Account
            </Typography>

            {/* Signup Form */}
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              {["name", "email", "mobile", "password", "confirmPassword"].map((field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  variant="outlined"
                  type={field.includes("password") ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  sx={{ marginTop: "15px" }}
                />
              ))}

              {/* Wallet Address */}
              <TextField
                fullWidth
                label="Wallet Address"
                name="account"
                variant="outlined"
                value={formData.account}
                disabled
                sx={{ marginTop: "15px" }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      onClick={onConnect}
                      startIcon={<WalletRoundedIcon />}
                      sx={{
                        backgroundColor: "#712F3A",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#5a2530" },
                      }}
                    >
                      Connect Wallet
                    </Button>
                  ),
                }}
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
                disabled={!isFormValid}
              >
                Sign Up
              </Button>
            </form>

            {/* Divider */}
            <Divider sx={{ margin: "20px 0", color: "#712F3A" }}>OR</Divider>

            {/* Already have an account? */}
            <Box sx={{ textAlign: "center" }}>
              <Link href="/login" variant="body2" sx={{ fontSize: "14px", color: "#712F3A" }}>
                Already have an account? Login
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

export default SignupPage;
