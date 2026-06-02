import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, BottomNav } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '../ui/Toast'

const PAGE_TITLES = {
  '/dashboard':          { title: 'Dashboard',             subtitle: 'Your health at a glance' },
  '/passport':           { title: 'Health Passport',        subtitle: 'Your complete medical history' },
  '/symptoms':           { title: 'Symptom Analyzer',       subtitle: 'AI-powered health triage' },
  '/emergency':          { title: 'Emergency Card',         subtitle: 'Critical information for first responders' },
  '/reports':            { title: 'Report Analyzer',        subtitle: 'AI analysis of your lab reports' },
  '/medications':        { title: 'Medications',            subtitle: 'Track and manage your prescriptions' },
  '/risk':               { title: 'Risk Prediction',        subtitle: 'AI-driven health risk assessment' },
  '/feedback-analytics': { title: 'Feedback Analytics',    subtitle: 'AI sentiment analysis' },
  '/health-report':      { title: 'AI Health Report',      subtitle: 'Generate your comprehensive health report' },
  '/settings':           { title: 'Settings',              subtitle: 'Manage your account and preferences' },
}

const FLOATING_PARTICLES = [
  { id: 1, size: 12, left: '15%', top: '25%', duration: 12, delay: 0 },
  { id: 2, size: 24, left: '75%', top: '15%', duration: 18, delay: 2 },
  { id: 3, size: 8,  left: '45%', top: '65%', duration: 15, delay: 1 },
  { id: 4, size: 16, left: '85%', top: '75%', duration: 20, delay: 3 },
  { id: 5, size: 20, left: '25%', top: '80%', duration: 14, delay: 0 },
  { id: 6, size: 10, left: '60%', top: '40%', duration: 16, delay: 2 },
]

export function AppShell({ title: propTitle, subtitle: propSubtitle }) {
  const location = useLocation()
  const info = PAGE_TITLES[location.pathname] || {}
  const title = propTitle || info.title || 'oneHealth'
  const subtitle = propSubtitle || info.subtitle || ''

  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden relative">
      {/* Background soft glowing orb decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      
      {/* Animated AI orbs */}
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0 animate-bounce" style={{ animationDuration: '20s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {FLOATING_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-500/10 dark:bg-blue-500/20"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: 15 }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)', y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Global toast container */}
      <ToastContainer />
    </div>
  )
}
