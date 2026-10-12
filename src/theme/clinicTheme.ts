import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const getClinicTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#0D9488', // Deep clinical teal
        light: '#2DD4BF',
        dark: '#0F766E',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0284C7', // Medical trust blue
        light: '#38BDF8',
        dark: '#0369A1',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#059669',
        light: '#34D399',
        dark: '#047857',
      },
      warning: {
        main: '#D97706',
        light: '#FBBF24',
        dark: '#B45309',
      },
      error: {
        main: '#DC2626',
        light: '#F87171',
        dark: '#B91C1C',
      },
      background: {
        default: isDark ? '#090D16' : '#F8FAFC',
        paper: isDark ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#475569',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1.15,
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.015em',
        lineHeight: 1.25,
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h5: {
        fontWeight: 600,
        lineHeight: 1.35,
      },
      h6: {
        fontWeight: 600,
        lineHeight: 1.4,
      },
      subtitle1: {
        lineHeight: 1.6,
        letterSpacing: '-0.005em',
      },
      subtitle2: {
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        lineHeight: 1.65,
      },
      body2: {
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 22px',
            fontSize: '0.925rem',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 14px 0 rgba(13, 148, 136, 0.4)'
                : '0 4px 14px 0 rgba(13, 148, 136, 0.25)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(203, 213, 225, 0.9)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#2DD4BF' : '#0D9488',
              },
              '&.Mui-focused fieldset': {
                borderWidth: '2px',
                borderColor: '#0D9488',
              },
            },
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: '12px !important',
            marginBottom: '12px',
            '&:before': {
              display: 'none',
            },
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};
