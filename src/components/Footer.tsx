import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  useTheme,
  Divider,
  Stack,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CLINIC_INFO } from '../data/clinicData';

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? '#080C14' : '#0F172A',
        color: '#F8FAFC',
        pt: { xs: 8, md: 10 },
        pb: 5,
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <Container maxWidth="lg">
        {/* Urgent Emergency Alert Footer Box */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: { xs: 6, md: 8 },
          }}
        >
          <WarningAmberIcon sx={{ color: '#F87171', fontSize: 26, flexShrink: 0, mt: { xs: 0.2, sm: 0 } }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FECACA' }}>
              Life-Threatening Emergency Notice
            </Typography>
            <Typography variant="caption" sx={{ color: '#E2E8F0', display: 'block' }}>
              If you or a loved one is experiencing chest pain, sudden numbness, difficulty breathing, or severe trauma,
              please dial <strong>911</strong> immediately or proceed to the nearest hospital emergency room.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={5} sx={{ mb: 6 }}>
          {/* Col 1: Brand & Tagline */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: '#0D9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <LocalHospitalIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Aegis Clinic
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, lineHeight: 1.65 }}>
              {CLINIC_INFO.tagline} Providing coordinated outpatient consultations, state-of-the-art diagnostic imaging, and 24/7 urgent care in Metroville.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#38BDF8', fontSize: '0.8rem' }}>
              <VerifiedUserIcon sx={{ fontSize: 16 }} />
              <span>{CLINIC_INFO.accreditation}</span>
            </Box>
          </Grid>

          {/* Col 2: Navigation Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.8rem' }}>
              Specialties
            </Typography>
            <Stack spacing={1.2}>
              {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Diagnostic Imaging'].map((item) => (
                <Typography
                  key={item}
                  component="button"
                  onClick={() => onNavigateToSection('services')}
                  sx={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    color: '#94A3B8',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#38BDF8' },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Col 3: Patient Care Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.8rem' }}>
              Quick Navigation
            </Typography>
            <Stack spacing={1.2}>
              {[
                { label: 'About Our Clinic', id: 'about' },
                { label: 'Medical Faculty', id: 'doctors' },
                { label: 'Opening Hours', id: 'hours' },
                { label: 'Patient Reviews', id: 'testimonials' },
                { label: 'Frequently Asked Questions', id: 'faq' },
                { label: 'Directions & Contact', id: 'contact' },
              ].map((link) => (
                <Typography
                  key={link.id}
                  component="button"
                  onClick={() => onNavigateToSection(link.id)}
                  sx={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    color: '#94A3B8',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#38BDF8' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Col 4: Campus Coordinates */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.8rem' }}>
              Health Campus
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              {CLINIC_INFO.address}
            </Typography>
            <Typography variant="body2" sx={{ color: '#38BDF8', fontWeight: 600, mb: 1 }}>
              Appointments: {CLINIC_INFO.phone}
            </Typography>
            <Typography variant="body2" sx={{ color: '#F87171', fontWeight: 700, mb: 2 }}>
              Urgent Line: {CLINIC_INFO.emergencyPhone}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onNavigateToSection('appointment')}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                fontSize: '0.82rem',
              }}
            >
              Online Request Portal
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        {/* Bottom row: Disclaimers, copyright & Back to Top */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              © {new Date().getFullYear()} Aegis Multi-Specialty Clinic. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Fictional demonstration website built with React, TypeScript & Material UI. Not affiliated with real clinical providers.
            </Typography>
          </Box>

          <Button
            size="small"
            onClick={scrollToTop}
            startIcon={<ArrowUpwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#94A3B8',
              textTransform: 'none',
              fontSize: '0.8rem',
              '&:hover': { color: '#FFFFFF' },
            }}
          >
            Back to Top
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
