// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Paper,
    Avatar,
    Button,
    TextField,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Modal,
    Fade,
    Backdrop,
    Tooltip,
    Grid,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Logout as LogoutIcon,
    MonetizationOn as RedeemIcon, // Added for redeem option
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { getUserProfile, updateUserProfile } from "../services/apiCalls";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", contact: "", location: "" });
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await getUserProfile();
                console.log("Profile data:", response.data);
                setProfile(response.data);
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                    contact: response.data.contact || "",
                    location: response.data.location || "",
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err.response || err);
                if (err.response?.status === 401) {
                    setError("Session expired or unauthorized. Redirecting to login...");
                    setTimeout(() => {
                        logout();
                        navigate("/login");
                    }, 2000);
                } else {
                    setError(err.response?.data?.message || "Failed to load profile data");
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, logout, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            const response = await updateUserProfile(formData);
            setProfile(response.data);
            setEditMode(false);
            setOpenModal(false);
            setError(null);
        } catch (err) {
            console.error("Error updating profile:", err.response || err);
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setOpenModal(!openModal);
        if (editMode && profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                contact: profile.contact || "",
                location: profile.location || "",
            });
        }
    };

    const handleRedeemCoins = () => {
        navigate("/dashboard/redeem"); 
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" align="center">
                    Profile not found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
            <Grid container spacing={4} justifyContent="center">
                {/* Left Side: Profile Header and Details */}
                <Grid item xs={12} md={4} sx={{ marginTop: "50px" }}>
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                p: 4,
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)",
                                color: "#fff",
                                mb: 4,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: "#fff",
                                            color: "#1a237e",
                                            fontSize: 48,
                                            mr: 3,
                                            transition: "transform 0.3s",
                                            "&:hover": { transform: "scale(1.1)" },
                                        }}
                                    >
                                        {profile.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            {profile.name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title="Logout">
                                    <IconButton onClick={logout} sx={{ color: "#fff" }}>
                                        <LogoutIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Profile Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Paper
                            elevation={6}
                            sx={{
                                p: 4,
                                borderRadius: "12px",
                                background: "#fff",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: "#263238" }}>
                                    Profile Details
                                </Typography>
                                <IconButton onClick={toggleEditMode}>
                                    <EditIcon color="primary" />
                                </IconButton>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                                    <strong>Email:</strong> {profile.email}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                                    <strong>Contact:</strong> {profile.contact}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#607d8b", mb: 1 }}>
                                    <strong>Location:</strong> {profile.location || "Not provided"}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "rgb(255,196,12)", mb: 1 }}>
                                    <strong>Total Incentives:</strong> {profile.incentives} points
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Redeem Coins Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<RedeemIcon />}
                                onClick={handleRedeemCoins}
                                sx={{
                                    borderRadius: "8px",
                                    backgroundColor: "linear-gradient(35deg, #1a237e 0%,rgb(6, 18, 82) 100%)",
                                    color: "white",
                                    "&:hover": { backgroundColor: "linear-gradient(35deg, #1a237e 0%, #3f51b5 100%)" },
                                    textTransform: "none",
                                    fontWeight: 600,
                                    py: 1,
                                    px: 3,
                                }}
                            >
                                Redeem Coins
                            </Button>
                        </Box>
                    </motion.div>
                </Grid>

                {/* Right Side: Contribution History */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ mt: 4, fontWeight: 600, color: "#34495e", textAlign: "center" }}
                        >
                            Contribution History
                        </Typography>
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: "12px",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                maxHeight: 400,
                                overflowY: "auto",
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, color: "#263238" }}>Emergency Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: "#263238" }}>Location</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: "#263238" }}>Completed At</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: "#263238" }}>Incentives Earned</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {profile.contributions.length > 0 ? (
                                        profile.contributions.map((contrib, index) => (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                whileHover={{ backgroundColor: "#f5f5f5" }}
                                            >
                                                <TableCell>{contrib.emergencyId.type || contrib.emergencyId.type}</TableCell>
                                                <TableCell>{contrib.emergencyId.location}</TableCell>
                                                <TableCell>
                                                    {contrib.completedAt ? new Date(contrib.completedAt).toLocaleString() : "Pending"}
                                                </TableCell>
                                                <TableCell>{contrib.incentivesEarned} points</TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No contributions yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                </Grid>
            </Grid>

            {/* Edit Profile Modal */}
            <Modal
                open={openModal}
                onClose={toggleEditMode}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={openModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            borderRadius: "12px",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Edit Profile
                        </Typography>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            sx={{ mt: 2, borderRadius: "8px", backgroundColor: "#1e88e5", "&:hover": { backgroundColor: "#1565c0" } }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Profile;