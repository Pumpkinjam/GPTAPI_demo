import { useState } from 'react'
import InvitationGenerator from "./InvitationGenerator";
import ChatBot from './ChatBot';
import './App.css'

function App() {
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="min-h-screen bg-gray-100 p-4">
        {!showChatbot ? (
          <>
          <button
            className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowChatbot(true)}
          > 챗봇 소환하기 </button>
            <InvitationGenerator />
          </>
        ) : (
          <ChatBot onBack={() => setShowChatbot(false)} />
        )}
      </div>
    </>
  )
}

export default App
