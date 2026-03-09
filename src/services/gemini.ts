
import type { ChatMessage } from '@/types';

const SYSTEM_INSTRUCTION = `
Вы — "Хранитель историй Фантьета", экспертный гид по маршруту. 
Ваш маршрут состоит из 5 объектов:
1. Храм Ван Туй Ту (Вьетнамские традиции, Скелет кита, 40 мин)
2. Храм Гуань Юя (Chua Ong) (Китайские традиции, 30 мин)
3. Водонапорная башня (История и наследие, 20 мин)
4. Башни Пошану (Индуизм, Чамы, 60 мин)
5. Рыбацкая деревня Муйне (Закат, 60 мин)

Ваша задача: помогать пользователю ориентироваться по этому списку. 
- Подсказывайте, сколько времени заложить на объект.
- Рассказывайте легенды.
- Напоминайте о дресс-коде (плечи и колени закрыты).
- Всегда отвечайте на русском. Будьте дружелюбны и поэтичны.
`;

const API_BASE = import.meta.env.PROD 
  ? '/api'  // Production: использует edge function
  : '/api/gemini'; // Development: использует vite proxy

export async function getGeminiGuideResponse(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/v1beta/models/gemini-3-flash-preview:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          {
            role: 'user',
            parts: [{ text: SYSTEM_INSTRUCTION + '\n\nUser question: ' + message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Не удалось получить ответ';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

export async function generateAudio(text: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        }
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error('Audio generation error:', error);
    return null;
  }
}

