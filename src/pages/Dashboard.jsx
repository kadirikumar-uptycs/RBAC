import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Container,
    Card,
    CardContent
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

const Dashboard = () => {
    const { user } = useAuth();

    // Variants for Framer Motion animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200
            }
        }
    };

    return (
        <Container maxWidth="md">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Grid
                    container
                    spacing={3}
                    component={motion.div}
                    variants={containerVariants}
                >
                    <Grid item xs={12}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            bgcolor: 'primary.main'
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 50 }} />
                                    </Avatar>
                                    <Typography
                                        variant="h4"
                                        component="h1"
                                        color="white"
                                        fontWeight="bold"
                                    >
                                        Welcome, {user.name}
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <motion.div variants={itemVariants}>
                            <Card
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <BadgeIcon color="primary" />
                                        <Typography variant="h6">
                                            Role
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary" mt={1}>
                                        {user.role}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <motion.div variants={itemVariants}>
                            <Card
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <EmailIcon color="primary" />
                                        <Typography variant="h6">
                                            Email
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary" mt={1}>
                                        {user.email}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    );
};

export default Dashboard;