import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  ToggleOn as ToggleOnIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userAPI } from '../services/api';
import Loading from '../components/Loading';

const UserView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id);
      setUser(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const DetailRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
          {label}:
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ ml: 2 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/users')}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              User Details
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/users/edit/${id}`)}
          >
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={user.profileImage}
            alt={user.firstName}
            sx={{ width: 150, height: 150, mb: 2 }}
          >
            {user.firstName.charAt(0)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Chip
            label={user.status}
            color={user.status === 'Active' ? 'success' : 'default'}
            sx={{ mt: 1 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Details Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Personal Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<PersonIcon color="action" />}
              label="First Name"
              value={user.firstName}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<PersonIcon color="action" />}
              label="Last Name"
              value={user.lastName}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<EmailIcon color="action" />}
              label="Email"
              value={user.email}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<PhoneIcon color="action" />}
              label="Mobile"
              value={user.mobile}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<PersonIcon color="action" />}
              label="Gender"
              value={user.gender}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<ToggleOnIcon color="action" />}
              label="Status"
              value={user.status}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailRow
              icon={<LocationOnIcon color="action" />}
              label="Location"
              value={user.location}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(user.createdAt).toLocaleString()}
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Last Updated: {new Date(user.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserView;