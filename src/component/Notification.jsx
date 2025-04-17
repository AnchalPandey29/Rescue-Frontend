// components/Notification.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Button,
  Divider,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { getNotifications } from "../services/apiCalls";
import axios from "axios";

const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const notificationRef = useRef(null); // Ref for click-outside detection

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const notificationData = response.data || [];
        setNotifications(Array.isArray(notificationData) ? notificationData : []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setError("Failed to load notifications");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();

    // Click outside handler
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
      if (unreadIds.length > 0) {
        await axios.patch(
          `http://localhost:5000/notifications/mark-all-read`,
          { ids: unreadIds },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setNotifications((prev) =>
          prev.map((n) => (unreadIds.includes(n._id) ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleToggle = () => {
    if (!open) {
      markAllAsRead();
      setHasOpened(true);
    }
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const unreadCount = !hasOpened ? notifications.filter((n) => !n.read).length : 0;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 10);

  if (loading) {
    return (
      <IconButton disabled sx={{ color: "#fff", p: 1 }}>
        <NotificationsIcon />
      </IconButton>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title="Notifications">
        <IconButton
          onClick={handleToggle}
          sx={{
            bgcolor: PRIMARY_COLOR,
            color: "#fff",
            "&:hover": {
              bgcolor: "#d81b60",
              transform: "scale(1.15)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.3s ease",
            p: 1,
            borderRadius: "50%",
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.75rem",
                height: "18px",
                minWidth: "18px",
                borderRadius: "50%",
                top: -4,
                right: -4,
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 24 }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Fade in={open}>
        <MotionBox
          ref={notificationRef}
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          sx={{
            position: "absolute",
            top: 55,
            right: 0,
            width: { xs: "90vw", sm: 360, md: 420 },
            maxHeight: 520,
            bgcolor: "rgba(255, 255, 255, 0.98)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 3,
            p: 2,
            zIndex: 1400,
            overflowY: "auto",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: PRIMARY_COLOR,
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
              }}
            >
              Notifications
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                color: "grey.600",
                "&:hover": { color: "#d81b60" },
                transition: "color 0.2s ease",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2, bgcolor: "rgba(0, 0, 0, 0.1)" }} />
          {error ? (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: "center", py: 2, fontStyle: "italic" }}
            >
              {error}
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "center", py: 2, fontStyle: "italic" }}
            >
              No notifications yet
            </Typography>
          ) : (
            <>
              <List dense sx={{ py: 0 }}>
                {displayedNotifications.map((notification, index) => (
                  <MotionListItem
                    key={notification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    sx={{
                      bgcolor: notification.read
                        ? "transparent"
                        : "rgba(29, 78, 216, 0.06)",
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: notification.read
                          ? "rgba(0, 0, 0, 0.04)"
                          : "rgba(29, 78, 216, 0.12)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      },
                      transition: "all 0.2s ease",
                      cursor: "default",
                      borderLeft: notification.read
                        ? "none"
                        : `4px solid ${PRIMARY_COLOR}`,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read ? "grey.700" : PRIMARY_COLOR,
                            lineHeight: 1.3,
                          }}
                        >
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.8rem",
                            color: "grey.500",
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                  </MotionListItem>
                ))}
              </List>
              {notifications.length > 10 && !showAll && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAll(true)}
                  sx={{
                    display: "block",
                    mx: "auto",
                    mt: 2,
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    borderRadius: 20,
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "rgba(29, 78, 216, 0.1)",
                      borderColor: "#d81b60",
                      color: "#d81b60",
                    },
                    transition: "all 0.3s ease",
                  }}
                  endIcon={<ExpandMoreIcon />}
                >
                  Show More
                </Button>
              )}
            </>
          )}
        </MotionBox>
      </Fade>
    </Box>
  );
};

export default Notification;

const PRIMARY_COLOR = "#1a237e"; 