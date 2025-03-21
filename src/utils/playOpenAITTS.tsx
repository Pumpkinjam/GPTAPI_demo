// OpenAI TTS 호출 함수

export async function playOpenAITTS(text: string) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'echo',  // 'nova', 'shimmer', 'echo', 'alloy', 'fable', 'onyx'
        input: text
      })
    });
  
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  }
  