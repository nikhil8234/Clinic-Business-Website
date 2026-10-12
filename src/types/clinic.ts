export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  availability: string;
  bio: string;
  education: string[];
  specialties: string[];
  consultationFee: string;
  avatarBg: string;
  gender: 'female' | 'male';
}

export interface MedicalService {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  commonConditions: string[];
  procedures: string[];
  headSpecialist: string;
  iconName: string;
  badge: string;
}

export interface DaySchedule {
  day: string;
  hours: string;
  isOpen: boolean;
  notes?: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  verified: boolean;
  rating: number;
  date: string;
  specialtyTreated: string;
  doctorAttended: string;
  comment: string;
}

export interface FAQItem {
  id: string;
  category: 'Appointments' | 'Insurance' | 'Visit Prep' | 'Emergency';
  question: string;
  answer: string;
}

export interface AppointmentRequest {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  doctor: string;
  date: string;
  timeSlot: string;
  visitReason: string;
  isFirstTimePatient: boolean;
  urgency: 'routine' | 'urgent';
  createdAt: string;
}

export interface AppointmentFormValues {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  visitReason: string;
  isFirstTimePatient: boolean;
  urgency: 'routine' | 'urgent';
}

export type AppointmentFormErrors = Partial<Record<keyof AppointmentFormValues, string>>;
