import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { authService } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })
      
      if (response.success) {
        // Redirect to dashboard on successful login
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      // Note: In production, you'd integrate with Google Sign-In SDK here
      console.log('Google login - requires @react-oauth/google integration')
      setError('Google OAuth integration coming soon. Use email/password for now.')
    } catch (err) {
      setError('Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Blurred Glowing Orb Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphic Card */}
        <div className="bg-[#0d1410] border border-emerald-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-sm">
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to your EcoSnap account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#050a07] border border-slate-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-[#050a07] border border-slate-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0d1410] text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/30 hover:border-emerald-500/30 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Continue with Google
          </button>

          {/* Footer Link */}
          <p className="text-center text-slate-400 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
              Create one
            </Link>
          </p>
        </div>

        {/* Back to Landing Link */}
        <p className="text-center text-slate-500 text-xs mt-6">
          <Link to="/" className="hover:text-emerald-400 transition">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
