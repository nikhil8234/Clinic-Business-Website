import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  useTheme,
  Stack,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { SectionHeader } from './SectionHeader';
import { TESTIMONIALS } from '../data/clinicData';

export const TestimonialsSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="testimonials"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#0B111E' : '#FFFFFF',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Patient Voices"
          title="Patient Experiences & Clinical Outcomes"
          description="Read verified feedback from patients and families who received coordinated specialty care at Aegis Health."
        />

        <Grid container spacing={3.5}>
          {TESTIMONIALS.map((testi) => (
            <Grid key={testi.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  p: { xs: 3, sm: 3.5 },
                  backgroundColor: isDark ? '#111827' : '#F8FAFC',
                  borderColor: theme.palette.divider,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Rating value={testi.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {testi.date}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.7,
                      fontStyle: 'normal',
                      mb: 3,
                    }}
                  >
                    "{testi.comment}"
                  </Typography>
                </Box>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {testi.patientName}
                      </Typography>
                      {testi.verified && (
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, color: 'primary.main', fontSize: '0.72rem', fontWeight: 600 }}>
                          <VerifiedIcon sx={{ fontSize: 14 }} /> Verified Patient
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {testi.specialtyTreated} · Attended by {testi.doctorAttended}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
