import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Button,
  TextField,
  Chip,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Tooltip,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AiAssistantModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: number;
  onInsertTranscriptionToAppointment?: (text: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  open,
  onClose,
  initialTab = 0,
  onInsertTranscriptionToAppointment,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tabIndex, setTabIndex] = useState(initialTab);

  useEffect(() => {
    setTabIndex(initialTab);
  }, [initialTab]);

  // ================= TAB 1: GEMINI MULTI-TURN CHAT =================
  const [chatRole, setChatRole] = useState<'navigator' | 'cardio' | 'pediatric' | 'general'>('navigator');
  const [chatModel, setChatModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const roleInstructions: Record<string, string> = {
    navigator: 'You are the Aegis Clinical Care Navigator. Guide patients through clinic offerings, explain appointment preparation, and suggest appropriate departments based on their symptoms.',
    cardio: 'You are a Cardiology Specialist Consultant for Aegis Clinic. Explain cardiovascular terms, echocardiogram preparation, lipid panels, and heart health prevention clearly.',
    pediatric: 'You are a Pediatric Care Specialist for Aegis Clinic. Advise parents on childhood milestones, routine immunizations, and gentle pediatric care guidelines.',
    general: 'You are an Intelligent Medical Triage Assistant. Help patients understand medical terminology, evaluate urgency, and guide them on when to seek immediate care.',
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      role: 'assistant',
      content: 'Hello! I am your Aegis Clinical AI Assistant. How can I assist you with clinical information, symptom guidance, or appointment preparation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput.trim();
    if (!textToSend || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: chatModel,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction: roleInstructions[chatRole],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate response.');
      }

      const assistantMessage: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setChatError(err.message || 'Error communicating with Gemini.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // ================= TAB 2: LIVE VOICE API (gemini-3.8-live) =================
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [liveError, setLiveError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const stopLiveSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setIsLiveActive(false);
    setLiveStatus('idle');
  };

  const startLiveSession = async () => {
    setLiveError(null);
    setLiveStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Input 16kHz for mic capture as required by Live API
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      // Output 24kHz for model output playback
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsLiveActive(true);
        setLiveStatus('listening');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'audio' && msg.audio) {
            setLiveStatus('speaking');
            playAudioChunk24kHz(outputCtx, msg.audio);
          } else if (msg.type === 'interrupted') {
            nextStartTimeRef.current = outputCtx.currentTime;
            setLiveStatus('listening');
          } else if (msg.type === 'ready') {
            setLiveStatus('listening');
          } else if (msg.type === 'error') {
            setLiveError(msg.error || 'Live API error');
            setLiveStatus('error');
          }
        } catch (e) {
          console.error('Error parsing live WS message', e);
        }
      };

      ws.onerror = (e) => {
        setLiveError('WebSocket connection error. Ensure server is active.');
        setLiveStatus('error');
      };

      ws.onclose = () => {
        stopLiveSession();
      };

      // Hook up mic audio processor
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const float32 = e.inputBuffer.getChannelData(0);
          // Convert Float32 to 16-bit PCM little endian
          const pcm16 = new Int16Array(float32.length);
          for (let i = 0; i < float32.length; i++) {
            const s = Math.max(-1, Math.min(1, float32[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          // Convert to base64
          const uint8 = new Uint8Array(pcm16.buffer);
          let binary = '';
          for (let i = 0; i < uint8.byteLength; i++) {
            binary += String.fromCharCode(uint8[i]);
          }
          const base64Audio = btoa(binary);

          ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      setLiveError(err.message || 'Microphone access denied or audio initialization failed.');
      setLiveStatus('error');
      stopLiveSession();
    }
  };

  const playAudioChunk24kHz = (ctx: AudioContext, base64: string) => {
    try {
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const start = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(start);
      nextStartTimeRef.current = start + audioBuffer.duration;

      source.onended = () => {
        if (ctx.currentTime >= nextStartTimeRef.current - 0.05) {
          setLiveStatus('listening');
        }
      };
    } catch (e) {
      console.error('Error playing 24kHz audio chunk', e);
    }
  };

  // Cleanup on unmount or modal close
  useEffect(() => {
    if (!open) {
      stopLiveSession();
    }
  }, [open]);

  // ================= TAB 3: AUDIO TRANSCRIBE (gemini-3.5-transcribe) =================
  const [isRecording, setIsRecording] = useState(false);
  const [transcribeLoading, setTranscribeLoading] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  const startRecording = async () => {
    setTranscribeError(null);
    setTranscriptionText('');
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          if (!base64Data) return;

          setTranscribeLoading(true);
          try {
            const res = await fetch('/api/gemini/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Data,
                mimeType: 'audio/webm',
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || 'Failed to transcribe audio.');
            }
            setTranscriptionText(data.transcription);
          } catch (err: any) {
            setTranscribeError(err.message || 'Transcription error occurred.');
          } finally {
            setTranscribeLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setTranscribeError(err.message || 'Microphone permission denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordTimerRef.current);
    }
  };

  // ================= TAB 4: GOOGLE MAPS GROUNDING (gemini-3.5-flash with googleMaps) =================
  const [mapsPrompt, setMapsPrompt] = useState('Find urgent care clinics and medical facilities near me');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<{ text: string; places: any[] } | null>(null);
  const [mapsError, setMapsError] = useState<string | null>(null);

  const handleFetchMapsGrounding = async (customPrompt?: string) => {
    const promptToUse = customPrompt || mapsPrompt;
    if (!promptToUse.trim()) return;

    setMapsLoading(true);
    setMapsError(null);
    setMapsResult(null);

    // Get geolocation if permitted
    let lat = 34.0522; // default Metroville coordinates
    let lng = -118.2437;
    try {
      if ('geolocation' in navigator) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
    } catch (e) {
      // Use defaults
    }

    try {
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          latitude: lat,
          longitude: lng,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve Google Maps data.');
      }
      setMapsResult({ text: data.text, places: data.places || [] });
    } catch (err: any) {
      setMapsError(err.message || 'Maps grounding error.');
    } finally {
      setMapsLoading(false);
    }
  };

  // ================= TAB 5: GOOGLE SEARCH GROUNDING (gemini-3.5-flash with googleSearch) =================
  const [searchPrompt, setSearchPrompt] = useState('Latest clinical guidelines for blood pressure management and preventative heart screening');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleFetchSearchGrounding = async (customPrompt?: string) => {
    const promptToUse = customPrompt || searchPrompt;
    if (!promptToUse.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToUse }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search web information.');
      }
      setSearchResult({ text: data.text, sources: data.sources || [] });
    } catch (err: any) {
      setSearchError(err.message || 'Search grounding error.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            height: { xs: '92vh', md: '84vh' },
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          pb: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Aegis AI Clinical Suite
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Powered by Gemini 3.5 & 3.8 Multi-Modal Models
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Navigation Tabs */}
      <Box sx={{ px: 2, pt: 1, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 46,
            '& .MuiTab-root': {
              minHeight: 46,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
            },
          }}
        >
          <Tab icon={<SmartToyOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Medical Chatbot" />
          <Tab icon={<GraphicEqIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Live Voice (gemini-3.8-live)" />
          <Tab icon={<MicIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Audio Transcribe" />
          <Tab icon={<MapIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Maps Grounding" />
          <Tab icon={<SearchIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Search Grounding" />
        </Tabs>
      </Box>

      {/* Main Tab Content */}
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* ================= TAB 0: CHATBOT ================= */}
        {tabIndex === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Controls Bar: Model & Role */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 190 }}>
                  <InputLabel id="model-select-label">Gemini Model</InputLabel>
                  <Select
                    labelId="model-select-label"
                    value={chatModel}
                    label="Gemini Model"
                    onChange={(e) => setChatModel(e.target.value as any)}
                  >
                    <MenuItem value="gemini-3.5-flash">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <span>gemini-3.5-flash (General)</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="gemini-3.1-flash-lite">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BoltIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        <span>gemini-3.1-flash-lite (Fast)</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="gemini-3.1-pro-preview">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PsychologyIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                        <span>gemini-3.1-pro-preview (Complex)</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="role-select-label">Chatbot Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={chatRole}
                    label="Chatbot Role"
                    onChange={(e) => setChatRole(e.target.value as any)}
                  >
                    <MenuItem value="navigator">Care Navigator</MenuItem>
                    <MenuItem value="cardio">Cardiology Advisor</MenuItem>
                    <MenuItem value="pediatric">Pediatric Guide</MenuItem>
                    <MenuItem value="general">Medical Triage</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setMessages([messages[0]])}
                sx={{ textTransform: 'none', fontSize: '0.8rem' }}
              >
                Clear History
              </Button>
            </Box>

            {chatError && (
              <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }} onClose={() => setChatError(null)}>
                {chatError}
              </Alert>
            )}

            {/* Scrollable Conversation Thread */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                borderRadius: 2.5,
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(241, 245, 249, 0.5)',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
              }}
            >
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <Box
                    key={m.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '85%',
                        p: 2,
                        borderRadius: 2.5,
                        backgroundColor: isUser
                          ? 'primary.main'
                          : isDark
                          ? '#1F2937'
                          : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : 'text.primary',
                        boxShadow: isUser
                          ? '0 2px 8px rgba(13, 148, 136, 0.25)'
                          : '0 2px 8px rgba(0,0,0,0.06)',
                        border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                        {m.content}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, px: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                        {m.timestamp}
                      </Typography>
                      {m.modelUsed && (
                        <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.7rem', fontWeight: 600 }}>
                          · {m.modelUsed}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {isChatLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
                  <CircularProgress size={18} color="primary" />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Thinking with {chatModel}...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Prompt Pills */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 1.5 }}>
              {[
                'What should I prepare for a cardiac echo?',
                'Difference between 3T MRI and CT scan?',
                'When should I choose Urgent Care over emergency?',
              ].map((pill, i) => (
                <Chip
                  key={i}
                  label={pill}
                  size="small"
                  clickable
                  onClick={() => handleSendChatMessage(pill)}
                  sx={{ fontSize: '0.75rem', borderRadius: 1.5 }}
                />
              ))}
            </Box>

            {/* Message Input Box */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about symptoms, clinical procedures, or doctor recommendations..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                disabled={isChatLoading}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSendChatMessage()}
                disabled={!chatInput.trim() || isChatLoading}
                sx={{ px: 2.5 }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </Box>
        )}

        {/* ================= TAB 1: LIVE VOICE CONVERSATION (gemini-3.8-live) ================= */}
        {tabIndex === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', p: 2 }}>
            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                backgroundColor: isLiveActive
                  ? liveStatus === 'speaking'
                    ? 'secondary.main'
                    : 'primary.main'
                  : isDark
                  ? '#1F2937'
                  : '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isLiveActive ? '#FFFFFF' : 'text.secondary',
                boxShadow: isLiveActive ? '0 0 32px rgba(13, 148, 136, 0.5)' : 'none',
                transition: 'all 0.3s ease',
                mb: 3,
                position: 'relative',
              }}
            >
              <GraphicEqIcon sx={{ fontSize: 54 }} />
              {isLiveActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -8,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: liveStatus === 'speaking' ? 'secondary.main' : 'primary.main',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              )}
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Real-Time Voice Assistant
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 480, mb: 3 }}>
              Have a live spoken conversation with Gemini Live (<code>gemini-3.8-live</code>).
              Speak into your microphone and hear immediate real-time spoken guidance from the clinic voice assistant.
            </Typography>

            {liveError && (
              <Alert severity="error" sx={{ mb: 3, maxWidth: 500, borderRadius: 2 }}>
                {liveError}
              </Alert>
            )}

            {/* Status indicator */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.8,
                borderRadius: 2,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor:
                    liveStatus === 'speaking'
                      ? '#0284C7'
                      : liveStatus === 'listening'
                      ? '#10B981'
                      : liveStatus === 'connecting'
                      ? '#F59E0B'
                      : '#94A3B8',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status:{' '}
                {liveStatus === 'speaking'
                  ? 'Gemini Speaking (24kHz Audio)'
                  : liveStatus === 'listening'
                  ? 'Listening to Microphone (16kHz PCM)...'
                  : liveStatus === 'connecting'
                  ? 'Connecting to Live API...'
                  : 'Ready to Connect'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isLiveActive ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={startLiveSession}
                  disabled={liveStatus === 'connecting'}
                  startIcon={<MicIcon />}
                  sx={{ px: 4, py: 1.4, fontWeight: 700 }}
                >
                  {liveStatus === 'connecting' ? 'Connecting...' : 'Start Live Voice Session'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={stopLiveSession}
                  startIcon={<MicOffIcon />}
                  sx={{ px: 4, py: 1.4, fontWeight: 700 }}
                >
                  End Voice Session
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* ================= TAB 2: AUDIO TRANSCRIBE (gemini-3.5-transcribe) ================= */}
        {tabIndex === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Speech-to-Text Clinical Dictation (<code>gemini-3.5-transcribe</code>)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Record your voice using your microphone. Gemini's specialized transcription model accurately transcribes
              symptoms, medical terms, and clinical notes verbatim.
            </Typography>

            {transcribeError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {transcribeError}
              </Alert>
            )}

            {/* Recording Controls */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(241, 245, 249, 0.7)',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: isRecording ? '#EF4444' : 'primary.main',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MicIcon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {isRecording ? `Recording... (${recordingSeconds}s)` : 'Microphone Ready'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {isRecording ? 'Speak your symptoms clearly...' : 'Click record to begin dictation'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                {!isRecording ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startRecording}
                    disabled={transcribeLoading}
                    startIcon={<MicIcon />}
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={stopRecording}
                    startIcon={<MicOffIcon />}
                  >
                    Stop & Transcribe
                  </Button>
                )}
              </Box>
            </Box>

            {/* Transcription Result Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Transcription Output:
                </Typography>
                {transcriptionText && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                      onClick={() => navigator.clipboard.writeText(transcriptionText)}
                    >
                      Copy
                    </Button>
                    {onInsertTranscriptionToAppointment && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          onInsertTranscriptionToAppointment(transcriptionText);
                          onClose();
                        }}
                      >
                        Insert to Appointment Notes
                      </Button>
                    )}
                  </Box>
                )}
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  flexGrow: 1,
                  p: 2.5,
                  borderRadius: 2.5,
                  backgroundColor: isDark ? '#111827' : '#FFFFFF',
                  overflowY: 'auto',
                  display: 'flex',
                  alignItems: transcribeLoading ? 'center' : 'flex-start',
                  justifyContent: transcribeLoading ? 'center' : 'flex-start',
                }}
              >
                {transcribeLoading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <CircularProgress size={32} color="primary" />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Transcribing audio with gemini-3.5-transcribe...
                    </Typography>
                  </Box>
                ) : transcriptionText ? (
                  <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {transcriptionText}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    Your transcribed text will appear here once you stop recording.
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        )}

        {/* ================= TAB 3: GOOGLE MAPS GROUNDING (gemini-3.5-flash with googleMaps) ================= */}
        {tabIndex === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Google Maps Grounding (<code>gemini-3.5-flash</code> with <code>googleMaps</code>)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Retrieve real, up-to-date physical medical centers, specialized hospitals, and pharmacies with direct Google Maps links.
            </Typography>

            {/* Quick Prompts */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2 }}>
              {[
                'Find 24/7 emergency walk-in clinics near me',
                'Locate diagnostic imaging centers with MRI near me',
                'Find pediatric medical offices near me',
              ].map((p, idx) => (
                <Chip
                  key={idx}
                  label={p}
                  size="small"
                  clickable
                  onClick={() => {
                    setMapsPrompt(p);
                    handleFetchMapsGrounding(p);
                  }}
                  sx={{ borderRadius: 1.5, fontSize: '0.78rem' }}
                />
              ))}
            </Box>

            {/* Input Bar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about nearby medical facilities, pharmacies, or testing centers..."
                value={mapsPrompt}
                onChange={(e) => setMapsPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFetchMapsGrounding();
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFetchMapsGrounding()}
                disabled={mapsLoading || !mapsPrompt.trim()}
                startIcon={mapsLoading ? <CircularProgress size={16} color="inherit" /> : <MapIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Search Maps
              </Button>
            </Box>

            {mapsError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {mapsError}
              </Alert>
            )}

            {/* Results Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {mapsLoading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
                  <CircularProgress size={32} color="primary" />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Querying Google Maps Grounding with gemini-3.5-flash...
                  </Typography>
                </Box>
              )}

              {mapsResult && (
                <Stack spacing={2.5}>
                  {/* Grounded Summary Text */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {mapsResult.text}
                    </Typography>
                  </Paper>

                  {/* Extracted Google Maps Links */}
                  {mapsResult.places.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapIcon color="primary" sx={{ fontSize: 18 }} />
                        Verified Google Maps Locations ({mapsResult.places.length}):
                      </Typography>
                      <Stack spacing={1.5}>
                        {mapsResult.places.map((place, idx) => (
                          <Paper
                            key={idx}
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(241, 245, 249, 0.6)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {place.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Verified via Google Maps Grounding
                              </Typography>
                            </Box>
                            {place.uri && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                onClick={() => window.open(place.uri, '_blank')}
                                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                              >
                                View on Maps
                              </Button>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        )}

        {/* ================= TAB 4: GOOGLE SEARCH GROUNDING (gemini-3.5-flash with googleSearch) ================= */}
        {tabIndex === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              Google Search Grounding (<code>gemini-3.5-flash</code> with <code>googleSearch</code>)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Get verified, up-to-date medical research, health guidelines, and clinical announcements grounded with live Google Search.
            </Typography>

            {/* Quick Search Prompts */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2 }}>
              {[
                'Latest AHA guidelines for hypertension stages',
                'Recent developments in preventative cardiology',
                'Recommended childhood vaccine schedules 2026',
              ].map((p, idx) => (
                <Chip
                  key={idx}
                  label={p}
                  size="small"
                  clickable
                  onClick={() => {
                    setSearchPrompt(p);
                    handleFetchSearchGrounding(p);
                  }}
                  sx={{ borderRadius: 1.5, fontSize: '0.78rem' }}
                />
              ))}
            </Box>

            {/* Input Bar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask any medical research question..."
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFetchSearchGrounding();
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleFetchSearchGrounding()}
                disabled={searchLoading || !searchPrompt.trim()}
                startIcon={searchLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Search Web
              </Button>
            </Box>

            {searchError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {searchError}
              </Alert>
            )}

            {/* Results Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {searchLoading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
                  <CircularProgress size={32} color="primary" />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Searching live web sources with gemini-3.5-flash...
                  </Typography>
                </Box>
              )}

              {searchResult && (
                <Stack spacing={2.5}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {searchResult.text}
                    </Typography>
                  </Paper>

                  {/* Web Citations */}
                  {searchResult.sources.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SearchIcon color="primary" sx={{ fontSize: 18 }} />
                        Grounded Web Sources ({searchResult.sources.length}):
                      </Typography>
                      <Grid container spacing={1.5}>
                        {searchResult.sources.map((src, idx) => (
                          <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.75,
                                borderRadius: 2,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(241, 245, 249, 0.6)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {src.title}
                              </Typography>
                              {src.uri && (
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(src.uri, '_blank')}
                                  sx={{ color: 'primary.main' }}
                                  aria-label="Open citation link"
                                >
                                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
