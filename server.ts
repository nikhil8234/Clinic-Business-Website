import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support JSON bodies up to 25MB for audio payloads
app.use(express.json({ limit: '25mb' }));

// Shared server-side Gemini client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for handling API errors
function handleApiError(res: Response, error: any) {
  console.error('Gemini API Error:', error);
  const status = error?.status || 500;
  const message = error?.message || 'An unexpected error occurred while communicating with Gemini API';
  res.status(status).json({
    error: message,
    code: error?.code || 'GEMINI_ERROR',
  });
}

// 1. Multi-turn Chat Endpoint (gemini-3.5-flash, gemini-3.1-flash-lite, gemini-3.1-pro-preview)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { model = 'gemini-3.5-flash', messages, systemInstruction } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Convert client messages to Gemini content format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: systemInstruction || 'You are an intelligent clinical care coordinator and health assistant for Aegis Multi-Specialty Clinic. Provide helpful, accurate, empathetic medical guidance and suggest booking appropriate specialist consultations when symptoms warrant clinical evaluation.',
        temperature: 0.7,
      },
    });

    const reply = response.text || '';
    res.json({ reply, model });
  } catch (error) {
    handleApiError(res, error);
  }
});

// 2. Google Maps Grounding Endpoint (gemini-3.5-flash with googleMaps)
app.post('/api/gemini/maps-grounding', async (req: Request, res: Response) => {
  try {
    const { prompt, latitude, longitude } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // Config with retrievalConfig when coordinates provided
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latitude && longitude) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];

    // Extract place links and information
    const places = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title || 'Location',
        uri: chunk.maps.uri || '',
        placeAnswerSources: chunk.maps.placeAnswerSources || null,
      }));

    res.json({
      text,
      places,
      groundingChunks,
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

// 3. Google Search Grounding Endpoint (gemini-3.5-flash with googleSearch)
app.post('/api/gemini/search-grounding', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];

    // Extract web citations
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Web Reference',
        uri: chunk.web.uri || '',
      }));

    res.json({
      text,
      sources,
      groundingChunks,
    });
  } catch (error) {
    handleApiError(res, error);
  }
});

// 4. Audio Transcription Endpoint (gemini-3.5-transcribe)
app.post('/api/gemini/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 string is required.' });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken audio verbatim. Accurately capture medical terms and symptoms.' },
        ],
      },
    });

    const transcription = response.text || '';
    res.json({ transcription });
  } catch (error) {
    handleApiError(res, error);
  }
});

// Create HTTP server
const server = http.createServer(app);

// 5. WebSocket Server for Live Voice Conversations (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to Live Voice API WebSocket');

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction: 'You are the Aegis Clinic Live Voice Health Assistant. Speak concisely, clearly, warmly, and helpfully with patients. Listen carefully to their symptoms and explain clinic procedures or recommend the right medical specialty in spoken audio.',
      },
      callbacks: {
        onmessage: (message: any) => {
          // Model returned audio
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Live session error' }));
          }
        },
        onclose: () => {
          console.log('Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'close' }));
          }
        },
      },
    });

    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: 'ready' }));
    }
  } catch (err: any) {
    console.error('Failed to initialize Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: 'error', error: err?.message || 'Failed to start Live session' }));
      clientWs.close();
    }
    return;
  }

  // Handle incoming messages from client
  clientWs.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'audio' && parsed.audio && session) {
        // Send audio PCM chunks to Live session
        session.sendRealtimeInput({
          audio: {
            data: parsed.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (parsed.type === 'text' && parsed.text && session) {
        session.sendRealtimeInput({
          text: parsed.text,
        });
      }
    } catch (e) {
      console.error('Error handling WebSocket client message:', e);
    }
  });

  clientWs.on('close', () => {
    console.log('Client disconnected from Live Voice API');
    if (session) {
      try {
        session.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  });
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Clinic server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
