import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
	CssBaseline,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
	IconButton,
	useTheme,
	createTheme,
	ThemeProvider,
	Avatar,
} from '@mui/material';
import {
	Dashboard as DashboardIcon,
	People as PeopleIcon,
	SupervisedUserCircle as RoleIcon,
	Group as TeamIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
	Close as CloseIcon
} from '@mui/icons-material';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';


const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#3f51b5',
		},
		background: {
			default: '#121212',
			paper: '#1e1e1e',
		},
	},
	typography: {
		fontFamily: 'Roboto, Arial, sans-serif',
	},
	components: {
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: '#1e1e1e',
					borderRight: '1px solid rgba(255,255,255,0.12)',
				},
			},
		},
	},
});


const PageTransition = ({ children }) => {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={location.pathname}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3 }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

const Sidebar = ({ open, onClose }) => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const theme = useTheme();

	const getSidebarItems = () => {
		const commonItems = [
			{
				text: 'Dashboard',
				path: '/dashboard',
				icon: <DashboardIcon />
			}
		];

		switch (user?.role) {
			case 'SUPERADMIN':
				return [
					...commonItems,
					{
						text: 'User Management',
						path: '/users',
						icon: <PeopleIcon />
					},
					{
						text: 'Role Management',
						path: '/roles',
						icon: <RoleIcon />
					}
				];
			case 'ADMIN':
				return [
					...commonItems,
					{
						text: 'User Management',
						path: '/users',
						icon: <PeopleIcon />
					}
				];
			case 'MANAGER':
				return [
					...commonItems,
					{
						text: 'Team View',
						path: '/team',
						icon: <TeamIcon />
					}
				];
			default:
				return commonItems;
		}
	};

	return (
		<Drawer
			variant="persistent"
			anchor="left"
			open={open}
			sx={{
				width: 240,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: 240,
					boxSizing: 'border-box',
					transition: theme.transitions.create('width', {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.enteringScreen,
					}),
				},
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					backgroundColor: theme.palette.background.paper,
					overflow: 'hidden',
				}}
			>
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					p: 2
				}}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							sx={{
								width: 40,
								height: 40,
								mr: 2,
								bgcolor: theme.palette.primary.main
							}}
						>
							{user?.name?.charAt(0)}
						</Avatar>
						<Typography variant="subtitle1">
							{user?.name}
						</Typography>
					</Box>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				<List sx={{ flexGrow: 1 }}>
					{getSidebarItems().map((item) => (
						<motion.div
							key={item.path}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<ListItem
								button
								onClick={() => {
									navigate(item.path);
								}}
								sx={{
									py: 1.5,
									cursor: 'pointer',
									'&:hover': {
										backgroundColor: 'rgba(255,255,255,0.08)'
									}
								}}
							>
								<ListItemIcon sx={{ color: theme.palette.primary.light }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</ListItem>
						</motion.div>
					))}
				</List>

				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<ListItem
						button
						onClick={logout}
						sx={{
							py: 1.5,
							borderTop: '1px solid rgba(255,255,255,0.12)',
							'&:hover': {
								backgroundColor: 'rgba(255,255,255,0.08)'
							}
						}}
					>
						<ListItemIcon sx={{ color: theme.palette.error.light }}>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem>
				</motion.div>
			</Box>
		</Drawer>
	);
};

const AppContent = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const { user } = useAuth();
	const location = useLocation();

	const ProtectedRoute = ({ children, requiredRole }) => {
		const { user } = useAuth();

		if (!user) {
			return <Navigate to="/login" replace />;
		}

		if (requiredRole &&
			(Array.isArray(requiredRole)
				? !requiredRole.includes(user.role)
				: user.role !== requiredRole)) {
			return <Navigate to="/dashboard" replace />;
		}

		return children;
	};

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			{user && (
				<>
					<Sidebar
						open={sidebarOpen}
						onClose={() => setSidebarOpen(false)}
					/>
					{!sidebarOpen && (
						<IconButton
							onClick={() => setSidebarOpen(true)}
							sx={{
								position: 'fixed',
								top: 16,
								left: 16,
								zIndex: 1200,
								bgcolor: 'background.paper',
								'&:hover': {
									bgcolor: 'background.default'
								}
							}}
						>
							<MenuIcon />
						</IconButton>
					)}
				</>
			)}

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					marginTop: 3,
					overflow: 'auto',
					backgroundColor: 'background.default',
					transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
					marginLeft: user && !sidebarOpen ? '-240px' : 0
				}}
			>
				<PageTransition>
					<Routes location={location}>
						<Route path="/login" element={<Login />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/users"
							element={
								<ProtectedRoute requiredRole={['SUPERADMIN', 'ADMIN']}>
									<UserManagement />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/roles"
							element={
								<ProtectedRoute requiredRole="SUPERADMIN">
									<RoleManagement />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/team"
							element={
								<ProtectedRoute requiredRole="MANAGER">
									<UserManagement />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes>
				</PageTransition>
			</Box>
		</Box>
	);
};

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<Router>
					<AppContent />
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}