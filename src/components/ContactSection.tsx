import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import LocalParkingOutlinedIcon from '@mui/icons-material/LocalParkingOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { SectionHeader } from './SectionHeader';
import { CLINIC_INFO } from '../data/clinicData';

export const ContactSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const directory = [
    { department: 'General Appointments & Reception', ext: '(555) 234-8901' },
    { department: 'Cardiology Center & Stress Lab', ext: '(555) 234-8910' },
    { department: 'Pediatric Clinic & Immunizations', ext: '(555) 234-8920' },
    { department: 'Neurology & Sleep Studies', ext: '(555) 234-8930' },
    { department: 'Radiology / MRI / CT Results', ext: '(555) 234-8940' },
    { department: 'Patient Billing & Insurance Desk', ext: '(555) 234-8950' },
  ];

  return (
    <Box
      id="contact"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#0B111E' : '#FFFFFF',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Campus & Connect"
          title="Contact & Location Information"
          description="Conveniently situated in the Metroville Health Sciences district with covered patient parking, accessible transit links, and 24/7 emergency intake."
        />

        <Grid container spacing={4}>
          {/* Left Column: Coordinates & Transport Guidance */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: { xs: 3, sm: 4 },
                backgroundColor: isDark ? '#111827' : '#F8FAFC',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Main Campus Coordinates
              </Typography>

              <Stack spacing={2.5}>
                {/* Physical Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
                      color: 'primary.main',
                    }}
                  >
                    <LocationOnOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Physical Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {CLINIC_INFO.address}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      Building B, 3rd Floor Reception Desk
                    </Typography>
                  </Box>
                </Box>

                {/* Telephone */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
                      color: 'primary.main',
                    }}
                  >
                    <PhoneInTalkOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Central Telephone Lines
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      General Care: {CLINIC_INFO.phone}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                      Urgent Care: {CLINIC_INFO.emergencyPhone}
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
                      color: 'primary.main',
                    }}
                  >
                    <EmailOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Patient Support Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {CLINIC_INFO.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Transit & Parking */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                      color: 'secondary.main',
                    }}
                  >
                    <DirectionsBusOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Metro & Public Transit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {CLINIC_INFO.transitInfo}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.1)',
                      color: 'secondary.main',
                    }}
                  >
                    <LocalParkingOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Complimentary Patient Parking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Validated parking tickets available at reception for levels P1, P2, and P3. EV charging bays available.
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Right Column: Interactive Map Representation & Department Directory */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Map Representation Box */}
              <Card
                sx={{
                  p: 3,
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  borderRadius: 3.5,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: 190,
                    borderRadius: 2.5,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDark
                      ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                      : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                  }}
                >
                  {/* Decorative map grid markings */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
                    <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                  </svg>

                  {/* Marker Pin */}
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
                      }}
                    >
                      <LocationOnOutlinedIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 1,
                        backgroundColor: isDark ? '#090D16' : '#FFFFFF',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      Aegis Health Center · 420 Science Blvd
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Latitude 34.0522° N, Longitude 118.2437° W
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Open in Maps
                  </Button>
                </Box>
              </Card>

              {/* Department Direct Extensions Directory */}
              <Card
                sx={{
                  p: 3,
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  flexGrow: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ContactPhoneOutlinedIcon color="primary" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Direct Clinical Department Lines
                  </Typography>
                </Box>

                <Stack spacing={1.2}>
                  {directory.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.8,
                        borderBottom: idx < directory.length - 1 ? `1px dashed ${theme.palette.divider}` : 'none',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {item.department}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {item.ext}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
