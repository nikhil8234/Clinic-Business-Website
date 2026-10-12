/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Snackbar,
  Alert,
  Fab,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getClinicTheme } from './theme/clinicTheme';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ClinicIntro } from './components/ClinicIntro';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { OpeningHoursSection } from './components/OpeningHoursSection';
import { AppointmentSection } from './components/AppointmentSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DemoConfirmationModal } from './components/DemoConfirmationModal';
import { DemoAppointmentsDrawer } from './components/DemoAppointmentsDrawer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AppointmentRequest } from './types/clinic';

// Initial sample demo booking to illustrate saved state
const INITIAL_DEMO_REQUESTS: AppointmentRequest[] = [
  {
    id: 'sample-1',
    referenceNumber: 'AEGIS-724109',
    fullName: 'Clara Montgomery',
    email: 'clara.m@example.com',
    phone: '(555) 349-8120',
    department: 'Cardiology & Vascular Health',
    doctor: 'Dr. Sarah Chen',
    date: '2026-10-18',
    timeSlot: '10:00 AM',
    visitReason: 'Preventative cardiovascular checkup and resting electrocardiogram.',
    isFirstTimePatient: true,
    urgency: 'routine',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  // Theme state with localStorage persistence
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aegis_theme_mode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Demo appointments state with localStorage persistence
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => {
    try {
      const stored = localStorage.getItem('aegis_demo_appointments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored demo appointments', e);
    }
    return INITIAL_DEMO_REQUESTS;
  });

  // Active newly created booking to display in confirmation modal
  const [activeBooking, setActiveBooking] = useState<AppointmentRequest | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);

  // Preselected specialty & doctor when user clicks "Book with Dr. X"
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>(undefined);

  // AI Clinical Suite state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalInitialTab, setAiModalInitialTab] = useState(0);
  const [transcribedNotes, setTranscribedNotes] = useState('');

  const handleOpenAiModal = (tab: number = 0) => {
    setAiModalInitialTab(tab);
    setIsAiModalOpen(true);
  };

  const handleInsertTranscription = (text: string) => {
    setTranscribedNotes(text);
    handleNavigateToSection('appointment');
    setToast({
      message: 'Dictated notes inserted into appointment form.',
      severity: 'success',
    });
  };

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'info' | 'warning' } | null>(null);

  // Save appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aegis_demo_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to save demo appointments', e);
    }
  }, [appointments]);

  // Save theme mode to localStorage
  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('aegis_theme_mode', next);
      return next;
    });
  };

  const currentTheme = useMemo(() => getClinicTheme(themeMode), [themeMode]);

  // Smooth scroll handler
  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When user clicks "Book Visit" from services
  const handleSelectServiceForBooking = (serviceId: string) => {
    setPreselectedService(serviceId);
    setPreselectedDoctor('any');
    handleNavigateToSection('appointment');
  };

  // When user clicks "Book with Doctor" from doctors section
  const handleSelectDoctorForBooking = (doctorId: string, departmentId: string) => {
    setPreselectedDoctor(doctorId);
    setPreselectedService(departmentId);
    handleNavigateToSection('appointment');
  };

  // Appointment creation handler
  const handleAppointmentBooked = (request: AppointmentRequest) => {
    setAppointments((prev) => [request, ...prev]);
    setActiveBooking(request);
    setIsConfirmationOpen(true);
    setToast({
      message: `Demo booking #${request.referenceNumber} recorded successfully!`,
      severity: 'success',
    });
  };

  // Delete a demo appointment
  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setToast({
      message: 'Demo appointment request removed from local list.',
      severity: 'info',
    });
  };

  // Clear all demo appointments
  const handleClearAllAppointments = () => {
    setAppointments([]);
    setToast({
      message: 'All local demo appointment requests cleared.',
      severity: 'info',
    });
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        {/* Navigation Bar */}
        <Navbar
          currentTheme={themeMode}
          onToggleTheme={handleToggleTheme}
          demoAppointmentsCount={appointments.length}
          onOpenDemoDrawer={() => setIsDemoDrawerOpen(true)}
          onNavigateToSection={handleNavigateToSection}
          onOpenAiModal={() => handleOpenAiModal(0)}
        />

        {/* Hero Section */}
        <HeroSection
          onBookClick={() => handleNavigateToSection('appointment')}
          onExploreServices={() => handleNavigateToSection('services')}
          onOpenAiModal={handleOpenAiModal}
        />

        {/* Clinic Introduction & 4 Pillars */}
        <ClinicIntro />

        {/* Comprehensive Medical Specialties */}
        <ServicesSection
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* Board-Certified Specialty Physicians */}
        <DoctorsSection
          onSelectDoctorForBooking={handleSelectDoctorForBooking}
        />

        {/* Operating Hours & Urgent Care */}
        <OpeningHoursSection
          onContactClick={() => handleNavigateToSection('contact')}
        />

        {/* Appointment Request Form with Validation */}
        <AppointmentSection
          preselectedServiceId={preselectedService}
          preselectedDoctorId={preselectedDoctor}
          transcribedNotes={transcribedNotes}
          onOpenAiModal={handleOpenAiModal}
          onAppointmentBooked={handleAppointmentBooked}
        />

        {/* Patient Testimonials */}
        <TestimonialsSection />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Contact & Location Details */}
        <ContactSection />

        {/* Clinic Footer */}
        <Footer onNavigateToSection={handleNavigateToSection} />

        {/* Floating AI Assistant Trigger Button */}
        <Fab
          color="primary"
          aria-label="Open AI Health Suite"
          onClick={() => handleOpenAiModal(0)}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, md: 28 },
            right: { xs: 20, md: 28 },
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
          }}
        >
          <AutoAwesomeIcon />
        </Fab>

        {/* Gemini AI Multi-Modal Assistant Modal */}
        <AiAssistantModal
          open={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          initialTab={aiModalInitialTab}
          onInsertTranscriptionToAppointment={handleInsertTranscription}
        />

        {/* Demonstration Booking Confirmation Modal */}
        <DemoConfirmationModal
          open={isConfirmationOpen}
          appointment={activeBooking}
          onClose={() => setIsConfirmationOpen(false)}
          onOpenStoredRequests={() => setIsDemoDrawerOpen(true)}
        />

        {/* Drawer for Viewing Stored Demo Requests */}
        <DemoAppointmentsDrawer
          open={isDemoDrawerOpen}
          onClose={() => setIsDemoDrawerOpen(false)}
          appointments={appointments}
          onDeleteAppointment={handleDeleteAppointment}
          onClearAll={handleClearAllAppointments}
          onBookNew={() => handleNavigateToSection('appointment')}
        />

        {/* Toast Snackbar */}
        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={4000}
          onClose={() => setToast(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {toast ? (
            <Alert
              onClose={() => setToast(null)}
              severity={toast.severity}
              variant="filled"
              sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
            >
              {toast.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
