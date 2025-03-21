import { useState } from "react";
import { playOpenAITTS } from './utils/playOpenAITTS';
import { playGoogleTTS } from "./utils/playGoogleTTS";

export default function InvitationGenerator() {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("");
  const [others, setOthers] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [invitation, setInvitation] = useState<string[]>([]);


  const handleSubmit = async () => {
    if (!date || !location || !theme) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
  
    const prompt = `사용자가 입력한 정보:
      - 행사 일시: ${date}
      - 행사 장소: ${location}
      - 행사 주제: ${theme}
      - 기타 특이사항: ${others}
  
      위 정보를 반영하여 초대장 문구를 작성해 주세요. 단, 볼드체 텍스트는 사용하지 마십시오. 응답에 '**'와 같은 RAW TEXT가 포함되어선 안됩니다.`; 
      // cannot directly apply GPT's bold letter to page


    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // load API KEY from env
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "당신은 초대장 작성 전문가입니다." },
            { role: "user", content: prompt },
          ],
          max_tokens: 1000,
          temperature: temperature/10,
          n: 3
        }),
      });

      const data = await response.json();
  
      // check data has choices
      if (data.choices && data.choices.length > 0) {
          const responses = data.choices.map((choice: any) => choice.message?.content);
          setInvitation(responses); 
        } else {
          setInvitation(["초대장 생성에 실패했습니다."]);
        }
    } catch (error) {
      console.error("an error occured while calling API:", error);
      setInvitation(["an error occured while calling API."]);
    }
  };
  

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Invitation Generator Demo</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-medium">행사 일시</label>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded mb-4" />

        <label className="block mb-2 font-medium">행사 장소</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} 
          placeholder="예: 세종문화회관" className="w-full p-2 border rounded mb-4" />

        <label className="block mb-2 font-medium">행사 주제</label>
        <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} 
          placeholder="예: '시간의 결, 색으로 그리다'" className="w-full p-2 border rounded mb-4" />

        <label className="block mb-2 font-medium">기타 특이사항</label>
        <textarea value={others} onChange={(e) => setOthers(e.target.value)} 
          placeholder="예: 3.1절 100주년 기념, 관객 참여형 예술, 전 연령 관람 가능, 문의전화 02-234-5678" className="w-full h-32 p-2 border rounded mb-6" />

        <label className="block mb-2 font-medium">GPT 창의성</label>
        <input type="range" min="5" max="14" step="1" value={temperature} 
          onChange={(e) => setTemperature(parseInt(e.target.value))} className="w-full cursor-pointer accent-blue-500"/>

        <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">초대장 생성</button>
      </div>

      <div>
        {invitation.length > 0 && (
          <div>
            {invitation.map((response: string, index: number) => (
              <div key={index} 
              className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-md cursor-pointer transition duration-100 
             hover:shadow-lg hover:bg-gray-100"
              onClick={() => playGoogleTTS(response)}>
                <h2 className="text-lg font-semibold mb-2">초안 {index + 1}</h2>
                <p className="text-gray-700 whitespace-pre-line">{response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
