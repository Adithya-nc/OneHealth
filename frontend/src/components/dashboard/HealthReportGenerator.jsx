import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Sparkles, Download, Share2, Save, Check,
  ChevronRight, Activity, AlertTriangle, Heart, Pill,
  Lightbulb, Calendar, TrendingUp, Zap
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/Card'
import { ProgressBar, Alert } from '../ui/index'
import { useUserStore } from '../../store/userStore'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/formatters'

const SOURCES = [
  { id: 'records',    label: 'Medical Records',   icon: <FileText size={16} />,      desc: '12 records found' },
  { id: 'symptoms',   label: 'Symptom History',   icon: <Activity size={16} />,      desc: '3 analyses' },
  { id: 'reports',    label: 'Lab Reports',        icon: <TrendingUp size={16} />,    desc: '5 reports' },
  { id: 'medications',label: 'Medications',        icon: <Pill size={16} />,          desc: '2 active' },
  { id: 'risk',       label: 'Risk Analysis',      icon: <AlertTriangle size={16} />, desc: 'Medium risk profile' },
]

const GENERATION_STEPS = [
  'Collecting medical records...',
  'Analyzing health timeline...',
  'Computing health score...',
  'Identifying key findings...',
  'Generating risk summary...',
  'Writing recommendations...',
  'Finalizing report...',
]

const MOCK_REPORT = {
  generated_at: new Date().toISOString(),
  health_score: 74,
  patient_status: 'Stable — Minor concerns noted',
  key_findings: [
    { severity: 'warning', title: 'Mild Iron-Deficiency Anaemia', detail: 'Haemoglobin at 11.2 g/dL — slightly below normal range. Likely dietary in origin.' },
    { severity: 'info', title: 'Asthma Well-Controlled', detail: 'No acute episodes in the past 6 months. Current inhaler therapy is effective.' },
    { severity: 'success', title: 'Cardiovascular Markers Normal', detail: 'Cholesterol, blood pressure readings trending in a healthy direction.' },
    { severity: 'warning', title: 'Mild Hypertension — Monitor', detail: 'BP readings show borderline values. Lifestyle modifications recommended.' },
  ],
  risk_summary: {
    diabetes:     'Low',
    hypertension: 'Medium',
    heart_disease:'Low',
    obesity:      'Low',
  },
  recommendations: [
    'Increase dietary iron: include spinach, lentils, and fortified cereals daily.',
    'Take iron supplement (ferrous sulfate 200mg) — consult your doctor for dosage.',
    'Continue Salbutamol inhaler and carry it at all times.',
    'Monitor blood pressure twice weekly; log readings in your passport.',
    'Schedule a follow-up with your cardiologist within 3 months.',
  ],
  lifestyle: [
    '30 minutes of moderate exercise 5 days a week (swimming, cycling, brisk walking).',
    'Reduce sodium intake to below 1,500 mg/day to support blood pressure control.',
    'Maintain 7–8 hours of sleep to support immune function and recovery.',
    'Practice stress management: 10 minutes of mindfulness or breathing exercises daily.',
  ],
  followup_plan: [
    { date: '2026-09-01', action: 'Repeat CBC and Iron Studies' },
    { date: '2026-09-15', action: 'Cardiologist follow-up for BP monitoring' },
    { date: '2026-11-01', action: 'Annual general health checkup' },
  ],
}

function RiskBadge({ level }) {
  const cfg = {
    Low:    'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400',
    High:   'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
  }[level] || 'bg-slate-100 text-slate-700'
  return <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full', cfg)}>{level}</span>
}

export default function HealthReportGenerator() {
  const [selectedSources, setSelectedSources] = useState(['records', 'reports', 'medications'])
  const [state, setState] = useState('idle') // idle | generating | done
  const [stepIndex, setStepIndex] = useState(0)
  const [report, setReport] = useState(null)
  const profile = useUserStore(s => s.profile)
  const toast = useToast()

  const toggleSource = (id) => {
    setSelectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleGenerate = async () => {
    setState('generating')
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setStepIndex(i)
      await new Promise(r => setTimeout(r, 800))
    }
    setReport(MOCK_REPORT)
    setState('done')
  }

  const findingCfg = {
    warning: { color: 'border-amber-300/40 bg-amber-500/5', icon: <AlertTriangle size={14} className="text-amber-600" />, badge: 'bg-amber-100 text-amber-800' },
    success: { color: 'border-emerald-300/40 bg-emerald-500/5', icon: <Check size={14} className="text-emerald-600" />, badge: 'bg-emerald-100 text-emerald-800' },
    info:    { color: 'border-blue-300/40 bg-blue-500/5',  icon: <Activity size={14} className="text-blue-600" />, badge: 'bg-blue-100 text-blue-800' },
    danger:  { color: 'border-red-300/40 bg-red-500/5',    icon: <AlertTriangle size={14} className="text-red-600" />, badge: 'bg-red-100 text-red-800' },
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <div className="page-container py-6 space-y-6 max-w-4xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 mb-4 shadow-lg shadow-emerald-500/20"
        >
          <FileText size={28} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">AI Health Report Generator</h1>
        <p className="text-[var(--color-text-secondary)] mt-1.5 max-w-md mx-auto text-sm">Generate a comprehensive, ready-to-share health dossier summarizing timelines and risks.</p>
      </div>

      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -15 }} className="space-y-6">
            {/* Source Selection inside GlassCard */}
            <GlassCard>
              <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-4">Select Source Materials</h3>
              <div className="space-y-2.5">
                {SOURCES.map(s => (
                  <motion.label
                    key={s.id}
                    whileHover={{ y: -2 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all duration-300',
                      selectedSources.includes(s.id)
                        ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface-2)]/60'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(s.id)}
                      onChange={() => toggleSource(s.id)}
                      className="w-4.5 h-4.5 accent-blue-600 cursor-pointer"
                    />
                    <div className={cn('p-2 rounded-xl', selectedSources.includes(s.id) ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]')}>
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-[var(--color-text-primary)]">{s.label}</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">{s.desc}</p>
                    </div>
                    {selectedSources.includes(s.id) && <Check size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                  </motion.label>
                ))}
              </div>
            </GlassCard>

            {/* Generate Button — glowing premium CTA */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur-lg opacity-35 animate-pulse" />
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button
                  onClick={handleGenerate}
                  disabled={selectedSources.length === 0}
                  className="relative w-full h-16 text-lg font-black bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-2xl shadow-xl transition-all duration-300 border-none"
                  leftIcon={<Sparkles size={22} className="animate-spin" style={{ animationDuration: '8s' }} />}
                >
                  Generate AI Health Dossier
                </Button>
              </motion.div>
            </div>

            <p className="text-xs text-center text-[var(--color-text-muted)] font-medium">
              Generating compiling {selectedSources.length} telemetry node{selectedSources.length !== 1 ? 's' : ''}.
            </p>
          </motion.div>
        )}

        {state === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 space-y-8 flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white animate-pulse" />
              </div>
            </div>
            <div className="max-w-md w-full space-y-5 text-center">
              <p className="text-xl font-black text-[var(--color-text-primary)]">Compiling health dossiers...</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">{GENERATION_STEPS[stepIndex]}</p>
              <ProgressBar value={((stepIndex + 1) / GENERATION_STEPS.length) * 100} color="success" showPercent />
            </div>
          </motion.div>
        )}

        {state === 'done' && report && (
          <motion.div 
            key="done" 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Report Header Card */}
            <motion.div variants={cardVariant}>
              <GlassCard className="p-0 border border-[var(--color-border)]/60 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 p-6 text-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-xs font-semibold opacity-80 uppercase tracking-widest">Lifetime Medical Dossier</p>
                      <h2 className="text-3xl font-black mt-1.5">{profile?.name || 'Priya Sharma'}</h2>
                      <p className="text-xs opacity-75 mt-1 font-medium">Generated {new Date(report.generated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-center bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[100px] shadow-lg">
                      <p className="text-5xl font-black font-data leading-none">{report.health_score}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-85 mt-2">Health Score</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-[var(--color-surface)]/60 backdrop-blur-md flex items-center gap-3 relative z-10 border-t border-[var(--color-border)]/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="font-bold text-sm text-[var(--color-text-primary)]">{report.patient_status}</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Key Findings */}
            <motion.div variants={cardVariant}>
              <GlassCard>
                <h3 className="font-black text-base text-[var(--color-text-primary)] mb-4">Key Diagnostic Findings</h3>
                <div className="space-y-3">
                  {report.key_findings.map((f, i) => {
                    const cfg = findingCfg[f.severity] || findingCfg.info
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01, x: 2 }}
                        className={cn('p-4 rounded-xl border flex gap-3 border-[var(--color-border)]', cfg.color)}
                      >
                        <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
                        <div>
                          <p className="font-bold text-sm text-[var(--color-text-primary)]">{f.title}</p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-relaxed">{f.detail}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* Risk Summary */}
            <motion.div variants={cardVariant}>
              <GlassCard>
                <h3 className="font-black text-base text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500 animate-pulse" /> Risk Forecasts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(report.risk_summary).map(([condition, level]) => (
                    <motion.div 
                      key={condition} 
                      whileHover={{ y: -2 }}
                      className="p-4 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 text-center"
                    >
                      <RiskBadge level={level} />
                      <p className="text-xs font-bold text-[var(--color-text-secondary)] mt-2.5 capitalize">
                        {condition.replace(/_/g, ' ')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommendations */}
              <motion.div variants={cardVariant}>
                <GlassCard className="h-full">
                  <h3 className="font-black text-base text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-blue-500" /> Medical Actions
                  </h3>
                  <ol className="space-y-3">
                    {report.recommendations.map((r, i) => (
                      <motion.li 
                        key={i} 
                        whileHover={{ x: 2 }}
                        className="flex gap-3 text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed"
                      >
                        <span className="w-5.5 h-5.5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">{i + 1}</span>
                        <span>{r}</span>
                      </motion.li>
                    ))}
                  </ol>
                </GlassCard>
              </motion.div>

              {/* Lifestyle + Follow-Up */}
              <div className="space-y-6">
                <motion.div variants={cardVariant}>
                  <GlassCard>
                    <h3 className="font-black text-sm text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                      <Heart size={16} className="text-emerald-500" /> Lifestyle Regimens
                    </h3>
                    <ul className="space-y-2">
                      {report.lifestyle.map((l, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-[var(--color-text-secondary)] font-medium">
                          <span className="text-emerald-500 flex-shrink-0 font-bold">✓</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
                
                <motion.div variants={cardVariant}>
                  <GlassCard>
                    <h3 className="font-black text-sm text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                      <Calendar size={16} className="text-purple-500" /> Monitoring Schedule
                    </h3>
                    <div className="space-y-2.5">
                      {report.followup_plan.map((f, i) => (
                        <div key={i} className="flex gap-3 text-sm font-medium">
                          <span className="text-xs text-[var(--color-text-muted)] font-data font-bold flex-shrink-0 pt-0.5">{new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          <span className="text-[var(--color-text-primary)]">{f.action}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div variants={cardVariant} className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.975 }}>
                <Button className="w-full h-12 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" leftIcon={<Download size={16} />} onClick={() => toast.success('Dossier Download', 'Exporting PDF report format.')}>
                  Download PDF Report
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.975 }}>
                <Button variant="secondary" className="w-full h-12" leftIcon={<Share2 size={16} />} onClick={() => toast.info('Access Link', 'Consented access link copied.')}>
                  Share with Clinic
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.975 }}>
                <Button variant="outline" className="w-full h-12" leftIcon={<Save size={16} />} onClick={() => toast.success('Saved', 'Report stored inside Health Passport timeline.')}>
                  Save Timeline Log
                </Button>
              </motion.div>
            </motion.div>

            <Button variant="ghost" className="w-full h-10 mt-2 font-bold" onClick={() => { setState('idle'); setReport(null) }}>
              Generate New Assessment Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
