import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

const SelectWithdrawalMode = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const mode = event.target.value;
    setValue(mode);
    navigate(`/dashboard/redeem/withdraw-${mode}`);
  };

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
        Choose Withdrawal Method
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "#34495e" }}>
        Select how you’d like to withdraw your coins.
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel
            value="bank"
            control={<Radio sx={{ color: "#e74c3c", "&.Mui-checked": { color: "#e74c3c" } }} />}
            label={
              <Typography sx={{ color: "#34495e", fontWeight: "medium" }}>
                Bank (1000 coins = 10 rupees)
              </Typography>
            }
          />
          <FormControlLabel
            value="wallet"
            control={<Radio sx={{ color: "#e74c3c", "&.Mui-checked": { color: "#e74c3c" } }} />}
            label={
              <Typography sx={{ color: "#34495e", fontWeight: "medium" }}>
                Wallet (1000 coins = 10 tokens)
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default SelectWithdrawalMode;