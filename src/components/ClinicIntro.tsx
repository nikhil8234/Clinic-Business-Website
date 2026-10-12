import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
} from '@mui/material';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { SectionHeader } from './SectionHeader';

export const ClinicIntro: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const pillars = [
    {
      icon: <HealthAndSafetyOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'Integrated Multi-Disciplinary Care',
      description:
        'Instead of visiting five different medical offices across the city, your cardiologist, neurologist, and internist consult together under one roof with shared medical records.',
      benefit: 'Zero fragmented referrals',
    },
    {
      icon: <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'State-of-the-Art In-House Diagnostics',
      description:
        'Equipped with quiet-bore 3T MRI, low-dose volumetric CT, ultrasound, and high-complexity clinical pathology. Diagnostic images are evaluated by on-site radiologists within hours.',
      benefit: 'Same-day test results',
    },
    {
      icon: <SentimentSatisfiedAltOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'Patient-First Dignity & Rapid Triage',
      description:
        'Our clinical workflows prioritize your time. Enjoy average appointment wait times under 12 minutes in tranquil, private consultation suites designed for honest dialogue.',
      benefit: 'Average wait under 12 minutes',
    },
    {
      icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 32 }} />,
      title: 'Transparent Pricing & Insurance Clarity',
      description:
        'We believe healthcare should have no hidden financial surprises. We partner with major insurance networks and provide upfront cost schedules for all outpatient procedures.',
      benefit: 'Itemized fee schedules',
    },
  ];

  return (
    <Box
      id="about"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#0B111E' : '#FFFFFF',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Our Clinical Philosophy"
          title="Modern Medicine Designed Around the Patient Experience"
          description="Founded on the conviction that medical excellence requires both deep clinical precision and genuine human empathy, Aegis Health coordinates specialized care seamlessly."
        />

        <Grid container spacing={3.5}>
          {pillars.map((pillar, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  backgroundColor: isDark ? '#111827' : '#F8FAFC',
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? 'rgba(13, 148, 136, 0.18)' : 'rgba(13, 148, 136, 0.1)',
                    color: 'primary.main',
                    mb: 2.5,
                  }}
                >
                  {pillar.icon}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.25, fontSize: '1.15rem' }}>
                  {pillar.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.65 }}>
                  {pillar.description}
                </Typography>

                <Box
                  sx={{
                    pt: 1.5,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '0.8rem' }}>
                    Key Benefit:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.8rem' }}>
                    {pillar.benefit}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
