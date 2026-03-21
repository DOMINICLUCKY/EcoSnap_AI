import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BarChart3, TrendingUp, Users, Newspaper, User, Zap } from 'lucide-react'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Heatmap', path: '/heatmap', icon: TrendingUp },
    { name: 'Leaderboard', path: '/leaderboard', icon: Users },
    { name: 'Eco News', path: '/news', icon: Newspaper },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] border-r border-slate-700/50 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">EcoSnap</div>
              <div className="text-emerald-400 text-xs font-semibold">AI DETECTION</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                className={`sidebar-link ${isActive ? 'sidebar-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-slate-700/50 text-slate-500 text-xs">
          <p>© 2026 EcoSnap AI</p>
          <p>Enterprise Edition</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="h-16 bg-[#1e293b]/95 border-b border-slate-700/50 flex items-center px-8 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full pulse-dot"></div>
            <span className="text-slate-300 text-sm font-semibold tracking-wider">LIVE DATA</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
