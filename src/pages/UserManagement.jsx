import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Stack,
    Fade,
    Slide,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const UserManagement = () => {
    const { user, UserRoles } = useAuth();
    const [users, setUsers] = useState([
        {
            id: '1',
            name: 'Super Admin',
            email: 'superadmin@example.com',
            role: UserRoles.SUPERADMIN
        },
        {
            id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: UserRoles.ADMIN
        },
        {
            id: '3',
            name: 'Manager User',
            email: 'manager@example.com',
            role: UserRoles.MANAGER
        },
        {
            id: '4',
            name: 'Regular User',
            email: 'user@example.com',
            role: UserRoles.USER
        }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [openValidationDialog, setOpenValidationDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: '',
        email: '',
        role: UserRoles.USER
    });
    const [validationError, setValidationError] = useState('');

    const handleAddUser = () => {
        if (!currentUser.name || !currentUser.email) {
            setValidationError('Please fill in all fields');
            setOpenValidationDialog(true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentUser.email)) {
            setValidationError('Please enter a valid email address');
            setOpenValidationDialog(true);
            return;
        }

        setUsers([...users, {
            ...currentUser,
            id: String(users.length + 1)
        }]);
        setOpenDialog(false);
        setCurrentUser({
            name: '',
            email: '',
            role: UserRoles.USER
        });
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const canModifyUsers = [UserRoles.SUPERADMIN, UserRoles.ADMIN].includes(user?.role) ;

    const getRoleColor = (role) => {
        const roleColorMap = {
            [UserRoles.SUPERADMIN]: 'error',
            [UserRoles.ADMIN]: 'primary',
            [UserRoles.MANAGER]: 'secondary',
            [UserRoles.USER]: 'default'
        };
        return roleColorMap[role] || 'default';
    };

    return (
        <Container maxWidth="lg">
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ py: 4 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 4 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <ManageAccountsIcon sx={{ color: 'primary.main' }} />
                        User Management
                    </Typography>
                    {canModifyUsers && (
                        <Button
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="contained"
                            color="primary"
                            startIcon={<PersonAddIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Add New User
                        </Button>
                    )}
                </Stack>

                <Fade in={true} timeout={500}>
                    <TableContainer
                        component={Paper}
                        elevation={3}
                        sx={{ borderRadius: 2 }}
                    >
                        <Table>
                            <TableHead sx={{ backgroundColor: 'grey.100' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Role</TableCell>
                                    {canModifyUsers && <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        component={motion.tr}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        hover
                                    >
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={u.role}
                                                color={getRoleColor(u.role)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        {canModifyUsers && (
                                            <TableCell>
                                                <Button
                                                    component={motion.button}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    color="error"
                                                    startIcon={<DeleteOutlineIcon />}
                                                    onClick={() => handleDeleteUser(u.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fade>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    TransitionComponent={Slide}
                    transitionDuration={500}
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight={700}>
                            Add New User
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={currentUser.name}
                            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={currentUser.email}
                            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={currentUser.role}
                                label="Role"
                                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                            >
                                {Object.values(UserRoles).map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            color="primary"
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            color="primary"
                            variant="contained"
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add User
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Validation Dialog */}
            <Dialog
                open={openValidationDialog}
                onClose={() => setOpenValidationDialog(false)}
                maxWidth="xs"
                TransitionComponent={Slide}
                transitionDuration={300}
            >
                <DialogTitle>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ color: 'warning.main' }}
                    >
                        <WarningAmberIcon />
                        <Typography variant="h6">Validation Error</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {validationError}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenValidationDialog(false)}
                        color="primary"
                        variant="contained"
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default UserManagement;