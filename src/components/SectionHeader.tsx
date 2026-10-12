import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  chipColor?: 'primary' | 'secondary' | 'default';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  chipColor = 'primary',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '100%',
        mx: align === 'center' ? 'auto' : 0,
        mb: { xs: 4, md: 6 },
      }}
    >
      {eyebrow && (
        <Chip
          label={eyebrow}
          size="small"
          color={chipColor}
          variant="outlined"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            borderRadius: '6px',
            backgroundColor:
              chipColor === 'primary'
                ? theme.palette.mode === 'dark'
                  ? 'rgba(13, 148, 136, 0.12)'
                  : 'rgba(13, 148, 136, 0.08)'
                : undefined,
          }}
        />
      )}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontSize: { xs: '1.85rem', sm: '2.25rem', md: '2.65rem' },
          fontWeight: 700,
          color: 'text.primary',
          mb: description ? 1.5 : 0,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '680px',
            mx: align === 'center' ? 'auto' : 0,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};
