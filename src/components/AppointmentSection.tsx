import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Alert,
  Chip,
  CircularProgress,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MicIcon from '@mui/icons-material/Mic';
import { SectionHeader } from './SectionHeader';
import { MEDICAL_SERVICES, DOCTORS, TIME_SLOTS, CLINIC_INFO } from '../data/clinicData';
import { AppointmentFormValues, AppointmentFormErrors, AppointmentRequest } from '../types/clinic';

interface AppointmentSectionProps {
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
  transcribedNotes?: string;
  onOpenAiModal?: (tab?: number) => void;
  onAppointmentBooked: (request: AppointmentRequest) => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  preselectedServiceId,
  preselectedDoctorId,
  transcribedNotes,
  onOpenAiModal,
  onAppointmentBooked,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Calculate tomorrow's date string YYYY-MM-DD as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const defaultValues: AppointmentFormValues = {
    fullName: '',
    email: '',
    phone: '',
    department: preselectedServiceId || 'cardiology',
    doctorId: preselectedDoctorId || 'any',
    date: minDateString,
    timeSlot: TIME_SLOTS[0],
    visitReason: '',
    isFirstTimePatient: true,
    urgency: 'routine',
  };

  const [formValues, setFormValues] = useState<AppointmentFormValues>(defaultValues);
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof AppointmentFormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // Sync props when user clicks "Book with Dr. [Name]" or "Book Visit"
  useEffect(() => {
    if (preselectedServiceId) {
      setFormValues((prev) => ({ ...prev, department: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (preselectedDoctorId) {
      setFormValues((prev) => ({ ...prev, doctorId: preselectedDoctorId }));
    }
  }, [preselectedDoctorId]);

  useEffect(() => {
    if (transcribedNotes) {
      setFormValues((prev) => ({
        ...prev,
        visitReason: prev.visitReason ? `${prev.visitReason}\n${transcribedNotes}` : transcribedNotes,
      }));
    }
  }, [transcribedNotes]);

  // Validation function
  const validateField = (name: keyof AppointmentFormValues, value: any): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please provide your full legal name (at least 2 characters).';
        }
        return undefined;
      case 'email':
        if (!value || typeof value !== 'string') {
          return 'Email address is required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address (e.g., patient@example.com).';
        }
        return undefined;
      case 'phone':
        if (!value || typeof value !== 'string') {
          return 'Contact phone number is required.';
        }
        // Accepts formats with at least 10 digits
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          return 'Please enter a valid 10-digit phone number.';
        }
        return undefined;
      case 'department':
        if (!value) {
          return 'Please select a clinical specialty department.';
        }
        return undefined;
      case 'date':
        if (!value) {
          return 'Please select your preferred appointment date.';
        }
        if (value < minDateString) {
          return 'Please choose a future date (starting from tomorrow).';
        }
        return undefined;
      case 'timeSlot':
        if (!value) {
          return 'Please select a preferred consultation time slot.';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: AppointmentFormErrors = {};
    (Object.keys(formValues) as (keyof AppointmentFormValues)[]).forEach((field) => {
      const fieldError = validateField(field, formValues[field]);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof AppointmentFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formValues[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleChange = (field: keyof AppointmentFormValues, value: any) => {
    setFormValues((prev) => {
      const next = { ...prev, [field]: value };
      // If department changed and selected doctor does not belong to new department, reset doctor to "any"
      if (field === 'department' && next.doctorId !== 'any') {
        const doc = DOCTORS.find((d) => d.id === next.doctorId);
        if (doc && doc.departmentId !== value) {
          next.doctorId = 'any';
        }
      }
      return next;
    });

    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Partial<Record<keyof AppointmentFormValues, boolean>> = {};
    (Object.keys(formValues) as (keyof AppointmentFormValues)[]).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    if (!validateAll()) {
      setBannerAlert('Please review the highlighted fields in the form before submitting.');
      return;
    }

    setBannerAlert(null);
    setIsSubmitting(true);

    // Simulate fast client-side submission & storage
    setTimeout(() => {
      const randomRef = 'AEGIS-' + Math.floor(100000 + Math.random() * 900000);
      const chosenDept = MEDICAL_SERVICES.find((s) => s.id === formValues.department)?.title || formValues.department;
      const chosenDoc = formValues.doctorId === 'any'
        ? 'First Available Specialist'
        : DOCTORS.find((d) => d.id === formValues.doctorId)?.name || 'First Available Specialist';

      const newBooking: AppointmentRequest = {
        id: 'booking-' + Date.now(),
        referenceNumber: randomRef,
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        department: chosenDept,
        doctor: chosenDoc,
        date: formValues.date,
        timeSlot: formValues.timeSlot,
        visitReason: formValues.visitReason.trim() || 'General consultation & evaluation',
        isFirstTimePatient: formValues.isFirstTimePatient,
        urgency: formValues.urgency,
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onAppointmentBooked(newBooking);

      // Reset form to defaults
      setFormValues(defaultValues);
      setTouched({});
      setErrors({});
    }, 450);
  };

  // Doctors matching currently selected department
  const availableDoctors = DOCTORS.filter((d) => d.departmentId === formValues.department);

  return (
    <Box
      id="appointment"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#0B111E' : '#FFFFFF',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Request Consultation"
          title="Schedule Your Specialist Appointment"
          description="Submit your preferred clinical specialty, physician, and consultation time. Same-day urgent consultations and priority visits are arranged immediately."
        />

        {/* DEMO NOTICE CALLOUT */}
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          sx={{
            maxWidth: '820px',
            mx: 'auto',
            mb: 4,
            borderRadius: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: isDark ? 'rgba(2, 132, 199, 0.12)' : 'rgba(2, 132, 199, 0.08)',
            color: 'text.primary',
            '& .MuiAlert-icon': {
              color: 'secondary.main',
            },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25 }}>
            Interactive Demo Portal Notice
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.86rem' }}>
            This application is a frontend demonstration. Your appointment requests are safely saved
            to your local browser session and displayed in your demo dashboard. <strong>No real health records or live bookings are transmitted.</strong>
          </Typography>
        </Alert>

        <Card
          sx={{
            maxWidth: '820px',
            mx: 'auto',
            p: { xs: 2.5, sm: 4.5 },
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderRadius: 4,
          }}
        >
          {bannerAlert && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setBannerAlert(null)}>
              {bannerAlert}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Full Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="appointment-full-name"
                  label="Full Legal Name *"
                  placeholder="e.g. Eleanor Vance"
                  value={formValues.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  error={Boolean(touched.fullName && errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  slotProps={{
                    input: {
                      'aria-required': 'true',
                      'aria-invalid': Boolean(touched.fullName && errors.fullName),
                    },
                  }}
                />
              </Grid>

              {/* Patient Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="appointment-email"
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. eleanor@example.com"
                  value={formValues.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  slotProps={{
                    input: {
                      'aria-required': 'true',
                      'aria-invalid': Boolean(touched.email && errors.email),
                    },
                  }}
                />
              </Grid>

              {/* Phone Number */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="appointment-phone"
                  label="Contact Phone Number *"
                  type="tel"
                  placeholder="e.g. (555) 432-8910"
                  value={formValues.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                  slotProps={{
                    input: {
                      'aria-required': 'true',
                      'aria-invalid': Boolean(touched.phone && errors.phone),
                    },
                  }}
                />
              </Grid>

              {/* Department Selector */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.department && errors.department)}
                >
                  <InputLabel id="dept-select-label">Medical Specialty Department *</InputLabel>
                  <Select
                    labelId="dept-select-label"
                    id="appointment-department"
                    label="Medical Specialty Department *"
                    value={formValues.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    onBlur={() => handleBlur('department')}
                  >
                    {MEDICAL_SERVICES.map((serv) => (
                      <MenuItem key={serv.id} value={serv.id}>
                        {serv.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.department && errors.department && (
                    <FormHelperText>{errors.department}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Preferred Doctor Selector */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel id="doctor-select-label">Preferred Doctor</InputLabel>
                  <Select
                    labelId="doctor-select-label"
                    id="appointment-doctor"
                    label="Preferred Doctor"
                    value={formValues.doctorId}
                    onChange={(e) => handleChange('doctorId', e.target.value)}
                  >
                    <MenuItem value="any">
                      <em>Any Available Department Specialist (Earliest Slot)</em>
                    </MenuItem>
                    {availableDoctors.map((doc) => (
                      <MenuItem key={doc.id} value={doc.id}>
                        {doc.name} — {doc.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {availableDoctors.length > 0
                      ? `${availableDoctors.length} specialist(s) available in this department`
                      : 'Choose specialty above to filter specialists'}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Preferred Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="appointment-date"
                  label="Preferred Date *"
                  type="date"
                  value={formValues.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  onBlur={() => handleBlur('date')}
                  error={Boolean(touched.date && errors.date)}
                  helperText={touched.date && errors.date || 'Available Monday through Saturday'}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      min: minDateString,
                      'aria-required': 'true',
                    },
                  }}
                />
              </Grid>

              {/* Time Slot Picker */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.25, color: 'text.primary' }}>
                  Select Preferred Consultation Time *
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = formValues.timeSlot === slot;
                    return (
                      <Chip
                        key={slot}
                        label={slot}
                        clickable
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => handleChange('timeSlot', slot)}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          py: 2,
                          px: 1,
                        }}
                      />
                    );
                  })}
                </Box>
                {touched.timeSlot && errors.timeSlot && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.timeSlot}
                  </Typography>
                )}
              </Grid>

              {/* Visit Reason / Clinical Notes */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Clinical Intake Notes & Symptoms
                  </Typography>
                  {onOpenAiModal && (
                    <Button
                      size="small"
                      variant="text"
                      color="primary"
                      startIcon={<MicIcon sx={{ fontSize: 16 }} />}
                      onClick={() => onOpenAiModal(2)}
                      sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 0.2 }}
                    >
                      Dictate with AI Speech-to-Text
                    </Button>
                  )}
                </Box>
                <TextField
                  fullWidth
                  id="appointment-reason"
                  label="Reason for Visit / Primary Symptoms (Optional)"
                  placeholder="Briefly describe your symptoms, relevant history, or if this is an annual preventative checkup."
                  multiline
                  rows={3}
                  value={formValues.visitReason}
                  onChange={(e) => handleChange('visitReason', e.target.value)}
                />
              </Grid>

              {/* Patient Toggles & Urgency */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.isFirstTimePatient}
                      onChange={(e) => handleChange('isFirstTimePatient', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        First-Time Patient at Aegis Clinic
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        We will allocate extra time for comprehensive digital intake.
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>
                    Urgency Classification
                  </FormLabel>
                  <RadioGroup
                    row
                    value={formValues.urgency}
                    onChange={(e) => handleChange('urgency', e.target.value)}
                  >
                    <FormControlLabel
                      value="routine"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Routine / Elective</Typography>}
                    />
                    <FormControlLabel
                      value="urgent"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                          Priority / Within 24-48h
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CalendarMonthIcon />}
                  sx={{
                    py: 1.6,
                    fontSize: '1.02rem',
                    fontWeight: 700,
                  }}
                >
                  {isSubmitting ? 'Validating Demo Request...' : 'Confirm Appointment Request'}
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2, color: 'text.secondary' }}>
                  <LockOutlinedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">
                    256-bit encrypted intake · HIPAA compliant demo environment
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
