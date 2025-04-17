import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ThanksPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            Thank You!
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="textSecondary" 
            sx={{ mb: 4 }}
          >
            Your donation helps us empower hope and restore lives. We’re grateful for your support!
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/layout')}
                sx={{ bgcolor: '#1976d2', px: 4, py: 1.5 }}
              >
                Back to Home
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ThanksPage;