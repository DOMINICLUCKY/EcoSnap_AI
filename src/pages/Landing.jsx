import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Radar, Lightbulb, ChevronDown } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              <path d="M12 12v4"/>
              <path d="M8 12h8"/>
            </svg>
            <span className="text-xl font-black text-white tracking-wider">
              Eco<span className="text-emerald-400">Snap</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-slate-300 hover:text-emerald-400 text-sm font-medium transition">Features</a>
            <Link to="/login" className="px-6 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition border border-emerald-500/30">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-400">AI-Powered Waste Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Turn Trash into
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Global Intelligence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Scan any waste item with our AI camera. Get instant recycling pathways, upcycling tutorials, and join a global movement turning environmental data into real-world impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {/* Primary CTA */}
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]"
            >
              <Zap className="w-5 h-5" />
              Try AI Scanner Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link to="/login" className="px-8 py-4 bg-slate-900/50 hover:bg-slate-900/80 text-white font-bold rounded-lg transition-all duration-300 border border-slate-700/30 hover:border-emerald-500/30">
              Sign In
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown className="w-6 h-6 text-emerald-400/60" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Why EcoSnap?</h2>
            <p className="text-xl text-slate-400">Advanced AI meets environmental responsibility</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Real-time Bounding Boxes */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-900/20 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold mb-3">Real-Time Detection</h3>
              <p className="text-slate-400 leading-relaxed">
                Live bounding boxes with 90%+ accuracy detect exactly what you're scanning. See confidence scores in real-time on your camera feed.
              </p>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>

            {/* Feature 2: Live Heatmap Radar */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-900/20 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Radar className="w-7 h-7 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold mb-3">Live Heatmap Radar</h3>
              <p className="text-slate-400 leading-relaxed">
                Track waste hotspots across your region on an interactive map. See threat levels (critical, warning, safe) updated in real-time as your community scans.
              </p>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>

            {/* Feature 3: AI Upcycling Tutorials */}
            <div className="group relative p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-900/20 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-7 h-7 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold mb-3">AI Upcycling Tutorials</h3>
              <p className="text-slate-400 leading-relaxed">
                Get instant step-by-step DIY projects for any scanned item. Transform trash into creative art, storage, and functional home décor with AI guidance.
              </p>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">2.8M+</div>
              <p className="text-slate-400">Items Scanned</p>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">156K</div>
              <p className="text-slate-400">Tons CO₂ Prevented</p>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">85%</div>
              <p className="text-slate-400">Recycling Rate</p>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-400 mb-2">127+</div>
              <p className="text-slate-400">Countries Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-slate-400 mb-8">Join millions of users turning environmental data into real-world change.</p>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]"
          >
            <Zap className="w-5 h-5" />
            Start Scanning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/10 py-12 px-6 text-slate-400 text-center">
        <p>© 2026 EcoSnap AI. Transforming waste into intelligence.</p>
      </footer>
    </div>
  )
}
