# Aegis Multi-Specialty Clinic — Medical Center Web Platform

A responsive medical clinic website built with **React**, **TypeScript**, and **Material UI (MUI)**. Designed for a fictional multi-specialty healthcare institution ("Aegis Multi-Specialty Clinic") with a focus on accessibility, clear clinical communication, and a client-side appointment booking experience.

---

## 🌟 Features & Sections

1. **Top Bar & Navigation (`Navbar.tsx`)**:
   - 24/7 urgent care headline strip with hotline phone and operating hours.
   - Brand lockup with custom clinical cross emblem.
   - Smooth-scrolling navigation links with desktop and mobile responsive drawer.
   - Interactive Light / Dark theme mode toggle with localStorage persistence.
   - Stored Demo Requests badge counter providing instant access to simulated bookings.

2. **Polished Hero Section (`HeroSection.tsx`)**:
   - Clear value proposition with balanced typography.
   - Real-time clinic operational status indicator ("Open Today" vs "Urgent Care Only") computed dynamically.
   - Primary ("Request an Appointment") and secondary ("Explore Specialties") call-to-actions.
   - Quantitative trust metrics (99.4% satisfaction, 45+ board-certified doctors, <12 min average triage, same-day diagnostics).
   - Interactive medical campus feature card highlighting key active specialties.

3. **Clinic Philosophy & Core Pillars (`ClinicIntro.tsx`)**:
   - Overview of the clinic's patient-first methodology.
   - 4 fundamental clinical pillars: Multi-Disciplinary Care, Advanced In-House Diagnostics (3T MRI & Labs), Low Wait Times (<12 min), and Transparent Pricing.

4. **Medical Specialties Directory (`ServicesSection.tsx`)**:
   - Interactive category filter tabs (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, Diagnostics).
   - Specialized service cards with lead physician attributions and treated conditions.
   - Detailed modal for examining procedures, technologies, and instant prefill booking action.

5. **Physician Faculty Profiles (`DoctorsSection.tsx`)**:
   - Specialty filter chips.
   - Doctor cards with SVG clinician avatars, credentials, education, years of experience, patient ratings, and languages spoken.
   - Credentials & fellowship modal.
   - Direct "Book with Doctor" trigger which automatically selects the doctor and department in the appointment form.

6. **Opening Hours & Emergency Care (`OpeningHoursSection.tsx`)**:
   - Weekly operating hours table with automatic highlighting of the current day.
   - Specialized department hours (Urgent Care, Labs, Imaging, Outpatient).
   - Prominent 24/7 emergency triage hotline callout banner.

7. **Interactive Appointment Request Form (`AppointmentSection.tsx`)**:
   - Accessible form controls: Full legal name, email, phone number, department dropdown, doctor dropdown, date picker (minimum tomorrow's date), consultation time slot chips, reason for visit textarea, first-time patient checkbox, and urgency radio selector.
   - Real-time client-side validation with clear inline error messages and touch tracking.
   - Clear and prominent demo disclaimer banner informing users that no real health data is transmitted.

8. **Demonstration Confirmation Modal (`DemoConfirmationModal.tsx`)**:
   - Labeled with a prominent "DEMO APPOINTMENT CONFIRMATION" banner.
   - Unique reference code generation (e.g., `AEGIS-724109`).
   - Detailed booking breakdown (Doctor, Department, Date, Time, Urgency, Notes).
   - Actions to copy reference code, print official receipt, and view in saved requests list.

9. **Saved Demo Requests Drawer (`DemoAppointmentsDrawer.tsx`)**:
   - Allows users to review, delete, or clear all simulated appointments saved in `localStorage`.

10. **Aegis AI Clinical Suite & Multi-Modal Intelligence Hub (`AiAssistantModal.tsx`)**:
    - **Multi-Turn Gemini Chatbot**: Selectable medical roles (Care Navigator, Cardiology Advisor, Pediatric Guide, Triage Assistant) and model selection (`gemini-3.5-flash` for general tasks, `gemini-3.1-flash-lite` for speed, `gemini-3.1-pro-preview` for complex differential diagnosis) with scrollable conversation history and preset clinical prompts.
    - **Real-Time Voice Conversations (`gemini-3.8-live`)**: Full-duplex live spoken dialogue using the Gemini Live API over WebSockets. Streams 16kHz microphone capture and plays back 24kHz audio in real time with interactive status rings.
    - **Medical Audio Transcription (`gemini-3.5-transcribe`)**: In-app microphone speech-to-text allowing patients to dictate their symptoms and automatically insert verbatim transcriptions into the appointment request form.
    - **Google Maps Grounding (`gemini-3.5-flash` + `googleMaps`)**: Retrieves live verified nearby clinics, pharmacies, and testing centers, extracting and displaying clickable Google Maps place URLs and review summaries.
    - **Google Search Grounding (`gemini-3.5-flash` + `googleSearch`)**: Answers patient and clinical inquiries using Google Search grounding with clickable citation cards to verified web sources.

11. **Patient Testimonials (`TestimonialsSection.tsx`)**:
    - Authentic patient reviews with star ratings, treated specialties, and verified patient badges.

12. **FAQ Accordion (`FaqSection.tsx`)**:
    - Searchable question accordion with category filtering (Appointments, Insurance, Visit Prep, Emergency).

12. **Contact & Campus Location (`ContactSection.tsx`)**:
    - Physical address, public transit directions (Metro Blue Line), and patient parking instructions.
    - Direct phone extensions for each clinical department.
    - Interactive stylized map visualizer with Google Maps external link.

13. **Comprehensive Footer (`Footer.tsx`)**:
    - Emergency 911 warning banner.
    - Accreditation badges (JCAHO Gold Seal, ISO 9001).
    - Department sitemap and copyright notice.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Component System**: Material UI (MUI v6/v7) with `@emotion/react` and `@emotion/styled`
- **Iconography**: Material UI Icons (`@mui/icons-material`)
- **Styling**: Emotion styled engine + Tailwind CSS for base utilities
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useMemo`) + Browser `localStorage`

---

## 🎨 Design System & Theme Customization

The clinic's visual theme is configured in `src/theme/clinicTheme.ts`:
- **Primary Palette**: Clinical Deep Teal (`#0D9488`, light `#2DD4BF`, dark `#0F766E`)
- **Secondary Palette**: Trust Royal Blue (`#0284C7`, light `#38BDF8`)
- **Neutral Canvas**: Alabaster white in light mode (`#F8FAFC`, `#FFFFFF`), Obsidian slate in dark mode (`#090D16`, `#111827`)
- **Typography**: Responsive font scales utilizing `Plus Jakarta Sans` with tight tracking and balanced line heights
- **Accessibility**: Meets WCAG AA contrast standards, visible focus rings, and explicit form labeling.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
```

---

## ⚠️ Medical Disclaimer

*This application is a fictional demonstration project created for educational and design evaluation purposes. It does not provide medical advice, triage real symptoms, or connect to hospital scheduling systems. In a true medical emergency, always dial 911 or visit your nearest emergency department.*
