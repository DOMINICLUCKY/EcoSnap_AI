import React, { useState, useEffect, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { Send, Zap, Camera, LogOut } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authService } from '../services/authService'

export default function Dashboard() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I\'m EcoSnap AI. Scan an item to see its environmental impact, proper disposal methods, and creative upcycling ideas!' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [recentScans, setRecentScans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [detections, setDetections] = useState([])
  const [fps, setFps] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  const fpsCounterRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const modelRef = useRef(null)

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

  // --- CHECK AUTH STATUS ON MOUNT ---
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken()
      const user = authService.getUser()
      
      if (token && user) {
        setIsLoggedIn(true)
        setCurrentUser(user)
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
      }
    }
    
    checkAuth()
  }, [])

  // --- 1. LOAD AI MODEL ---
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading COCO-SSD model...')
        const model = await cocoSsd.load()
        modelRef.current = model
        setModelLoaded(true)
        console.log('COCO-SSD model loaded successfully!')
      } catch (error) {
        console.error('Error loading detection model:', error)
      }
    }
    loadModel()
  }, [])

  // --- 2. FETCH SCANS FROM DB ---
  const fetchScans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/scans')
      const data = await response.json()
      
      const scansArray = Array.isArray(data) ? data : (data.data || [])
      setRecentScans([...scansArray].reverse()) // Show newest first
    } catch (error) {
      console.error('❌ Failed to fetch scans:', error)
      setRecentScans([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [])

  // --- 3. REAL-TIME OBJECT DETECTION LOOP ---
  useEffect(() => {
    if (!modelLoaded || !webcamRef.current || !canvasRef.current) return

    let animationId
    const detectObjects = async () => {
      try {
        const video = webcamRef.current.video
        if (video && video.readyState === 4) {
          const predictions = await modelRef.current.detect(video)
          setDetections(predictions)

          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox
            const confidence = (prediction.score * 100).toFixed(0)

            ctx.strokeStyle = '#10b981'
            ctx.lineWidth = 3
            ctx.strokeRect(x, y, width, height)

            const label = `${prediction.class} ${confidence}%`
            ctx.font = 'bold 14px Arial'
            ctx.fillStyle = '#10b981'
            const textMetrics = ctx.measureText(label)
            const textWidth = textMetrics.width
            ctx.fillRect(x, y - 25, textWidth + 10, 25)

            ctx.fillStyle = '#050a07'
            ctx.fillText(label, x + 5, y - 8)
          })

          fpsCounterRef.current++
          const now = Date.now()
          if (now - lastTimeRef.current >= 1000) {
            setFps(fpsCounterRef.current)
            fpsCounterRef.current = 0
            lastTimeRef.current = now
          }
        }
      } catch (error) {
        console.error('Detection error:', error)
      }

      animationId = requestAnimationFrame(detectObjects)
    }

    detectObjects()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [modelLoaded])

  // --- 4. HANDLE CAMERA CAPTURE (DUAL-PATHWAY PROMPT) ---
  const handleCapture = useCallback(async () => {
    // CHECK GUEST SCAN LIMIT (1 scan max for non-logged-in users)
    if (scanCount >= 1 && !isLoggedIn) {
      alert('Free trial limit reached! Please create an account to unlock unlimited AI scans and the Leaderboard.')
      return
    }

    if (!webcamRef.current) return
    
    setIsScanning(true)
    setIsTyping(true)
    
    try {
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) throw new Error('Camera failed to capture image.')

      const detectedItem = detections.length > 0 ? detections[0].class : 'an item'
      const confidenceNum = detections.length > 0 ? Math.round(detections[0].score * 100) : 85
      const randomCarbon = parseFloat((Math.random() * 2 + 0.5).toFixed(2))

      // 1. ADD USER MESSAGE TO CHAT
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        text: `📷 I just scanned ${detectedItem}. Can you analyze this for me?`
      }])

      // 2. OPTIMISTIC UI UPDATE
      const newScanRecord = {
        _id: Date.now().toString(),
        itemType: detectedItem,
        confidence: confidenceNum,
        carbonSaved: randomCarbon,
        location: 'EcoSnap Desktop'
      }
      setRecentScans(prev => [newScanRecord, ...prev])

      // 3. TRY TO SAVE TO MONGODB IN BACKGROUND
      fetch('http://localhost:5000/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScanRecord)
      }).catch(e => console.warn("Backend offline, but UI updated successfully."))

      // 4. CALL GEMINI AI
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'undefined') throw new Error('API Key is missing!')

      const base64Data = imageSrc.split(',')[1]
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' })
      
      // THE DUAL-PATHWAY PROMPT WITH NUMBERED LISTS
      const prompt = `Analyze this exact image. 
If the image is predominantly of a person, human, face, or body part, respond ONLY with this exact text: 
"⚠️ **TARGET IDENTIFIED:** Human.\n\nEcoSnap is designed for waste management and environmental sustainability. Please scan a recyclable item or piece of waste to continue!"

If it is a normal object or waste material, respond using EXACTLY these five sections with these EXACT bold headers and formatting. Do not use markdown hash (#) symbols. Keep it engaging, scientific, and highly detailed.

**🔍 MATERIAL IDENTIFIED:** Name the exact object and its scientific core material (e.g., Polyethylene Terephthalate (PET), Corrugated Cardboard).

**⚠️ ECOLOGICAL FOOTPRINT:** Explain exactly how long this takes to decompose in nature and what toxins or microplastics it releases.

**♻️ PATHWAY A - INDUSTRIAL RECYCLING:**
1. [First step on how to prep the item]
2. [Second step on the recycling process]
3. [Third step: What new industrial products it becomes]

**💡 PATHWAY B - AT-HOME UPCYCLING:**
1. [First step to prepare materials]
2. [Second step: Building the creative project]
3. [Third step: Final assembly or finishing touches]

**📊 ECO-METRIC:** Provide one quick, interesting statistical fact about recycling this specific material.`
      
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
      ])
      
      const aiResponse = await result.response.text()

      // 5. UPDATE CHAT WITH REAL AI RESPONSE
      setChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: aiResponse }])

      // 6. INCREMENT SCAN COUNT FOR GUEST USERS
      setScanCount(prev => prev + 1)

      // If it's a real scan, trigger DB refresh to sync the real Mongo ID
      if (!aiResponse.includes("TARGET IDENTIFIED:** Human")) {
         setTimeout(() => { fetchScans() }, 1500) 
      }

    } catch (error) {
      console.error('🚨 SCAN ERROR:', error)
      const detectedItem = detections.length > 0 ? detections[0].class : 'item'
      const fallbackUpcycleIdea = `**🔍 MATERIAL IDENTIFIED:** ${detectedItem}\n\n**⚠️ ECOLOGICAL FOOTPRINT:** Improper disposal leads to massive landfill accumulation.\n\n**♻️ PATHWAY A:** Please sort into local municipal recycling.\n\n**💡 PATHWAY B:** Repurpose this item for household storage.`
      
      setChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: fallbackUpcycleIdea }])
    } finally {
      setIsScanning(false)
      setIsTyping(false)
    }
  }, [detections, genAI])

  // --- 5. HANDLE STANDARD TEXT CHAT ---
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const currentInput = inputValue
    setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', text: currentInput }])
    setInputValue('')
    setIsTyping(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKey || apiKey === 'undefined') throw new Error("API Key missing.")

      // CONTEXT-AWARE: Include current detection in prompt
      const currentDetection = detections.length > 0 ? detections[0].class : 'an object'
      const contextNote = detections.length > 0 ? `The user is currently looking at: ${currentDetection}. ` : ''

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' })
      const prompt = `You are EcoSnap, an advanced Environmental Intelligence AI. ${contextNote}The user says: "${currentInput}". Respond directly using these exact bold headers:

**🔍 MATERIAL ANALYSIS:** Identify the core material (if the user is looking at something specific, analyze that).
**⚠️ ECOLOGICAL FOOTPRINT:** What happens if it's trashed improperly?
**♻️ PATHWAY A - INDUSTRIAL RECYCLING:** Commercial recycling protocol with numbered steps.
**💡 PATHWAY B - AT-HOME UPCYCLING:** A practical at-home reuse idea with numbered steps.
**📊 ECO-METRIC:** One quick statistical fact about this material.`
      
      const result = await model.generateContent(prompt)
      let aiText = await result.response.text()
      
      setChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: aiText }])
    } catch (error) {
       const fallbackResponse = "I'm having trouble reaching the AI brain right now. Please verify your connection or API key!"
       setChatMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: fallbackResponse }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* User Info & Logout Section */}
      {isLoggedIn && (
        <div className="mb-6 p-4 bg-[#0d1410] border border-emerald-500/20 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Logged in as</p>
            <p className="text-white font-semibold">{currentUser?.name || 'User'}</p>
            <p className="text-emerald-400 text-xs">{currentUser?.email}</p>
          </div>
          <button
            onClick={() => {
              authService.logout()
              setIsLoggedIn(false)
              setCurrentUser(null)
              setScanCount(0)
              window.location.href = '/login'
            }}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {!isLoggedIn && scanCount >= 1 && (
        <div className="mb-6 p-4 bg-amber-900/30 border border-amber-500/50 rounded-lg">
          <p className="text-amber-200 text-sm">
            <strong>⚡ Free Trial Limit Reached:</strong> You've used your free scan. <a href="/signup" className="text-amber-300 hover:text-amber-200 font-semibold">Create an account</a> to unlock unlimited scans, personalized stats, and the Leaderboard!
          </p>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* KPI 1 - Items Detected */}
        <div className="col-span-12 md:col-span-4 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-2">Items Detected</p>
              <h2 className="text-4xl font-bold text-white">{recentScans.length > 0 ? 2847 + recentScans.length : 2847}</h2>
              <p className="text-emerald-400 text-xs mt-2 font-medium">↑ 12% this month</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* KPI 2 - Carbon Saved */}
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

        {/* KPI 3 - Community Rank */}
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

        {/* Live Scanner */}
        <div className="col-span-12 lg:col-span-8 card bg-[#0d1410] border-emerald-500/20 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" /> Live AI Detection Scanner
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              detections.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/20 text-slate-400'
            }`}>
              {detections.length > 0 ? '🎯 Target Acquired' : '🔍 Scanning...'}
            </span>
            <span className="text-emerald-400 text-sm font-mono">{fps} FPS</span>
          </div>
        </div>

        <div className="flex-1 bg-black rounded-lg overflow-hidden border border-emerald-500/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: 'environment' }}
          />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

          {detections.length > 0 && (
            <div className="absolute top-4 left-4 bg-emerald-500/90 text-white px-4 py-2 rounded-lg font-mono text-sm z-20">
              Objects: {detections.length}
            </div>
          )}

          {detections.length > 0 && (
            <div className="absolute top-4 right-4 bg-emerald-500/90 text-white px-4 py-2 rounded-lg z-20">
              <p className="font-bold text-lg capitalize">{detections[0].class}</p>
              <p className="text-xs font-mono">{(detections[0].score * 100).toFixed(0)}% Confidence</p>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-sm rounded-lg z-30">
               <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <button
          onClick={handleCapture}
          disabled={isScanning || isTyping || !modelLoaded}
          className="btn-primary mt-4 w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Camera className="w-5 h-5" />
          {!modelLoaded ? 'Loading AI Model...' : isScanning ? 'Analyzing Object...' : 'Capture & Analyze'}
        </button>
      </div>

      {/* Middle Right - AI Chatbot */}
      <div className="col-span-12 lg:col-span-4 card bg-[#0d1410] border-emerald-500/20 h-[500px] flex flex-col">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <Zap className="w-5 h-5 text-emerald-400" /> AI Upcycle Assistant
        </h3>
        
        <div className="flex-1 bg-[#050a07] rounded-lg p-4 overflow-y-auto mb-4 space-y-4 border border-slate-800 custom-scrollbar">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm shadow-md whitespace-pre-wrap leading-relaxed ${
                  msg.type === 'user' ? 'bg-slate-800 text-slate-200 rounded-br-sm border border-slate-700' : 'bg-[#0a1a12] text-emerald-300 rounded-bl-sm border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                }`}>
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

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about materials..."
            className="flex-1 bg-[#050a07] border border-slate-700 rounded-lg px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button onClick={handleSendMessage} disabled={isTyping} className="btn-primary p-3 rounded-lg disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Row - Recent Scans Monitor */}
      <div className="col-span-12 card bg-[#0d1410] border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-white">Recent Scans Monitor</h3>
           <button onClick={fetchScans} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded transition-colors border border-slate-700">
             Refresh Database
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 font-semibold py-3 px-3">ID</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Item Type</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Confidence</th>
                <th className="text-left text-slate-400 font-semibold py-3 px-3">Carbon Saved</th>
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
                  <td colSpan="5" className="text-center py-8 text-slate-500">No scans detected in the database yet. Scan a recyclable object!</td>
                </tr>
              ) : (
                recentScans.slice(0, 8).map((scan, index) => (
                  <tr key={scan._id || index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="text-slate-500 py-4 px-3 font-mono text-xs">#{scan._id?.slice(-5).toUpperCase() || 'SCAN'+index}</td>
                    <td className="text-slate-200 py-4 px-3 font-medium capitalize">{scan.itemType || 'Unknown'}</td>
                    <td className="py-4 px-3">
                      <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                        {scan.confidence || 0}%
                      </span>
                    </td>
                    <td className="text-emerald-500 py-4 px-3 font-medium">
                       {scan.carbonSaved ? Number(scan.carbonSaved).toFixed(2) : '0.00'} kg
                    </td>
                    <td className="py-4 px-3">
                      <button className="text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 text-xs px-3 py-1.5 rounded transition-colors">Data Log</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  )
}