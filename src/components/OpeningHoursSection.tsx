import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  Button,
  useTheme,
  Stack,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsIcon from '@mui/icons-material/Directions';
import { SectionHeader } from './SectionHeader';
import { OPENING_HOURS, DEPARTMENT_HOURS, CLINIC_INFO } from '../data/clinicData';

interface OpeningHoursSectionProps {
  onContactClick: () => void;
}

export const OpeningHoursSection: React.FC<OpeningHoursSectionProps> = ({
  onContactClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Get current day name in English (e.g. "Monday")
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  return (
    <Box
      id="hours"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#090D16' : '#F8FAFC',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Clinic Schedule & Accessibility"
          title="Operating Hours & Urgent Care Availability"
          description="We offer early morning, evening, and weekend clinic appointments. Our emergency triage and walk-in urgent care department remains open 24 hours daily."
        />

        <Grid container spacing={4}>
          {/* Left Column: Weekly Schedule Table */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    General Outpatient Schedule
                  </Typography>
                </Box>
                <Chip
                  label="Walk-ins Welcome"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                <Table size="medium">
                  <TableBody>
                    {OPENING_HOURS.map((item) => {
                      const isToday = item.day.toLowerCase() === todayName.toLowerCase();

                      return (
                        <TableRow
                          key={item.day}
                          sx={{
                            backgroundColor: isToday
                              ? isDark
                                ? 'rgba(13, 148, 136, 0.16)'
                                : 'rgba(13, 148, 136, 0.08)'
                              : 'transparent',
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{
                              fontWeight: isToday ? 700 : 500,
                              py: 1.75,
                              color: isToday ? 'primary.main' : 'text.primary',
                              borderBottomColor: theme.palette.divider,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.day}
                              {isToday && (
                                <Chip
                                  label="Today"
                                  size="small"
                                  color="primary"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              fontVariantNumeric: 'tabular-nums',
                              py: 1.75,
                              borderBottomColor: theme.palette.divider,
                            }}
                          >
                            {item.hours}
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{
                              py: 1.75,
                              display: { xs: 'none', sm: 'table-cell' },
                              color: 'text.secondary',
                              fontSize: '0.82rem',
                              borderBottomColor: theme.palette.divider,
                            }}
                          >
                            {item.notes}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2.5 }}>
                * Holidays may observe modified weekend outpatient hours. Emergency triage remains open 24/7/365.
              </Typography>
            </Card>
          </Grid>

          {/* Right Column: Department Schedules & 24/7 Hotline Callout */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Department breakdown card */}
              <Card
                sx={{
                  p: 3,
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                  SPECIALIZED DEPARTMENT HOURS
                </Typography>

                <Stack spacing={2}>
                  {DEPARTMENT_HOURS.map((dept, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.7)',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {dept.department}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          {dept.status}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {dept.schedule}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>

              {/* 24/7 Emergency Triage Banner */}
              <Card
                sx={{
                  p: 3,
                  backgroundColor: isDark ? '#1E293B' : '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: 3.5,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <LocalHospitalIcon sx={{ color: '#EF4444', fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                      24/7 Emergency Triage Line
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2.5, lineHeight: 1.6 }}>
                    If you are experiencing sudden acute symptoms, severe pain, or require prompt urgent evaluation,
                    call our triage nurses immediately or visit our emergency intake bay.
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: '#38BDF8',
                      letterSpacing: '-0.02em',
                      mb: 0.5,
                    }}
                  >
                    {CLINIC_INFO.emergencyPhone}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Available 365 Days a Year · Direct Triage Connection
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={onContactClick}
                    startIcon={<DirectionsIcon />}
                    sx={{
                      color: '#FFFFFF',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    View Campus Location & Parking
                  </Button>
                </Box>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
