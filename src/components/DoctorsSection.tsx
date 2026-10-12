import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Stack,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarIcon from '@mui/icons-material/Star';
import { SectionHeader } from './SectionHeader';
import { DoctorAvatar } from './DoctorAvatar';
import { DOCTORS } from '../data/clinicData';
import { Doctor } from '../types/clinic';

interface DoctorsSectionProps {
  onSelectDoctorForBooking: (doctorId: string, departmentId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  onSelectDoctorForBooking,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const departments = [
    { label: 'All Specialists', value: 'all' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Pediatrics', value: 'pediatrics' },
    { label: 'Orthopedics', value: 'orthopedics' },
    { label: 'Dermatology', value: 'dermatology' },
    { label: 'Diagnostics', value: 'diagnostics' },
  ];

  const filteredDoctors = departmentFilter === 'all'
    ? DOCTORS
    : DOCTORS.filter((d) => d.departmentId === departmentFilter);

  return (
    <Box
      id="doctors"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#0B111E' : '#FFFFFF',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Medical Faculty"
          title="Board-Certified Specialty Physicians"
          description="Meet our senior medical team trained at the nation's premier academic medical centers and committed to transparent patient outcomes."
        />

        {/* Filter Chips */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            mb: { xs: 4, md: 6 },
          }}
        >
          {departments.map((dept) => (
            <Chip
              key={dept.value}
              label={dept.label}
              clickable
              color={departmentFilter === dept.value ? 'primary' : 'default'}
              variant={departmentFilter === dept.value ? 'filled' : 'outlined'}
              onClick={() => setDepartmentFilter(dept.value)}
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                py: 2,
                px: 1,
              }}
            />
          ))}
        </Box>

        {/* Doctors Grid */}
        <Grid container spacing={3.5}>
          {filteredDoctors.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: isDark
                      ? '0 12px 28px -4px rgba(0, 0, 0, 0.6)'
                      : '0 12px 28px -4px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
                  {/* Doctor Avatar & Basic Credentials */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
                    <DoctorAvatar
                      name={doc.name}
                      gender={doc.gender}
                      departmentId={doc.departmentId}
                      size={84}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.18rem', lineHeight: 1.25 }}>
                        {doc.name}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', display: 'block', mt: 0.25 }}>
                        {doc.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {doc.qualifications}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Rating & Experience */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1.2,
                      px: 1.5,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.7)',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {doc.rating}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({doc.reviewCount})
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {doc.experienceYears} Years Exp.
                    </Typography>
                  </Box>

                  {/* Bio snippet */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    {doc.bio}
                  </Typography>

                  {/* Availability & Languages */}
                  <Stack spacing={1} sx={{ pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Clinic Days: <strong style={{ color: isDark ? '#F1F5F9' : '#0F172A' }}>{doc.availability}</strong>
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LanguageOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Languages: {doc.languages.join(', ')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => setSelectedDoctor(doc)}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Credentials
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                    onClick={() => onSelectDoctorForBooking(doc.id, doc.departmentId)}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Book with Doctor
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Doctor Credentials Modal */}
        <Dialog
          open={Boolean(selectedDoctor)}
          onClose={() => setSelectedDoctor(null)}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3.5,
                p: 1,
                backgroundColor: theme.palette.background.paper,
              },
            },
          }}
        >
          {selectedDoctor && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DoctorAvatar
                    name={selectedDoctor.name}
                    gender={selectedDoctor.gender}
                    departmentId={selectedDoctor.departmentId}
                    size={64}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {selectedDoctor.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {selectedDoctor.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedDoctor.departmentName}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedDoctor(null)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                  {selectedDoctor.bio}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                  Medical Education & Fellowships:
                </Typography>
                <List dense sx={{ mb: 2.5 }}>
                  {selectedDoctor.education.map((edu, idx) => (
                    <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28, color: 'primary.main' }}>
                        <SchoolOutlinedIcon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={edu}
                        slotProps={{
                          primary: { sx: { fontSize: '0.9rem' } },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                  Clinical Focus Areas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
                  {selectedDoctor.specialties.map((spec, idx) => (
                    <Chip key={idx} label={spec} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Standard Outpatient Consultation Fee
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {selectedDoctor.consultationFee}
                    </Typography>
                  </Box>
                  <Chip label="Insurance Covered" color="success" size="small" />
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={() => setSelectedDoctor(null)} color="inherit">
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => {
                    const docId = selectedDoctor.id;
                    const deptId = selectedDoctor.departmentId;
                    setSelectedDoctor(null);
                    onSelectDoctorForBooking(docId, deptId);
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  Book with {selectedDoctor.name.split(' ')[1] || 'Doctor'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};
