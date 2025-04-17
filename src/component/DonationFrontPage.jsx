import React from 'react';
import { 
  Box, Typography, Button, Container, Grid, Card, CardContent, Divider 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { VolunteerActivism, AutoFixHigh, Favorite } from '@mui/icons-material';

const DonationFrontPage = () => {
  const navigate = useNavigate();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2, 
        duration: 0.8, 
        ease: 'easeOut' 
      } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.6, ease: 'easeOut' } 
    },
    hover: { 
      scale: 1.05, 
      y: -5, 
      boxShadow: '0px 10px 25px rgba(59, 130, 246, 0.2)', 
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

 // Button Animation Variants
 const buttonVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  },
  tap: { scale: 0.95, transition: { duration: 0.2 } }
};

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 10, 
      scale: 1.2, 
      transition: { duration: 0.3, ease: 'easeOut' } 
    }
  };

  const backgroundPulse = {
    animate: {
      background: [
        'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)'
      ],
      transition: { duration: 10, repeat: Infinity, repeatType: 'reverse' }
    }
  };

  

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #eff6ff 0%,rgba(234, 242, 251, 0.41) 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, sm: 8, md: 10 }
      }}
    >
      {/* Animated Background */}
      <motion.div
        {...backgroundPulse}
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: 0, 
          opacity: 0.8 
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Typography 
            variant="h1" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700, 
              color: '#1e40af', 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, 
              letterSpacing: '-0.5px',
              mb: { xs: 2, md: 3 }
            }}
          >
            RescueChain: Be the Change
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              fontFamily: 'Open Sans, sans-serif',
              color: '#64748b', 
              maxWidth: '700px', 
              mx: 'auto', 
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, 
              lineHeight: 1.6,
              mb: { xs: 4, md: 6 }
            }}
          >
            Help disaster survivors rebuild with your support
          
          </Typography>
        </motion.div>

        {/* Card Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {[
              { 
                title: 'Join Our Mission', 
                desc: 'Support relief for disaster victims.', 
                icon: <VolunteerActivism sx={{ fontSize: { xs: 40, md: 50 }, color: '#3b82f6' }} /> 
              },
              { 
                title: 'Simple Giving', 
                desc: 'Donate easily to fund vital supplies.', 
                icon: <AutoFixHigh sx={{ fontSize: { xs: 40, md: 50 }, color: '#3b82f6' }} /> 
              },
              { 
                title: 'Make an Impact', 
                desc: 'Bring hope with every contribution.', 
                icon: <Favorite sx={{ fontSize: { xs: 40, md: 50 }, color: '#3b82f6' }} /> 
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card 
                    sx={{ 
                      bgcolor: '#ffffff', 
                      borderRadius: 3, 
                      overflow: 'hidden', 
                      height: '100%', 
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      transition: 'background 0.3s ease',
                      '&:hover': { background: '#f8fafc' }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, textAlign: 'center' }}>
                      <motion.div variants={iconVariants} whileHover="hover">
                        {item.icon}
                      </motion.div>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: '#1e40af', 
                          fontWeight: 600, 
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }, 
                          mt: 2,
                          mb: 1
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Open Sans, sans-serif',
                          color: '#64748b', 
                          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, 
                          lineHeight: 1.5
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

           {/* Interactive Divider */}
           <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        >
          <Divider 
            sx={{ 
              my: { xs: 4, md: 6 }, 
              borderColor: 'rgba(59, 130, 246, 0.3)', 
              mx: 'auto', 
              borderWidth: '2px' ,
              alignContent:"center",
            }} 
          />
        </motion.div>

       {/* Call-to-Action Section */}
      <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 3 } }}>
        <motion.div
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          style={{ display: 'inline-block' }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard/payment')}
            sx={{ 
              background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
              color: '#fff',
              px: { xs: 4, sm: 5, md: 6 }, 
              py: { xs: 1.25, sm: 1.5, md: 1.75 }, 
              borderRadius: 8,
              fontFamily: 'Poppins, sans-serif',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0px 6px 15px rgba(59, 130, 246, 0.2)', // Shadow moved here
              '&:hover': { 
                background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                boxShadow: '0px 10px 25px rgba(59, 130, 246, 0.4)', // Shadow expands on hover
              }
            }}
          >
            Donate
          </Button>
        </motion.div>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'Open Sans, sans-serif',
            color: '#64748b', 
            mt: 2, 
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }, 
            fontStyle: 'italic'
          }}
        >
          Your kindness sparks hope, act today!
        </Typography>
      </Box>
     
      </Container>
    </Box>
  );
};

export default DonationFrontPage;