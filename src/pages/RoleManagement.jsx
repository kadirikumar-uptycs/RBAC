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
    Container, 
    Stack,
    Fade,
    Slide,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const RoleManagement = () => {
    const { user, UserRoles } = useAuth();
    const [roles, setRoles] = useState([
        {
            id: '1',
            name: UserRoles.SUPERADMIN,
            description: 'Full system access, can manage users and roles',
            permissions: ['ALL']
        },
        {
            id: '2',
            name: UserRoles.ADMIN,
            description: 'Can manage users within their organization',
            permissions: ['USER_MANAGEMENT']
        },
        {
            id: '3',
            name: UserRoles.MANAGER,
            description: 'Can view and manage team members',
            permissions: ['TEAM_VIEW', 'TEAM_MANAGEMENT']
        },
        {
            id: '4',
            name: UserRoles.USER,
            description: 'Standard user with limited access',
            permissions: ['DASHBOARD_ACCESS']
        }
    ]);

    const permissionOptions = [
        'USER_MANAGEMENT',
        'ROLE_MANAGEMENT',
        'TEAM_VIEW',
        'TEAM_MANAGEMENT',
        'DASHBOARD_ACCESS'
    ];

    const [openDialog, setOpenDialog] = useState(false);
    const [openValidationDialog, setOpenValidationDialog] = useState(false);
    const [currentRole, setCurrentRole] = useState({
        name: '',
        description: '',
        permissions: []
    });
    const [validationError, setValidationError] = useState('');

    const handleAddRole = () => {
        if (!currentRole.name) {
            setValidationError('Role name is required');
            setOpenValidationDialog(true);
            return;
        }

        if (!currentRole.description) {
            setValidationError('Role description is required');
            setOpenValidationDialog(true);
            return;
        }

        if (currentRole.permissions.length === 0) {
            setValidationError('At least one permission must be selected');
            setOpenValidationDialog(true);
            return;
        }

        const isDuplicateRole = roles.some(
            role => role.name.toLowerCase() === currentRole.name.toLowerCase()
        );

        if (isDuplicateRole) {
            setValidationError('role name already exists');
            setOpenValidationDialog(true);
            return;
        }

        setRoles([...roles, {
            ...currentRole,
            id: String(roles.length + 1)
        }]);
        setOpenDialog(false);
        setCurrentRole({
            name: '',
            description: '',
            permissions: []
        });
    };

    const handleDeleteRole = (id) => {
        setRoles(roles.filter(r => r.id !== id));
    };

    const handleTogglePermission = (permission) => {
        setCurrentRole(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const canModifyRoles = user?.role === UserRoles.SUPERADMIN;

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
                        <LockOpenIcon sx={{ color: 'primary.main' }} />
                        Role Management
                    </Typography>
                    {canModifyRoles && (
                        <Button 
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            variant="contained" 
                            color="primary" 
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => setOpenDialog(true)}
                        >
                            Add New Role
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
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Role Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Permissions</TableCell>
                                    {canModifyRoles && <TableCell sx={{ fontWeight: 'bold', color: '#000' }}>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roles.map((role) => (
                                    <TableRow 
                                        key={role.id}
                                        component={motion.tr}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        hover
                                    >
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>{role.description}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {role.permissions.map(perm => (
                                                    <Chip
                                                        key={perm}
                                                        label={perm}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        {canModifyRoles && (
                                            <TableCell>
                                                <Button 
                                                    component={motion.button}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    color="error"
                                                    startIcon={<DeleteOutlineIcon />}
                                                    onClick={() => handleDeleteRole(role.id)}
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

                {/* Add Role Dialog */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)} 
                    maxWidth="md"
                    TransitionComponent={Slide}
                    transitionDuration={500}
                >
                    <DialogTitle>
                        <Typography variant="h6" fontWeight={700}>
                            Add New Role
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Role Name"
                            fullWidth
                            variant="outlined"
                            value={currentRole.name}
                            onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={currentRole.description}
                            onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Permissions
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {permissionOptions.map((permission) => (
                                <Chip
                                    key={permission}
                                    label={permission}
                                    color={currentRole.permissions.includes(permission) ? 'primary' : 'default'}
                                    onClick={() => handleTogglePermission(permission)}
                                    sx={{ 
                                        mb: 1,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
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
                            onClick={handleAddRole} 
                            color="primary" 
                            variant="contained"
                            component={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Add Role
                        </Button>
                    </DialogActions>
                </Dialog>

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
            </Box>
        </Container>
    );
};

export default RoleManagement;