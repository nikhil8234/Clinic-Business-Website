import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { SectionHeader } from './SectionHeader';
import { FAQ_ITEMS } from '../data/clinicData';

export const FaqSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | false>('faq-1');

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Appointments', value: 'Appointments' },
    { label: 'Insurance & Billing', value: 'Insurance' },
    { label: 'Visit Preparation', value: 'Visit Prep' },
    { label: 'Emergency Care', value: 'Emergency' },
  ];

  const handleAccordionChange = (panelId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedId(isExpanded ? panelId : false);
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box
      id="faq"
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? '#090D16' : '#F8FAFC',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="md">
        <SectionHeader
          eyebrow="Common Inquiries"
          title="Frequently Asked Questions"
          description="Find quick answers regarding our specialty consultation booking, insurance policies, intake preparation, and emergency services."
        />

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search questions (e.g. insurance, parking, referrals)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderRadius: 3,
            }}
          />
        </Box>

        {/* Category Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Tabs
            value={activeCategory}
            onChange={(_, val) => setActiveCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
              borderRadius: 2.5,
              p: 0.5,
              border: `1px solid ${theme.palette.divider}`,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {categories.map((cat) => (
              <Tab
                key={cat.value}
                label={cat.label}
                value={cat.value}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  borderRadius: 1.5,
                  minHeight: 38,
                  px: 2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#FFFFFF',
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Accordions */}
        {filteredFaqs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <QuizOutlinedIcon sx={{ fontSize: 44, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              No matching questions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or select another category.
            </Typography>
          </Box>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <Accordion
                key={faq.id}
                expanded={isExpanded}
                onChange={handleAccordionChange(faq.id)}
                sx={{
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                  aria-controls={`${faq.id}-content`}
                  id={`${faq.id}-header`}
                  sx={{
                    px: 3,
                    py: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: isExpanded ? 'primary.main' : 'text.primary',
                      fontSize: '1.02rem',
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Container>
    </Box>
  );
};
