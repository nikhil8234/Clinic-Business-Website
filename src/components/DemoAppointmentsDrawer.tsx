import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { AppointmentRequest } from '../types/clinic';

interface DemoAppointmentsDrawerProps {
  open: boolean;
  onClose: () => void;
  appointments: AppointmentRequest[];
  onDeleteAppointment: (id: string) => void;
  onClearAll: () => void;
  onBookNew: () => void;
}

export const DemoAppointmentsDrawer: React.FC<DemoAppointmentsDrawerProps> = ({
  open,
  onClose,
  appointments,
  onDeleteAppointment,
  onClearAll,
  onBookNew,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            maxWidth: '100%',
            p: 3,
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventAvailableIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Local Demo Requests ({appointments.length})
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
        These entries are stored only in your browser's local memory for demonstration purposes.
      </Alert>

      <Divider sx={{ mb: 2 }} />

      {appointments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CalendarMonthIcon sx={{ fontSize: 54, color: 'text.secondary', opacity: 0.4, mb: 1.5 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
            No Demo Requests Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 280, mx: 'auto' }}>
            Submit the appointment form to see your simulated bookings listed here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose();
              onBookNew();
            }}
          >
            Create Demo Request
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack spacing={2} sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
            {appointments.map((item) => (
              <Card
                key={item.id}
                sx={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(241, 245, 249, 0.6)',
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
                    #{item.referenceNumber}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteAppointment(item.id)}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    aria-label="Remove demo booking"
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {item.fullName}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mb: 0.5 }}>
                  {item.doctor} · {item.department}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                  <Chip
                    label={`${item.date} @ ${item.timeSlot}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  />
                  <Chip
                    label={item.urgency === 'urgent' ? 'Priority' : 'Routine'}
                    size="small"
                    color={item.urgency === 'urgent' ? 'warning' : 'default'}
                    sx={{ fontSize: '0.72rem' }}
                  />
                </Box>

                {item.visitReason && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', mt: 0.5 }}>
                    "{item.visitReason}"
                  </Typography>
                )}
              </Card>
            ))}
          </Stack>

          <Box sx={{ pt: 2, mt: 'auto', borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              size="small"
              onClick={onClearAll}
              sx={{ textTransform: 'none' }}
            >
              Clear All Requests
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="small"
              onClick={() => {
                onClose();
                onBookNew();
              }}
              sx={{ textTransform: 'none' }}
            >
              Book Another
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};
