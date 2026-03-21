import React from 'react'
import { UserCircle, Zap, Leaf, Flame, Star, Trophy, Award, Target } from 'lucide-react'

export default function Profile() {
  const user = {
    username: 'EcoWarrior_07',
    memberSince: 'March 2026',
    bio: 'On a mission to save the planet, one scan at a time.'
  }

  const impactStats = [
    {
      title: 'Total Items Scanned',
      value: '142',
      icon: Zap,
      color: 'emerald'
    },
    {
      title: 'Total Carbon Saved',
      value: '12.4 kg',
      icon: Leaf,
      color: 'emerald'
    },
    {
      title: 'Current Streak',
      value: '5 Days',
      icon: Flame,
      color: 'emerald'
    }
  ]

  const badges = [
    {
      id: 1,
      title: 'First Upcycle',
      description: 'Complete your first upcycling project',
      icon: Star,
      unlocked: true
    },
    {
      id: 2,
      title: '10kg Carbon Club',
      description: 'Save 10kg of CO₂ through scanning',
      icon: Leaf,
      unlocked: true
    },
    {
      id: 3,
      title: 'Recycle Rookie',
      description: 'Scan 10 different items',
      icon: Award,
      unlocked: true
    },
    {
      id: 4,
      title: 'Community Champion',
      description: 'Reach top 10 leaderboard ranking',
      icon: Trophy,
      unlocked: false
    },
    {
      id: 5,
      title: 'Scanning Streak',
      description: 'Scan items 7 days in a row',
      icon: Zap,
      unlocked: false
    },
    {
      id: 6,
      title: 'Master Upcycler',
      description: 'Complete 25 upcycling projects',
      icon: Target,
      unlocked: false
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-full flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-emerald-400" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-400 mb-4">
              <span>📅 Member since {user.memberSince}</span>
            </div>
            <p className="text-slate-300 max-w-md">{user.bio}</p>
          </div>

          {/* Right Badge */}
          <div className="flex-shrink-0 text-center">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-6 py-4">
              <p className="text-slate-400 text-sm mb-1">Account Status</p>
              <p className="text-2xl font-bold text-emerald-400">🌟 Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - My Impact */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">My Impact</h2>
          
          {impactStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Middle Column - Achievements & Badges */}
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-2xl font-bold text-white mb-6">Achievements & Badges</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.id}
                  className={`card border transition-all cursor-pointer ${
                    badge.unlocked
                      ? 'border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5'
                      : 'border-slate-600/30 opacity-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 ${
                      badge.unlocked
                        ? 'bg-emerald-500/20'
                        : 'bg-slate-700/30'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        badge.unlocked
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`} />
                    </div>
                    
                    <h3 className={`font-bold mb-2 ${
                      badge.unlocked
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}>
                      {badge.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm mb-3">
                      {badge.description}
                    </p>
                    
                    {badge.unlocked && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                        ✓ Unlocked
                      </span>
                    )}
                    
                    {!badge.unlocked && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-700/20 px-3 py-1 rounded-full">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="card border border-emerald-500/20 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white">Badge Progress</h3>
              <span className="text-emerald-400 font-semibold">3/6 Unlocked</span>
            </div>
            
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-3 rounded-full transition-all duration-300"
                style={{ width: '50%' }}
              ></div>
            </div>
            
            <p className="text-slate-400 text-sm mt-3">Keep scanning to unlock more badges and achievements!</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="card bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Ready to Scan More?</h3>
            <p className="text-slate-400">Start scanning items to earn more badges and save the planet!</p>
          </div>
          <a
            href="/"
            className="btn-primary whitespace-nowrap"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
