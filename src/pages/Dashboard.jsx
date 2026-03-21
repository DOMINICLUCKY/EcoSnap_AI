import React, { useState, useEffect, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Send, Zap, Camera } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function Dashboard() {
  const webcamRef = useRef(null)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I\'m your AI Upcycle Assistant. Scan an item or ask me about creative reuse options!' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [recentScans, setRecentScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Fetch real scans from MongoDB backend
  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/scans')
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setRecentScans(data)
        } else if (data.success && Array.isArray(data.data)) {
          setRecentScans(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch scans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchScans()
  }, [])

  // Handle webcam capture and Gemini integration
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return
    
    setIsScanning(true)
    
    try {
      // 1. Capture image from webcam
      const imageSrc = webcamRef.current.getScreenshot()
      
      if (!imageSrc) {
        throw new Error('Failed to capture image from webcam')
      }

      // 2. Show user message instantly
      const userMessage = {
        id: chatMessages.length + 1,
        type: 'user',
        text: '📷 I just scanned an item. What are some creative upcycling ideas?'
      }
      setChatMessages(prev => [...prev, userMessage])
      setIsTyping(true)

      // 3. API Key Check
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is missing. Restart your Vite server!')
      }

      // 4. Dynamic MIME Type Extraction (The Fix!)
      const mimeType = imageSrc.substring(imageSrc.indexOf(":") + 1, imageSrc.indexOf(";"))
      const base64Image = imageSrc.split(',')[1]

      // 5. Call Gemini API
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image
          }
        },
        'I just scanned this item. First, identify what it is. Then, give me one highly unique, creative way to upcycle or reuse it in exactly 2 sentences. Be specific and imaginative.'
      ])

      const aiResponse = result.response.text()

      // 6. Add AI response to chat
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: aiResponse
        }
      ])

      // 7. Post record to backend (Isolated so it doesn't crash the AI if DB fails)
      try {
        await fetch('http://localhost:5000/api/scans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemType: 'Scanned Item',
            confidence: Math.floor(Math.random() * 20 + 80),
            location: 'Local User',
            username: 'EcoWarrior_07',
            carbonSaved: Math.random() * 2 + 0.5
          })
        })

        // Refresh scans list
        const scansResponse = await fetch('http://localhost:5000/api/scans')
        const scansData = await scansResponse.json()
        if (scansData && Array.isArray(scansData)) {
            setRecentScans(scansData)
        } else if (scansData.success && Array.isArray(scansData.data)) {
            setRecentScans(scansData.data)
        }
      } catch (dbError) {
        console.warn("Backend save failed, but AI is fine.", dbError)
      }

    } catch (error) {
      console.error('🔍 EXACT ERROR:', error)
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: `Error: ${error.message}`
        }
      ])
    } finally {
      setIsScanning(false)
      setIsTyping(false)
    }
  }, [chatMessages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newUserMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      text: inputValue
    }
    setChatMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      
      const result = await model.generateContent(
        `You are EcoSnap AI, an expert in sustainability. The user says: "${inputValue}". Give a helpful, creative 2-sentence response about recycling or upcycling.`
      )
      
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          text: result.response.text()
        }
      ])
    } catch (error) {
       setChatMessages(prev => [
        ...prev,
        { id: prev.length + 1, type: 'bot', text: 'I am having trouble connecting to my AI brain right now!' }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
      {/* Top Row - Three KPI Cards */}
      <div className="col-span-12 md:col-span-4 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">Items Detected</p>
            <h2 className="text-4xl font-bold text-white">2,847</h2>
            <p className="text-emerald-400 text-xs mt-2 font-medium">↑ 12% this month</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">Carbon Saved (CO₂)</p>
            <h2 className="text-4xl font-bold text-white">84 kg</h2>
            <p className="text-emerald-400 text-xs mt-2 font-medium">↑ 8.4% reduction</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
            <span className="text-xl">🌱</span>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">Community Rank</p>
            <h2 className="text-4xl font-bold text-white">#12</h2>
            <p className="text-blue-400 text-xs mt-2 font-medium">↑ 3 positions</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <span className="text-xl">🏆</span>
          </div>
        </div>
      </div>

      {/* Middle Left - Live Scanner */}
      <div className="col-span-12 lg:col-span-8 card bg-[#0d1410] border-emerald-500/20 flex flex-col h-[500px]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <Camera className="w-5 h-5 text-emerald-400" /> Live Scanner
        </h3>
        <div className="flex-1 bg-black rounded-lg overflow-hidden border border-emerald-500/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: 'environment' }}
          />
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-sm">
               <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <button
          onClick={handleCapture}
          disabled={isScanning || isTyping}
          className="btn-primary mt-4 w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Camera className="w-5 h-5" />
          {isScanning ? 'Analyzing Object...' : 'Scan Object'}
        </button>
      </div>

      {/* Middle Right - AI Chatbot */}
      <div className="col-span-12 lg:col-span-4 card bg-[#0d1410] border-emerald-500/20 h-[500px] flex flex-col">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <Zap className="w-5 h-5 text-emerald-400" /> AI Upcycle Assistant
        </h3>
        
        {/* Chat History */}
        <div className="flex-1 bg-[#050a07] rounded-lg p-4 overflow-y-auto mb-4 space-y-4 border border-slate-800">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-md ${
                  msg.type === 'user'
                    ? 'bg-slate-800 text-slate-200 rounded-br-sm border border-slate-700'
                    : 'bg-[#0a1a12] text-emerald-300 rounded-bl-sm border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#0a1a12] border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about upcycling..."
            className="flex-1 bg-[#050a07] border border-slate-700 rounded-lg px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={isTyping}
            className="btn-primary p-3 flex items-center justify-center rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Row - Recent Scans Monitor */}
      <div className="col-span-12 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <h3 className="text-lg font-bold text-white mb-6">Recent Scans Monitor</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 font-semibold py-3 px-3">ID</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Item Type</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Confidence</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Location</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">Loading real-time database...</td>
                </tr>
              ) : recentScans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">No scans detected in the database yet. Be the first!</td>
                </tr>
              ) : (
                recentScans.slice(0, 5).map((scan) => (
                  <tr key={scan._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="text-slate-500 py-4 px-3 font-mono text-xs">#{scan._id?.slice(-4) || '0000'}</td>
                    <td className="text-slate-200 py-4 px-3 font-medium">{scan.itemType}</td>
                    <td className="py-4 px-3">
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                        {scan.confidence}%
                      </span>
                    </td>
                    <td className="text-slate-400 py-4 px-3">{scan.location}</td>
                    <td className="py-4 px-3">
                      <button className="btn-primary text-xs px-3 py-1.5 opacity-80 hover:opacity-100">Upcycle</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}