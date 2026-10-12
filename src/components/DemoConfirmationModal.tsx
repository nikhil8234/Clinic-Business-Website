import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
  Alert,
  IconButton,
  useTheme,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AppointmentRequest } from '../types/clinic';

interface DemoConfirmationModalProps {
  open: boolean;
  appointment: AppointmentRequest | null;
  onClose: () => void;
  onOpenStoredRequests: () => void;
}

export const DemoConfirmationModal: React.FC<DemoConfirmationModalProps> = ({
  open,
  appointment,
  onClose,
  onOpenStoredRequests,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [copied, setCopied] = useState(false);

  if (!appointment) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Aegis Clinic Demo Request: #${appointment.referenceNumber} | ${appointment.fullName} | ${appointment.department} with ${appointment.doctor} on ${appointment.date} at ${appointment.timeSlot}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: { xs: 1.5, sm: 2 },
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Chip
              label="DEMO BOOKING CONFIRMED"
              color="warning"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22, mb: 0.5 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Appointment Request Logged
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: theme.palette.divider }}>
        {/* EXPLICIT DISCLAIMER BANNER */}
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2.5,
            border: '1px solid rgba(217, 119, 6, 0.3)',
            backgroundColor: isDark ? 'rgba(217, 119, 6, 0.12)' : 'rgba(217, 119, 6, 0.08)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Demonstration Confirmation Only:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.25 }}>
            This appointment request has been recorded locally to your demo browser session.
            It does not constitute a real clinical booking and no physician will be dispatched.
          </Typography>
        </Alert>

        {/* Reference Number Box */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(241, 245, 249, 0.8)',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Demo Confirmation Reference
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
              {appointment.referenceNumber}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopy}
            startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none', fontSize: '0.8rem' }}
          >
            {copied ? 'Copied!' : 'Copy Ref'}
          </Button>
        </Box>

        {/* Breakdown of Appointment Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5 }}>
              <PersonIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption">Patient Name</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {appointment.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {appointment.email} · {appointment.phone}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5 }}>
              <LocalHospitalIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption">Specialty & Physician</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {appointment.doctor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {appointment.department}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5 }}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption">Date & Time</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {appointment.date}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Slot: {appointment.timeSlot}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption">Status & Classification</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.25 }}>
              <Chip
                label={appointment.urgency === 'urgent' ? 'Priority Urgency' : 'Routine Visit'}
                size="small"
                color={appointment.urgency === 'urgent' ? 'warning' : 'default'}
              />
              {appointment.isFirstTimePatient && (
                <Chip label="First-Time Patient" size="small" variant="outlined" />
              )}
            </Box>
          </Grid>
        </Grid>

        {appointment.visitReason && (
          <Box sx={{ mt: 2, p: 1.75, borderRadius: 2, bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Reported Symptoms / Notes:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.25 }}>
              "{appointment.visitReason}"
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button
          onClick={handlePrint}
          startIcon={<PrintOutlinedIcon />}
          color="inherit"
          sx={{ textTransform: 'none' }}
        >
          Print Receipt
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => {
              onClose();
              onOpenStoredRequests();
            }}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            View Demo List
          </Button>

          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Done
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
