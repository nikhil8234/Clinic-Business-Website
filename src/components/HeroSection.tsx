import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CLINIC_INFO, CLINIC_STATS } from '../data/clinicData';

interface HeroSectionProps {
  onBookClick: () => void;
  onExploreServices: () => void;
  onOpenAiModal?: (tab?: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookClick,
  onExploreServices,
  onOpenAiModal,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Real-time calculation of open status
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = currentDay === 0 || currentDay === 6;
  const isOpen = isWeekend
    ? currentHour >= 8 && currentHour < 16
    : currentHour >= 7 && currentHour < 20;

  return (
    <Box
      id="hero"
      component="section"
      sx={{
        pt: { xs: 5, md: 8 },
        pb: { xs: 6, md: 10 },
        background: isDark
          ? 'radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.12) 0%, rgba(9, 13, 22, 1) 70%)'
          : 'radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.08) 0%, rgba(248, 250, 252, 1) 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'center' }}>
          {/* Left Column: Value Proposition & CTAs */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Live Operational Status Tag */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.75,
                py: 0.75,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
                border: `1px solid ${isDark ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.25)'}`,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isOpen ? '#10B981' : '#F59E0B',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: isDark ? '#2DD4BF' : '#0F766E',
                  letterSpacing: '0.01em',
                  fontSize: '0.8rem',
                }}
              >
                {isOpen ? 'Clinic Open Today · Walk-ins & Appointments Welcome' : 'Urgent Care Open 24/7 · Outpatient Opens 7:30 AM'}
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.35rem', sm: '3.1rem', md: '3.65rem' },
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.03em',
                lineHeight: { xs: 1.18, md: 1.12 },
                mb: 2.5,
                textWrap: 'balance',
              }}
            >
              Exceptional Multi-Specialty Care Designed Around You.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.65,
                maxWidth: '620px',
              }}
            >
              Aegis Health brings board-certified physicians, same-day diagnostic imaging,
              and patient-first specialty clinics under one roof. No fragmented referrals, no endless waiting.
            </Typography>

            {/* CTAs */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={onBookClick}
                startIcon={<CalendarMonthIcon />}
                sx={{
                  py: 1.5,
                  px: 3.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Request an Appointment
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={onExploreServices}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                Explore Specialties
              </Button>

              {onOpenAiModal && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => onOpenAiModal(0)}
                  startIcon={<AutoAwesomeIcon />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    borderColor: 'primary.main',
                  }}
                >
                  AI Consultation Hub
                </Button>
              )}
            </Stack>

            {/* Trust Markers */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 2, sm: 3 },
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Board-Certified MDs
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <ShieldOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  JCAHO Gold Seal Accredited
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  Major Insurances Accepted
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Interactive Clinic Feature Card */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header Badge */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    METROVILLE MEDICAL CAMPUS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                    Clinical Center of Excellence
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(13, 148, 136, 0.2)' : 'rgba(13, 148, 136, 0.1)',
                    color: 'primary.main',
                  }}
                >
                  <MedicalServicesOutlinedIcon sx={{ fontSize: 28 }} />
                </Box>
              </Box>

              {/* Department Snapshot List */}
              <Stack spacing={1.5} sx={{ mb: 3.5 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.7)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cardiovascular & Stress Testing
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dr. Sarah Chen · High-resolution Echo & Holter
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Same-Day Avail.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.7)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Pediatric & Family Wellness
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dr. Elena Rodriguez · Newborns to Teens
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Accepting New
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.7)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      3T MRI & Digital Laboratory
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      On-site rapid radiological reporting
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    In-House
                  </Typography>
                </Box>
              </Stack>

              {/* Operating Hours Snippet */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(240, 253, 250, 0.8)',
                  border: `1px solid ${isDark ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 24, flexShrink: 0 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Walk-in Urgent Care open 24/7
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    420 Health Sciences Blvd · Free On-site Parking
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* 4-Item Quantitative Impact Bar */}
        <Grid container spacing={2.5} sx={{ mt: { xs: 4, md: 7 } }}>
          {CLINIC_STATS.map((stat, idx) => (
            <Grid key={idx} size={{ xs: 6, md: 3 }}>
              <Card
                sx={{
                  p: 2.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.main',
                    fontSize: { xs: '1.85rem', sm: '2.25rem' },
                    fontVariantNumeric: 'tabular-nums',
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.25 }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.detail}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
