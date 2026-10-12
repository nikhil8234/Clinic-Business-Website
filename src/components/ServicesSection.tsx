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
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { SectionHeader } from './SectionHeader';
import { MEDICAL_SERVICES } from '../data/clinicData';
import { MedicalService } from '../types/clinic';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForBooking,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<MedicalService | null>(null);

  const categories = [
    { label: 'All Specialties', value: 'all' },
    { label: 'Heart & Circulation', value: 'Heart & Circulation' },
    { label: 'Brain & Spine', value: 'Brain & Spine' },
    { label: 'Child Health', value: 'Child Health' },
    { label: 'Bones & Joints', value: 'Bones & Joints' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'Diagnostics', value: 'Diagnostics' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? MEDICAL_SERVICES
    : MEDICAL_SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <Box
      id="services"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#090D16' : '#F8FAFC',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Clinical Departments"
          title="Comprehensive Medical Specialties"
          description="Access coordinated care across specialized institutes with state-of-the-art diagnostic and clinical technologies."
        />

        {/* Category Filter Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 5 } }}>
          <Tabs
            value={selectedCategory}
            onChange={(_, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderRadius: 3,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.value}
                label={cat.label}
                value={cat.value}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: 2,
                  minHeight: 42,
                  px: 2.2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#FFFFFF',
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={3.5}>
          {filteredServices.map((service) => (
            <Grid key={service.id} size={{ xs: 12, md: 6, lg: 4 }}>
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
                  {/* Category & Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {service.category}
                    </Typography>
                    <Chip
                      label={service.badge}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                      }}
                    />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1.3rem' }}>
                    {service.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.65 }}>
                    {service.shortDescription}
                  </Typography>

                  {/* Conditions List */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
                      Common Conditions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {service.commonConditions.slice(0, 3).map((cond, i) => (
                        <Box
                          key={i}
                          sx={{
                            fontSize: '0.78rem',
                            py: 0.35,
                            px: 1,
                            borderRadius: 1,
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                            color: 'text.primary',
                          }}
                        >
                          {cond}
                        </Box>
                      ))}
                      {service.commonConditions.length > 3 && (
                        <Box
                          sx={{
                            fontSize: '0.78rem',
                            py: 0.35,
                            px: 0.75,
                            color: 'text.secondary',
                          }}
                        >
                          +{service.commonConditions.length - 3} more
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    Lead Specialist: <strong style={{ color: isDark ? '#F1F5F9' : '#0F172A' }}>{service.headSpecialist}</strong>
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => setActiveModalService(service)}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => onSelectServiceForBooking(service.id)}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Book Visit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Service Dialog */}
        <Dialog
          open={Boolean(activeModalService)}
          onClose={() => setActiveModalService(null)}
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
          {activeModalService && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase' }}>
                    {activeModalService.category}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {activeModalService.title}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActiveModalService(null)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                  {activeModalService.fullDescription}
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                  Clinical Procedures & Diagnostic Capabilities:
                </Typography>
                <List dense sx={{ mb: 2 }}>
                  {activeModalService.procedures.map((proc, i) => (
                    <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28, color: 'primary.main' }}>
                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={proc}
                        slotProps={{
                          primary: { sx: { fontSize: '0.9rem', fontWeight: 500 } },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                  Common Conditions Evaluated:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                  {activeModalService.commonConditions.map((cond, i) => (
                    <Chip key={i} label={cond} size="small" variant="outlined" />
                  ))}
                </Box>

                <Box sx={{ p: 2, borderRadius: 2, bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Department Director
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {activeModalService.headSpecialist}
                  </Typography>
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={() => setActiveModalService(null)} color="inherit">
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => {
                    const id = activeModalService.id;
                    setActiveModalService(null);
                    onSelectServiceForBooking(id);
                  }}
                  sx={{ fontWeight: 600 }}
                >
                  Schedule Appointment
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};
