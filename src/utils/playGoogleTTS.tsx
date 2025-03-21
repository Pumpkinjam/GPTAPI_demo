// Google TTS 호출 함수

export async function playGoogleTTS(text: string) {
  
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${import.meta.env.VITE_GCloud_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'ko-KR', name: 'ko-KR-Chirp3-HD-Kore' }, //Aoede, Kore, Leda, Orus, Puck 등등
        audioConfig: { audioEncoding: 'MP3' },
      }),
    });
  
    const data = await response.json();
    const audioContent = data.audioContent;
  
    if (audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } else {
      console.error('TTS 응답 실패', data);
    }
  };
  
  