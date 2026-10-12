import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CLINIC_INFO } from '../data/clinicData';

interface NavbarProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  demoAppointmentsCount: number;
  onOpenDemoDrawer: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onToggleTheme,
  demoAppointmentsCount,
  onOpenDemoDrawer,
  onNavigateToSection,
  onOpenAiModal,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Hours', id: 'hours' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateToSection(id);
    setMobileOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(11, 17, 30, 0.88)'
            : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
      }}
    >
      {/* Emergency Hotline Header Strip */}
      <Box
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#0F172A' : '#0F766E',
          color: '#FFFFFF',
          py: 0.6,
          px: 2,
          fontSize: '0.8rem',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                <PhoneInTalkIcon sx={{ fontSize: 15 }} />
                24/7 Urgent Care Hotline:
              </Box>
              <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                {CLINIC_INFO.emergencyPhone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', fontSize: '0.78rem' }}>
              <span>{CLINIC_INFO.workingHoursSummary}</span>
              <Typography
                component="span"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  px: 1,
                  py: 0.2,
                  borderRadius: 1,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                Walk-ins Welcome
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation Toolbar */}
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 74 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Zone 1: Single Clean Wordmark */}
          <Box
            onClick={() => handleLinkClick('hero')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.2,
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.15rem', md: '1.25rem' },
                  letterSpacing: '-0.02em',
                  color: 'text.primary',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                }}
              >
                Aegis Clinic
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Multi-Specialty Care
              </Typography>
            </Box>
          </Box>

          {/* Zone 2: Navigation Links (Desktop) */}
          <Box
            component="nav"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            {navLinks.map((link) => (
              <Typography
                key={link.id}
                component="button"
                onClick={() => handleLinkClick(link.id)}
                sx={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'text.secondary',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>

          {/* Zone 3: Actions & CTA */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
            {/* AI Health Assistant Button */}
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={onOpenAiModal}
              startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                whiteSpace: 'nowrap',
                fontWeight: 600,
                fontSize: '0.84rem',
                borderRadius: 2,
                px: 1.8,
                py: 0.8,
              }}
            >
              AI Health Suite
            </Button>

            {/* Dark/Light Mode Switch */}
            <Tooltip title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={onToggleTheme}
                size="small"
                aria-label="Toggle visual theme"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 0.9,
                }}
              >
                {currentTheme === 'dark' ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 20, color: '#FBBF24' }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Demo Appointments Drawer Button */}
            <Tooltip title="View Demo Bookings">
              <IconButton
                onClick={onOpenDemoDrawer}
                size="small"
                aria-label="View demo appointments"
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 0.9,
                }}
              >
                <Badge badgeContent={demoAppointmentsCount} color="primary" max={99}>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Primary Action Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLinkClick('appointment')}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                whiteSpace: 'nowrap',
                fontWeight: 600,
                px: { sm: 2.2, md: 2.8 },
                py: 1,
              }}
            >
              Book Appointment
            </Button>

            {/* Mobile Menu Toggle */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, ml: 0.5 }}
              aria-label="Open mobile navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              p: 2.5,
              backgroundColor: theme.palette.background.paper,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospitalIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Aegis Clinic
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ pt: 0 }}>
          {navLinks.map((link) => (
            <ListItem key={link.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleLinkClick(link.id)}
                sx={{ borderRadius: 1.5, py: 1.2 }}
              >
                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: { sx: { fontWeight: 500, fontSize: '0.98rem' } },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleLinkClick('appointment')}
            sx={{ py: 1.3, mb: 1, fontWeight: 600 }}
          >
            Request Appointment
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => {
              setMobileOpen(false);
              onOpenAiModal();
            }}
            startIcon={<AutoAwesomeIcon />}
            sx={{ py: 1, mb: 1, fontWeight: 600, textTransform: 'none' }}
          >
            AI Health Suite (Chat, Voice & Maps)
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setMobileOpen(false);
              onOpenDemoDrawer();
            }}
            startIcon={<CalendarMonthOutlinedIcon />}
            sx={{ py: 1, textTransform: 'none' }}
          >
            Saved Demo Requests ({demoAppointmentsCount})
          </Button>

          <Box sx={{ mt: 2.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Urgent Medical Line (24/7)
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {CLINIC_INFO.phone}
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};
