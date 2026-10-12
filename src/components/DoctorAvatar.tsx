import React from 'react';
import { Box } from '@mui/material';

interface DoctorAvatarProps {
  name: string;
  gender: 'female' | 'male';
  departmentId: string;
  size?: number;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  name,
  gender,
  departmentId,
  size = 120,
}) => {
  // Department-specific theme tints
  const deptGradients: Record<string, { bg1: string; bg2: string; accent: string }> = {
    cardiology: { bg1: '#0F766E', bg2: '#134E4A', accent: '#F43F5E' },
    neurology: { bg1: '#1E3A8A', bg2: '#172554', accent: '#38BDF8' },
    pediatrics: { bg1: '#EA580C', bg2: '#9A3412', accent: '#FBBF24' },
    orthopedics: { bg1: '#0284C7', bg2: '#075985', accent: '#10B981' },
    dermatology: { bg1: '#7C3AED', bg2: '#5B21B6', accent: '#EC4899' },
    diagnostics: { bg1: '#475569', bg2: '#1E293B', accent: '#2DD4BF' },
  };

  const scheme = deptGradients[departmentId] || { bg1: '#0D9488', bg2: '#115E59', accent: '#38BDF8' };

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.15)',
        border: '3px solid #FFFFFF',
        flexShrink: 0,
        backgroundColor: scheme.bg1,
      }}
    >
      <svg
        viewBox="0 0 160 160"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        aria-label={`Portrait illustration of ${name}`}
      >
        <defs>
          <linearGradient id={`bg-${departmentId}-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scheme.bg1} />
            <stop offset="100%" stopColor={scheme.bg2} />
          </linearGradient>
          <linearGradient id={`coat-${departmentId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id={`skin-f`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          <linearGradient id={`skin-m`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>
        </defs>

        {/* Ambient Gradient Background */}
        <rect width="160" height="160" fill={`url(#bg-${departmentId}-${gender})`} />

        {/* Soft Background Clinic Glow Ring */}
        <circle cx="80" cy="70" r="58" fill="rgba(255,255,255,0.08)" />

        {/* Body / Medical Coat */}
        <path
          d="M 28 160 C 28 128, 52 118, 80 118 C 108 118, 132 128, 132 160 Z"
          fill={`url(#coat-${departmentId})`}
        />

        {/* Scrubs Shirt V-Neck */}
        <polygon points="68,118 92,118 80,140" fill={scheme.bg1} />

        {/* Lab Coat Lapels */}
        <path d="M 52 118 L 68 152 L 40 160 Z" fill="#F8FAFC" />
        <path d="M 108 118 L 92 152 L 120 160 Z" fill="#F8FAFC" />

        {/* Stethoscope */}
        <path
          d="M 58 122 C 58 144, 72 152, 78 152 C 84 152, 98 144, 98 122"
          fill="none"
          stroke="#334155"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="78" cy="154" r="5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />

        {/* Neck */}
        <rect
          x="70"
          y="84"
          width="20"
          height="28"
          rx="4"
          fill={gender === 'female' ? 'url(#skin-f)' : 'url(#skin-m)'}
        />

        {/* Head */}
        {gender === 'female' ? (
          <>
            {/* Female Hair Back */}
            <path d="M 46 64 C 46 36, 114 36, 114 64 C 114 96, 112 112, 102 116 C 96 100, 64 100, 58 116 C 48 112, 46 96, 46 64 Z" fill="#1E293B" />
            {/* Face */}
            <ellipse cx="80" cy="74" rx="22" ry="26" fill="url(#skin-f)" />
            {/* Female Hair Bangs / Front */}
            <path d="M 56 64 C 60 48, 80 44, 104 54 C 106 62, 104 70, 104 70 C 94 62, 74 60, 56 68 Z" fill="#0F172A" />
            {/* Eyes */}
            <circle cx="71" cy="73" r="2.5" fill="#0F172A" />
            <circle cx="89" cy="73" r="2.5" fill="#0F172A" />
            {/* Gentle Smile */}
            <path d="M 74 85 Q 80 90 86 85" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Male Hair */}
            <path d="M 54 62 C 54 44, 106 44, 106 62 C 106 50, 96 42, 80 42 C 64 42, 54 50, 54 62 Z" fill="#0F172A" />
            {/* Face */}
            <ellipse cx="80" cy="74" rx="22" ry="26" fill="url(#skin-m)" />
            {/* Male Hair Top */}
            <path d="M 56 56 C 60 44, 76 40, 104 46 C 102 52, 94 54, 80 52 C 68 52, 60 54, 56 56 Z" fill="#1E293B" />
            {/* Eyes */}
            <circle cx="71" cy="73" r="2.5" fill="#0F172A" />
            <circle cx="89" cy="73" r="2.5" fill="#0F172A" />
            {/* Confident Smile */}
            <path d="M 74 85 Q 80 89 86 85" fill="none" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Small Specialty Icon Badge */}
        <circle cx="136" cy="24" r="14" fill="#FFFFFF" />
        <circle cx="136" cy="24" r="11" fill={scheme.accent} />
        <path d="M 136 19 L 136 29 M 131 24 L 141 24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </Box>
  );
};
