import { useState } from 'react'
import InvitationGenerator from "./InvitationGenerator";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div>
        <InvitationGenerator />
      </div>
    </>
  )
}

export default App
