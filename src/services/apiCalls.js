// src/services/apiCalls.js
import apiRequest from "./api";
import { BACKEND } from "./helpUrl";

export const createUser = async (user) => {
  return apiRequest(`${BACKEND}/register`, "POST", user);
};

export const loginUser = async (data) => {
  return apiRequest(`${BACKEND}/login`, "POST", data);
};

export const loginUserMeta = async (data) => {
  return apiRequest(`${BACKEND}/loginMeta`, "POST", data);
};

export const createReport = async (data) => {
  return apiRequest(`${BACKEND}/emergency`, "POST", data); // Matches router.post("/emergency")
};

export const getReport = async () => {
  return apiRequest(`${BACKEND}/incidents`, "GET"); // Matches router.get("/incidents")
};

export const getActiveEmergencies = async (queryParams = "") => {
  const url = `${BACKEND}/active${queryParams ? `?${queryParams}` : ""}`; // Matches router.get("/active")
  return apiRequest(url, "GET");
};

export const volunteerForEmergency = async (emergencyId) => {
  return apiRequest(`${BACKEND}/${emergencyId}/volunteer`, "POST"); // Matches router.post("/:emergencyId/volunteer")
};

export const markEmergencyCompleted = async (emergencyId) => {
  return apiRequest(`${BACKEND}/${emergencyId}/complete`, "PUT"); // Matches router.put("/:emergencyId/complete")
};

export const approveEmergencyCompletion = async (emergencyId) => {
  return apiRequest(`${BACKEND}/${emergencyId}/approve`, "PUT"); // Matches router.put("/:emergencyId/approve")
};

export const getEmergencyDetails = async (emergencyId) => {
  return apiRequest(`${BACKEND}/${emergencyId}`, "GET"); // Matches router.get("/:emergencyId")
};

export const updateVolunteerStatus = async (emergencyId, status) => {
  return apiRequest(`${BACKEND}/${emergencyId}/status`, "PUT", { status }); // Note: Missing backend route
};

export const markRescued = async (emergencyId, name) => {
  return apiRequest(`${BACKEND}/${emergencyId}/rescued`, "POST", { name }); // Note: Missing backend route
};

export const forgetUser = async (user) => {
  return apiRequest(`${BACKEND}/forget`, "POST", user);
};

export const getUserProfile = async () => {
  return apiRequest(`${BACKEND}/users/profile`, "GET");
};

export const updateUserProfile = async (profileData) => {
  return apiRequest(`${BACKEND}/users/profile`, "PUT", profileData);
};

export const getVolunteerHistory = async () => {
  return apiRequest(`${BACKEND}/volunteer/history`, "GET");
};

export const getUserReportedEmergencies = async () => {
  return apiRequest(`${BACKEND}/my-reports`, "GET");
};

export const getDashboardStats = async () => {
  return apiRequest(`${BACKEND}/dashboardstats`, "GET");
};

export const getAllEmergencies = async () => {
  return apiRequest(`${BACKEND}/allemergencies`, "GET");
};


export const processMessage = async (message, conversationHistory) => {
  return apiRequest(`${BACKEND}/chatbot/bot`, "POST", { message, conversationHistory });
};


export const getBankDetails = async () => {
  return apiRequest(`${BACKEND}/donation/bank-details`, 'GET');
};

export const getNotifications = async () => {
    return apiRequest(`${BACKEND}/notifications`, "GET");
};

export const createNotification = async (notificationData) => {
  return apiRequest(`${BACKEND}/notifications`, 'POST', notificationData);
};

export const checkRedeemEligibility = async () => {
  return apiRequest(`${BACKEND}/incentives/eligibility`, 'GET');
};

export const redeemCoins = async (redeemTo) => {
  return apiRequest(`${BACKEND}/incentives/redeem`, 'POST', redeemTo);
};

export const getTransactions = async () => {
  return apiRequest(`${BACKEND}/incentives/transactions`,'GET');
};

export const getCoinBalance =async() => apiRequest(`${BACKEND}/coins/balance`, "GET");
export const withdrawToBank = async() => apiRequest(`${BACKEND}/coins/withdraw/bank`, "POST");
export const withdrawToWallet = async () => apiRequest(`${BACKEND}/coins/withdraw/wallet`, "POST");
export const getBankDetailsTransaction = () => apiRequest(`${BACKEND}/coins/bank-details`, "GET");
export const saveBankDetails = (details) => apiRequest(`${BACKEND}/coins/save-bank-details`, "POST", details);
export const getWalletDetails = () => apiRequest(`${BACKEND}/coins/wallet-details`, "GET");
export const saveWalletDetails = (details) => apiRequest(`${BACKEND}/coins/save-wallet-details`, "POST", details);
