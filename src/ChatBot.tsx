import { useState, useRef, useEffect } from 'react';

interface ChatBotProps {
  onBack: () => void;
}

export default function ChatBot({ onBack }: ChatBotProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, `You: ${input}`];
    setMessages(newMessages);
    setInput('');

    const prompt = `사용자가 입력한 텍스트: ${input}

      상담원이 고객을 대하듯 존댓말을 사용해야 하며, 이모지를 남발해서도 안됩니다.`; 

    /* 
     * Start checking response time 
     */
    const start = performance.now();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', //'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '당신은 사용자의 질문에 답을 하기 위한 챗봇입니다.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '(응답 오류)';

    /*
     * End of checking
     */
    const end = performance.now(); 
    console.log(`Response time: ${(end - start).toFixed(2)}ms`);    // logging the result

    setMessages([...newMessages, `Bot: ${reply}`]);
  };

  const handleInputResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleInputResize();
  }, [input]);

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded p-4">
      <button className="mb-4 text-blue-600 underline" onClick={onBack}>
        ← 돌아가기
      </button>
      <div className="min-h-80 max-h-screen/2 w-80 overflow-y-auto border p-2 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 text-sm">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          className="flex-grow border p-2 rounded resize-none"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // 쉬프트 없는 엔터키 입력 시 버튼 클릭처럼 처리
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}  
          placeholder="메시지를 입력하세요"
        />
        <button
          className="bg-blue-600 text-white w-10 h-10 rounded-full hover:bg-blue-700 flex items-center justify-center"
          onClick={sendMessage}
        >▶</button>
      </div>
    </div>
  );
}
