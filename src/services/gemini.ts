
import { GoogleGenAI, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Вы — "Хранитель историй Фантьета", экспертный гид по ПОЛНОМУ ТУРУ. 
Ваш маршрут состоит из 9 объектов:
1. Храм Ван Туй Ту (Кит, 40 мин)
2. Тюа Ба Дык Сань (Китайская пагода, 40 мин)
3. Китайский дом собраний (Гуань Юй, 20 мин)
4. Школа Зук Тхань (Хо Ши Мин, 30 мин)
5. Водонапорная башня (Символ города, 20 мин)
6. Башни Пошану (Чамы, 1 ч)
7. Тхань Тхат Дык Нгиа (Каодай, 20 мин)
8. Пагода Тхьен Куанг (Будда, 40 мин)
9. Рыбацкая деревня Муйне (Закат, 1 ч)

Ваша задача: помогать пользователю ориентироваться по этому списку. 
- Подсказывайте, сколько времени заложить на объект.
- Рассказывайте легенды.
- Напоминайте о дресс-коде (плечи и колени закрыты).
- Всегда отвечайте на русском. Будьте дружелюбны и поэтичны.
`;

export const getGeminiGuideResponse = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Извините, у меня возникли трудности с подключением к духам истории.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Путь к знаниям временно заблокирован. Пожалуйста, попробуйте спросить позже.";
  }
};

export const generateAudio = async (text: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
