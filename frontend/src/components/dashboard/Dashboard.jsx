import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  FileText, Pill, Stethoscope, Syringe, Activity,
  AlertTriangle, Upload, TrendingUp, TrendingDown,
  ChevronRight, Lightbulb, X, ArrowRight, Clock,
  BarChart3, Sparkles, Star, Check, Sparkle, Calendar, ShieldCheck, Heart
} from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useUserStore } from '../../store/userStore'
import { useRecordsStore } from '../../store/recordsStore'
import { StatCard, Avatar, ProgressBar, Alert, EmptyState, GlassCard } from '../ui/index'
import { Button } from '../ui/Button'
import { RecordTypeBadge } from '../ui/Badge'
import { formatDate, formatRelative, getRecordTypeLabel, getHealthScoreConfig, cn } from '../../utils/formatters'

// Animated count-up number
function CountUp({ value, duration = 1000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{count}</span>
}

// Centerpiece 3D Health Gauge
function CenterpieceHealthScore({ score }) {
  const cfg = getHealthScoreConfig(score)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <GlassCard className="h-full flex flex-col md:flex-row items-center justify-around gap-6 p-6 border-white/20 dark:border-white/5 relative overflow-hidden shadow-2xl">
      {/* Background glow orb inside card */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* 3D Gauge Circle */}
      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
        {/* Pulse glow background rings */}
        <div className="absolute w-36 h-36 rounded-full border-4 border-emerald-500/10 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute w-40 h-40 rounded-full border-2 border-emerald-500/5 animate-pulse pointer-events-none" />
        
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Inner ring background */}
          <circle cx="80" cy="80" r={radius} fill="none" strokeWidth="14" stroke="var(--color-surface-2)" />
          {/* Main animated progress */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="14"
            stroke={cfg.color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
            className="text-5xl font-black text-[var(--color-text-primary)] font-data tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: cfg.color }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Health score stats & analysis info */}
      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/10">
            ↑ 8% Improvement
          </span>
          <h3 className="text-xl font-black text-[var(--color-text-primary)] mt-3">Health Status: Optimal</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-semibold leading-relaxed">
            Based on your medical logs, report timelines, and risk assessments.
          </p>
        </div>
        
        <div className="p-3 bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 rounded-xl">
          <p className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles size={12} className="text-purple-500" />
            AI Health Summary
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-relaxed font-semibold">
            All vital metrics are within safe boundaries. A borderline low haemoglobin level suggests continuing iron-rich nutrients.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold justify-center md:justify-start">
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Monthly Change</p>
            <p className="text-sm font-bold text-emerald-600">+4% Score</p>
          </div>
          <div className="h-6 w-px bg-[var(--color-border)]" />
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Risk Level</p>
            <p className="text-sm font-bold text-blue-600">Low Risk</p>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// Upgraded Large Quick Action Cards
function PremiumQuickAction({ icon: Icon, label, desc, to, color = 'primary' }) {
  const colorMap = {
    primary: 'bg-blue-50/50 text-[var(--color-primary)] border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/10',
    success: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10',
    warning: 'bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10',
    danger:  'bg-red-50/50 text-red-600 border-red-100 dark:bg-red-500/5 dark:border-red-500/10',
    purple:  'bg-purple-50/50 text-purple-650 border-purple-100 dark:bg-purple-500/5 dark:border-purple-500/10',
  }
  return (
    <Link to={to} style={{ perspective: 1000, display: 'block' }}>
      <motion.div
        whileHover={{ y: -6, scale: 1.03, z: 20 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'p-5 rounded-2xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur-md cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-36 group',
          colorMap[color]
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-md transition-transform duration-300 group-hover:scale-110">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[var(--color-text-primary)]">{label}</h3>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 font-medium">{desc}</p>
        </div>
        <ArrowRight size={14} className="absolute bottom-5 right-5 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
      </motion.div>
    </Link>
  )
}

// Healthcare Journey Timeline Card
function HealthcareJourneyTimeline() {
  const steps = [
    { time: '12:15 PM', title: 'Doctor Consultation Added', desc: 'Schedule follow-up with cardiologist.', type: 'consultation', icon: <Stethoscope size={12} />, color: 'bg-purple-500' },
    { time: '11:20 AM', title: 'AI Analysis Completed', desc: 'Lab values parsed successfully.', type: 'ai', icon: <Sparkles size={12} />, color: 'bg-emerald-500' },
    { time: '10:00 AM', title: 'Blood Report Uploaded', desc: 'CBC file added to Health Passport.', type: 'upload', icon: <Upload size={12} />, color: 'bg-blue-500' },
  ]
  return (
    <GlassCard className="p-5 shadow-lg relative overflow-hidden">
      <h3 className="text-base font-black text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <Activity size={18} className="text-[var(--color-primary)]" /> Healthcare Journey Timeline
      </h3>
      <div className="relative border-l border-[var(--color-border)] ml-3 pl-5 space-y-5">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline Circle Bullet */}
            <span className={cn('absolute -left-8.5 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900 shadow-sm', step.color)}>
              {step.icon}
            </span>
            <div>
              <p className="text-[10px] text-[var(--color-text-muted)] font-data font-bold">{step.time}</p>
              <h4 className="font-bold text-xs text-[var(--color-text-primary)] mt-0.5">{step.title}</h4>
              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed font-semibold">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

// AI Assistant Dedicated Panel
function AIAssistantPanel() {
  const navigate = useNavigate()
  return (
    <GlassCard className="p-5 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-100 dark:border-purple-900/20 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 blur-2xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-500/20 shadow-sm flex items-center justify-center">
          <Sparkles size={16} className="text-purple-600" />
        </div>
        <h3 className="text-base font-black text-[var(--color-text-primary)]">AI Health Assistant</h3>
      </div>

      <div className="p-3.5 bg-white/40 dark:bg-slate-900/40 border border-purple-200/30 dark:border-purple-900/30 rounded-xl space-y-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Today's Vital Insight</p>
        <p className="text-xs text-[var(--color-text-primary)] font-semibold leading-relaxed italic">
          "Your blood pressure and pulse rate have remained stable in healthy ranges for 30 consecutive days."
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button 
          size="xs" 
          onClick={() => navigate('/symptoms')} 
          leftIcon={<Activity size={12} />}
          className="text-xs font-bold h-9 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/10"
        >
          Check Symptoms
        </Button>
        <Button 
          size="xs" 
          variant="outline" 
          onClick={() => navigate('/health-report')} 
          leftIcon={<FileText size={12} />}
          className="text-xs font-bold h-9 bg-white/50 dark:bg-slate-900/50 border-[var(--color-border)] text-[var(--color-text-secondary)]"
        >
          AI Health Report
        </Button>
      </div>
    </GlassCard>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] rounded-xl p-3 shadow-xl"
    >
      <p className="text-[10px] font-bold text-[var(--color-text-muted)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-black flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
          {p.name}: {p.value}{p.unit || ''}
        </p>
      ))}
    </motion.div>
  )
}

function FeedbackSection() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/10">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1, rotate: 360 }} 
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 shadow-inner"
        >
          <Check size={24} className="text-emerald-600" />
        </motion.div>
        <h3 className="font-bold text-emerald-900 text-lg">Feedback Sent!</h3>
        <p className="text-sm text-emerald-700 mt-1">Thank you for reviewing Dr. Sarah Smith.</p>
      </motion.div>
    )
  }

  return (
    <GlassCard className="p-5 relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
      <div className="flex items-center gap-2 mb-1">
        <Star size={16} className="text-[var(--color-primary)]" />
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">Rate your recent visit</h3>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">Dr. Sarah Smith • General Consultation (Yesterday)</p>
      
      <div className="flex flex-wrap gap-1 mb-4" style={{ transform: 'translateZ(15px)' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.3, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star size={20} className={`transition-all duration-200 ${star <= (hoveredStar || rating) ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'text-gray-200 dark:text-gray-700'}`} />
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {rating > 0 && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 12 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="space-y-3 overflow-hidden">
            <textarea
              className="w-full text-xs p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none resize-none"
              placeholder="Tell us what you liked or how we can improve..."
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Button onClick={() => setSubmitted(true)} size="sm" className="w-full shadow-md shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/40 transition-shadow">
              Submit Feedback
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

// Onboarding tooltip overlay
function OnboardingOverlay({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[var(--color-surface)] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to oneHealth! 🎉</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">Your AI-powered health passport is ready. Here's what you can do:</p>
        <div className="space-y-3 text-left mb-8">
          {[
            { emoji: '📁', text: 'This is your Health Passport — store all your records here' },
            { emoji: '⬆️', text: 'Upload your first report using the Add Record button' },
            { emoji: '🚨', text: 'Your Emergency Card is pre-loaded with your critical data' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface-2)]">
              <span className="text-xl">{item.emoji}</span>
              <p className="text-sm text-[var(--color-text-primary)]">{item.text}</p>
            </div>
          ))}
        </div>
        <Button onClick={onDismiss} className="w-full">
          Got it, let's go! <ArrowRight size={16} />
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default function Dashboard() {
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)
  const fetchProfile = useUserStore(s => s.fetchProfile)
  
  const trends = useRecordsStore(s => s.trends)
  const fetchRecords = useRecordsStore(s => s.fetchRecords)
  
  useEffect(() => {
    fetchProfile()
    fetchRecords()
  }, [fetchProfile, fetchRecords])
  
  const [trendType, setTrendType] = useState('bloodSugar')
  const [trendRange, setTrendRange] = useState('monthly') // weekly | monthly | yearly
  const [showOnboarding, setShowOnboarding] = useState(false)
  const navigate = useNavigate()

  const name = profile?.name?.split(' ')[0] || 'Priya'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'

  // Dynamic Chart toggles config
  const trendConfig = {
    weight:      { key: 'value',   name: 'Weight (kg)',  color: '#1A56DB', unit: 'kg' },
    bloodSugar:  { key: 'fasting', name: 'Fasting (mg/dL)', color: '#0E9F6E', unit: ' mg/dL' },
    cholesterol: { key: 'total',   name: 'Total Cholesterol', color: '#d97706', unit: '' },
    bloodPressure: { key: 'systolic', keySec: 'diastolic', name: 'BP (Systolic)', nameSec: 'BP (Diastolic)', color: '#E02424', colorSec: '#d97706', unit: ' mmHg' }
  }

  // Combined BP & other trends selector
  const selectTrendData = () => {
    let raw = trends[trendType] || []
    // Filter/slice based on range toggle (mocking data sizes)
    if (trendRange === 'weekly') {
      return raw.slice(3)
    }
    if (trendRange === 'yearly') {
      return raw
    }
    return raw
  }

  const chartData = selectTrendData()
  const tc = trendConfig[trendType] || trendConfig.bloodSugar

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
  }
  const itemVariant = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <>
      <AnimatePresence>
        {showOnboarding && <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />}
      </AnimatePresence>

      <div className="page-container py-6 space-y-6 relative z-10">
        {/* Dynamic Premium Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)]/50 pb-6"
        >
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              {greeting}, {name}! 👋
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] font-semibold mt-1 flex flex-wrap items-center gap-2">
              <span>Your health has improved by <strong className="text-emerald-600">8%</strong> this month.</span>
              <span className="h-4 w-px bg-[var(--color-border)] hidden sm:inline" />
              <span className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full font-bold border border-purple-200/30">
                <Sparkles size={10} className="animate-pulse" /> Gemini AI Engine Active
              </span>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Upload size={16} />}
              onClick={() => navigate('/passport')}
              className="bg-white/60 dark:bg-slate-900/60 border-[var(--color-border)] shadow-sm font-bold"
            >
              Add Record
            </Button>
            <Button
              leftIcon={<Sparkles size={16} />}
              onClick={() => navigate('/health-report')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg shadow-blue-500/15 font-bold"
            >
              Generate AI Dossier
            </Button>
          </div>
        </motion.div>

        {/* Centerpiece health gauge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CenterpieceHealthScore score={healthMetrics?.health_score || 74} />
        </motion.div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Health Trends & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Trends upgraded with Multi-Metrics */}
            <GlassCard className="p-5 shadow-lg relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-black text-[var(--color-text-primary)] flex items-center gap-2">
                    <BarChart3 size={18} className="text-[var(--color-primary)]" /> Vital Health Trends
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mt-0.5">Biometric telemetry logs</p>
                </div>
                
                {/* Metric Selector & Range selection */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]/50">
                    {[
                      { id: 'bloodSugar', label: 'Blood Sugar' },
                      { id: 'weight', label: 'Weight' },
                      { id: 'bloodPressure', label: 'BP' },
                      { id: 'cholesterol', label: 'Cholesterol' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTrendType(t.id)}
                        className={cn(
                          'px-2.5 py-1 text-xs rounded-md font-bold transition-all',
                          trendType === t.id
                            ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]/50">
                    {['weekly', 'monthly', 'yearly'].map(range => (
                      <button
                        key={range}
                        onClick={() => setTrendRange(range)}
                        className={cn(
                          'px-2.5 py-1 text-xs rounded-md font-bold capitalize transition-all',
                          trendRange === range
                            ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {chartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                    <defs>
                      <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={tc.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={tc.color} stopOpacity={0} />
                      </linearGradient>
                      {tc.keySec && (
                        <linearGradient id="colorGradSec" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={tc.colorSec} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={tc.colorSec} stopOpacity={0} />
                        </linearGradient>
                      )}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 'semibold' }} axisLine={false} tickLine={false} dy={8} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 'semibold' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    <Area
                      type="monotone"
                      dataKey={tc.key}
                      name={tc.name}
                      unit={tc.unit}
                      stroke={tc.color}
                      strokeWidth={3}
                      fill="url(#colorGrad)"
                      activeDot={{ r: 6, fill: tc.color, stroke: 'white', strokeWidth: 2 }}
                      dot={{ r: 0 }}
                    />
                    {tc.keySec && (
                      <Area
                        type="monotone"
                        dataKey={tc.keySec}
                        name={tc.nameSec}
                        unit={tc.unit}
                        stroke={tc.colorSec}
                        strokeWidth={3}
                        fill="url(#colorGradSec)"
                        activeDot={{ r: 6, fill: tc.colorSec, stroke: 'white', strokeWidth: 2 }}
                        dot={{ r: 0 }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center">
                  <BarChart3 size={32} className="text-[var(--color-text-muted)] mb-2 animate-pulse" />
                  <p className="text-sm font-bold text-[var(--color-text-secondary)]">Not enough telemetry data yet</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Upload more reports to populate vital curves</p>
                </div>
              )}
            </GlassCard>

            {/* Quick Actions redesign */}
            <div>
              <h3 className="text-base font-black text-[var(--color-text-primary)] mb-3 uppercase tracking-wider pl-1">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <PremiumQuickAction icon={Upload} label="Upload Report" desc="Add to Health Passport" to="/passport" color="success" />
                <PremiumQuickAction icon={Stethoscope} label="Analyze Symptoms" desc="AI clinical triage" to="/symptoms" color="primary" />
                <PremiumQuickAction icon={AlertTriangle} label="Emergency Card" desc="Crisis first responder info" to="/emergency" color="danger" />
                <PremiumQuickAction icon={Calendar} label="Book Clinic" desc="Schedule follow-up" to="/passport" color="warning" />
                <PremiumQuickAction icon={FileText} label="Generate AI Report" desc="Get medical dossier" to="/health-report" color="purple" />
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant, Timeline, and Schedule */}
          <div className="space-y-6 lg:col-span-1">
            {/* Dedicated AI assistant panel */}
            <AIAssistantPanel />

            {/* Journey Timeline */}
            <HealthcareJourneyTimeline />

            {/* Medications Reminder log */}
            <GlassCard className="p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-[var(--color-primary)]" />
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Today's Medications</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Salbutamol 100mcg', time: '08:00 AM', taken: true },
                  { name: 'Amlodipine 5mg',    time: '09:00 AM', taken: false },
                ].map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{med.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-semibold mt-0.5">{med.time}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      med.taken 
                        ? 'bg-emerald-50/50 border-emerald-250 text-emerald-700 dark:text-emerald-450 dark:bg-emerald-500/5' 
                        : 'bg-amber-50/50 border-amber-250 text-amber-750 dark:text-amber-400 dark:bg-amber-500/5'
                    }`}>
                      {med.taken ? 'Taken' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/medications" className="mt-4 flex items-center gap-1 text-xs text-[var(--color-primary)] font-bold hover:underline pl-1">
                Manage all medications <ChevronRight size={12} />
              </Link>
            </GlassCard>

            {/* Visit feedback stars */}
            <FeedbackSection />
          </div>
        </div>
      </div>
    </>
  )
}
