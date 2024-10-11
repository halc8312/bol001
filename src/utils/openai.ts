import axios from 'axios';

// APIキーのエンコーディング関数を削除
// function encodeApiKey(apiKey: string): string {
//   return encodeURIComponent(apiKey).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
// }

export async function transcribeAudio(apiKey: string, audioFile: File): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';

  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'whisper-1');
  formData.append('language', 'ja');

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${apiKey}`, // エンコーディングを削除
      },
    });

    return response.data.text;
  } catch (error: any) {
    console.error('Transcription error:', error.response?.data || error.message);
    throw new Error('音声の文字起こし中にエラーが発生しました。');
  }
}

export async function generateSummary(apiKey: string, transcript: string, summaryLevel: string): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const prompt = `以下の議事録を${summaryLevel === 'detailed' ? '詳細に' : '簡潔に'}要約してください。\n\n${transcript}`;

  const data = {
    model: 'gpt-4o-mini', // 指定されたモデルに変更
    messages: [
      { role: 'system', content: '議事録を要約するアシスタントです。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: summaryLevel === 'detailed' ? 500 : 150,
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // エンコーディングを削除
      },
    });

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error('Summary generation error:', error.response?.data || error.message);
    throw new Error('要約の生成中にエラーが発生しました。');
  }
}