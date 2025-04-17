import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Button, Grid, Card, CardContent, Paper, Divider 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { getBankDetails } from '../services/apiCalls';
import { useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, AccountBalance , ArrowBackIos} from '@mui/icons-material'; // Icons for payment options
import QR from '../assets/QR.jpg';

const DonationPaymentPage = () => {
  const [bankDetails, setBankDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const data = await getBankDetails();
        console.log(data);
        setBankDetails(data.data);
        
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };
    fetchBankDetails();
  }, []);

  const handleCardPayment = () => {
    const stripeCheckoutUrl = `payment`;//add stripe product link
    window.location.href = stripeCheckoutUrl;
  };

  const handleQrPayment = () => {
    setSelectedOption('qr');
  };

  const handleBankDetails = () => {
    setSelectedOption('bank');
  };

 
  // Animation Variants
  const cardVariants = {
    rest: { 
      scale: 1, 
      y: 0, 
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)', 
      background: '#ffffff' 
    },
    hover: { 
      scale: 1.05, 
      y: -10, 
      boxShadow: '0px 10px 25px rgba(33, 150, 243, 0.3)', 
      background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    tap: { scale: 0.98, y: 0, boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)' }
  };

  const buttonVariants = {
    rest: { scale: 1, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.05, 
      boxShadow: '0px 6px 20px rgba(33, 150, 243, 0.5)', 
      transition: { duration: 0.3 } 
    },
    tap: { scale: 0.95, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)' }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const childFade = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg,rgb(239, 251, 255) 0%,rgba(234, 245, 255, 0.3) 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, md: 8 }
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              color: '#1e88e5', 
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' }, 
              textShadow: '2px 2px 10px rgba(33, 150, 243, 0.3)',
              mb: 2
            }}
          >
            RescueChain Donation
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: '#546e7a', 
              maxWidth: '900px', 
              mx: 'auto', 
              fontSize: { xs: '1rem', md: '1.25rem' }, 
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Join us in supporting disaster survivors with essential aid—your donation provides food, shelter, and medical care to those in need.
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              fontStyle: 'italic', 
              color: '#1976d2', 
              fontSize: { xs: '1.2rem', md: '1.75rem' }, 
              mb: 6,
              textShadow: '1px 1px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            "Empower Hope, Restore Lives."
          </Typography>
        </motion.div>

        {/* Donation Options */}
        <AnimatePresence>
          {!selectedOption && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerChildren}
            >
              <Grid container spacing={3} justifyContent="center">
                {[
                  { label: 'Pay with Card', action: handleCardPayment, icon: <CreditCard /> },
                  { label: 'Pay with QR', action: handleQrPayment, icon: <QrCode /> },
                  { label: 'Bank Transfer', action: handleBankDetails, icon: <AccountBalance /> }
                ].map((option, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <motion.div
                      variants={cardVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Card 
                        sx={{ 
                          borderRadius: 3, 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={option.action}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <motion.div variants={childFade}>
                            {React.cloneElement(option.icon, { 
                              sx: { fontSize: { xs: 40, md: 50 }, color: '#1976d2', mb: 2 } 
                            })}
                            <Typography 
                              variant="h6" 
                              sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}
                            >
                              {option.label}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ color: '#546e7a', fontSize: { xs: '0.9rem', md: '1rem' } }}
                            >
                              {option.label === 'Pay with Card' 
                                ? 'Securely donate with credit or debit card.' 
                                : option.label === 'Pay with QR' 
                                  ? 'Scan and pay instantly with UPI.' 
                                  : 'Transfer funds directly to our bank account.'}
                            </Typography>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Section */}
        {selectedOption === 'qr' && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            sx={{ mt: 4 }}
          >
            <Card 
              elevation={8} 
              sx={{ 
                maxWidth: { xs: 320, sm: 400 }, 
                mx: 'auto', 
                borderRadius: 4, 
                bgcolor: '#ffffff',
                boxShadow: '0 10px 30px rgba(33, 150, 243, 0.2)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}
                >
                  Scan to Pay with UPI
                </Typography>
                <motion.img
                  src={QR}
                  alt="UPI QR Code"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ 
                    maxWidth: '80%', 
                    height: 'auto', 
                    borderRadius: 10, 
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)' 
                  }}
                />
                <Typography 
                  variant="body1" 
                  color="textSecondary" 
                  sx={{ mt: 3, mb: 4, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  Open your UPI app, scan the code, and complete your donation in seconds.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedOption(null)}
                    sx={{ 
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      color: '#fff',
                      px: 4, 
                      py: 1.5, 
                      borderRadius: 2,
                      fontWeight: 600,
                      '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' }
                    }}
                  >
                    Back to Options
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

       
         {/* Bank Details Section */}
         {selectedOption === 'bank' && (
           <motion.div
             variants={sectionVariants}
             initial="hidden"
             animate="visible"
             sx={{ mt: { xs: 4, md: 6 } }}
           >
             <Card 
               elevation={10} 
               sx={{ 
                 maxWidth: { xs: 320, sm: 550 }, 
                 mx: 'auto', 
                 borderRadius: 5, 
                 bgcolor: '#ffffff',
                 boxShadow: '0 15px 40px rgba(25, 118, 210, 0.2)',
                 overflow: 'hidden'
               }}
             >
               <Box 
                 sx={{ 
                   width: '100%', 
                   height: '5px', 
                   background: 'linear-gradient(90deg, #0288d1, #4fc3f7)' 
                 }} 
               />
               <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                 <Typography 
                   variant="h5" 
                   sx={{ 
                     fontFamily: 'Roboto Slab, serif',
                     color: '#1e3a8a', 
                     fontWeight: 600, 
                     mb: 3, 
                     textAlign: 'center',
                     fontSize: { xs: '1.5rem', md: '1.75rem' },
                     letterSpacing: '0.5px'
                   }}
                 >
                   Bank Transfer Details
                 </Typography>
                 {bankDetails ? (
                   <motion.div variants={staggerChildren} initial="hidden" animate="visible">
                     <Box sx={{ textAlign: 'left', px: { xs: 1, md: 2 } }}>
                       {[
                         { label: 'Bank', value: bankDetails.bankName },
                         { label: 'A/C No', value: bankDetails.accountNumber },
                         { label: 'Routing', value: bankDetails.routingNumber },
                         { label: 'Holder', value: bankDetails.accountHolder }
                       ].map((item, idx) => (
                         <motion.div key={idx} variants={childFade}>
                           <Typography 
                             variant="body1" 
                             sx={{ 
                               mb: 2, 
                               color: '#4b5e6d', 
                               fontSize: { xs: '0.95rem', md: '1rem' },
                               display: 'flex',
                               justifyContent: 'space-between',
                               borderBottom: '1px solid #e8f0fe',
                               pb: 1
                             }}
                           >
                             <strong>{item.label}:</strong> 
                             <span>{item.value}</span>
                           </Typography>
                         </motion.div>
                       ))}
                       <motion.div variants={childFade}>
                         <Typography 
                           variant="body2" 
                           color="textSecondary" 
                           sx={{ mt: 2, fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.6, color: '#64748b' }}
                         >
                           Transfer your donation using these details and confirm with us at 
                           <a href="mailto:anchal29pandey@gmail.com" style={{ color: '#0288d1', textDecoration: 'none', fontWeight: 500 }}> anchal29pandey@gmail.com</a>.
                         </Typography>
                       </motion.div>
                     </Box>
                   </motion.div>
                 ) : (
                   <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', color: '#64748b' }}>
                     Loading bank details...
                   </Typography>
                 )}
                 <Box sx={{ textAlign: 'center', mt: 4 }}>
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Button
                       variant="contained"
                       onClick={() => setSelectedOption(null)}
                       startIcon={<ArrowBackIos />}
                       sx={{ 
                         background: 'linear-gradient(45deg, #0288d1, #4fc3f7)',
                         color: '#fff',
                         px: { xs: 3, md: 4 }, 
                         py: 1.5, 
                         borderRadius: 10,
                         fontWeight: 600,
                         fontSize: { xs: '0.9rem', md: '1rem' },
                         textTransform: 'none',
                         '&:hover': { background: 'linear-gradient(45deg, #0277bd, #29b6f6)' }
                       }}
                     >
                       Back to Options
                     </Button>
                   </motion.div>
                 </Box>
               </CardContent>
             </Card>
           </motion.div>
         )}

        {/* Contact Section */}
        <Divider sx={{ my: 6, borderColor: 'rgba(33, 150, 243, 0.3)' }} />
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper 
            elevation={4} 
            sx={{ 
              py: { xs: 3, md: 4 }, 
              px: { xs: 2, md: 4 }, 
              borderRadius: 4, 
              bgcolor: '#ffffff',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '4px', 
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)' 
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{ fontWeight: 600, color: '#1976d2', mb: 3, textAlign: 'center' }}
            >
              Contact Us
            </Typography>
            <motion.div variants={staggerChildren} initial="hidden" animate="visible">
              <motion.div variants={childFade}>
                <Typography 
                  variant="body1" 
                  sx={{ color: '#424242', textAlign: 'center', mb: 1.5 }}
                >
                  Email: <a href="mailto:anchal29pandey@gmail.com" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>anchal29pandey@gmail.com</a>
                </Typography>
              </motion.div>
              <motion.div variants={childFade}>
                <Typography 
                  variant="body1" 
                  sx={{ color: '#424242', textAlign: 'center', mb: 2 }}
                >
                  Phone: <span style={{ color: '#1976d2', fontWeight: 500 }}>+91 9140893288</span>
                </Typography>
              </motion.div>
              <motion.div variants={childFade}>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ maxWidth: '600px', mx: 'auto', textAlign: 'center', fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  <strong>Help Note:</strong> Facing issues with your donation? Our support team is here to assist you every step of the way.
                </Typography>
              </motion.div>
              <motion.div variants={childFade}>
                <Typography 
                  variant="body1" 
                  sx={{ color: '#4caf50', fontWeight: 600, mt: 2, textAlign: 'center', textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
                >
                  Thank You for Supporting RescueChain!
                </Typography>
              </motion.div>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DonationPaymentPage;
