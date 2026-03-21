import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { authService } from '../services/authService'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided')
        return
      }

      try {
        const response = await authService.verifyEmail(token)
        
        if (response.success) {
          setStatus('success')
          setMessage('🎉 Your email has been verified! You can now enjoy all EcoSnap features.')
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard')
          }, 3000)
        }
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Email verification failed. The link may have expired.')
      }
    }

    verifyEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Blurred Glowing Orb Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphic Card */}
        <div className="bg-[#0d1410] border border-emerald-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-sm text-center">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                <path d="M12 12v4"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
          </div>

          {/* Verifying State */}
          {status === 'verifying' && (
            <>
              <h1 className="text-3xl font-black text-white mb-4">Verifying Email</h1>
              <p className="text-slate-400 mb-8">Please wait while we verify your email address...</p>
              
              <div className="flex justify-center mb-8">
                <Loader className="w-12 h-12 text-emerald-400 animate-spin" />
              </div>
              
              <p className="text-slate-500 text-sm">This may take a few moments</p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
              </div>

              <h1 className="text-3xl font-black text-white mb-4">Email Verified!</h1>
              <p className="text-slate-400 mb-8">{message}</p>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-sm">Redirecting to dashboard in 3 seconds...</p>
                <Link
                  to="/dashboard"
                  className="inline-block w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Go to Dashboard Now
                </Link>
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <AlertCircle className="w-16 h-16 text-red-400" />
              </div>

              <h1 className="text-3xl font-black text-white mb-4">Verification Failed</h1>
              <p className="text-red-400 mb-8">{message}</p>
              
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="inline-block w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="inline-block w-full bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/30 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  Go to Login
                </Link>
              </div>

              <p className="text-slate-500 text-sm mt-6">
                Still having issues?{' '}
                <a href="mailto:support@ecosnap.com" className="text-emerald-400 hover:text-emerald-300">
                  Contact support
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
