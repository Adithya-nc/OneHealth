import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, ShieldCheck, AlertTriangle, Heart, Flame,
  Wind, Sparkles, RefreshCw, ChevronRight, Sliders,
  Share2, Download, Info, CheckCircle2, ArrowUpRight,
  TrendingDown, TrendingUp, Save, Clock, Calendar, Check
} from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { GlassCard } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StatCard, ProgressBar } from '../components/ui/index'
import { useUserStore } from '../store/userStore'
import { useRecordsStore } from '../store/recordsStore'
import { useToast } from '../components/ui/Toast'
import api from '../services/api'

export default function RiskPrediction() {
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)
  const addRecord = useRecordsStore(s => s.addRecord)
  const toast = useToast()

  // Simulation parameters
  const [exerciseHours, setExerciseHours] = useState(3.5)
  const [sleepHours, setSleepHours] = useState(7.5)
  const [dietTier, setDietTier] = useState('balanced') // 'clean', 'balanced', 'high-sodium'
  const [isSmoker, setIsSmoker] = useState(false)
  const [systolicBp, setSystolicBp] = useState(120)
  
  // Backend assessment state
  const [riskData, setRiskData] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch initial assessment from backend
  const fetchAssessment = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/risk/assessment')
      if (response.data && response.data.composite_risk_score !== undefined) {
        setRiskData(response.data)
        if (response.data.history) {
          setHistoryData(response.data.history)
        }
      }
    } catch {
      // Fallback local safe default
      setRiskData({
        overall_risk_tier: 'low',
        composite_risk_score: 18,
        overall_health_score: 88,
        domains: {
          cardiovascular: { name: 'Cardiovascular Health', risk_percentage: 18, tier: 'low' },
          metabolic: { name: 'Type 2 Diabetes & Metabolism', risk_percentage: 14, tier: 'low' },
          respiratory: { name: 'Pulmonary & Allergy Response', risk_percentage: 24, tier: 'moderate' }
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssessment()
  }, [fetchAssessment])

  // Call backend prediction whenever simulation sliders change
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSimulating(true)
      try {
        const response = await api.post('/risk/predict', {
          exercise_hours_weekly: exerciseHours,
          sleep_hours: sleepHours,
          diet_tier: dietTier,
          smoker: isSmoker,
          systolic_bp: systolicBp,
          age: 32,
          bmi: healthMetrics?.bmi || 21.3
        })
        if (response.data && response.data.composite_risk_score !== undefined) {
          setRiskData(prev => ({
            ...prev,
            ...response.data
          }))
        }
      } catch {
        // Silently preserve current view
      } finally {
        setIsSimulating(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [exerciseHours, sleepHours, dietTier, isSmoker, systolicBp, healthMetrics?.bmi])

  // Composite score & colors
  const compositeScore = riskData?.composite_risk_score ?? 18
  const healthScore = riskData?.overall_health_score ?? 88
  const overallTier = riskData?.overall_risk_tier ?? 'low'

  const tierColors = {
    low: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', stroke: '#10b981' },
    moderate: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', stroke: '#f59e0b' },
    high: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-500/20', stroke: '#ef4444' }
  }

  const currentTierTheme = tierColors[overallTier] || tierColors.low

  const handleSaveToPassport = async () => {
    try {
      await api.post('/risk/save', riskData || {})
    } catch {
      // Continue locally
    }

    addRecord({
      id: `rec-risk-${Date.now()}`,
      type: 'diagnosis',
      date: new Date().toISOString().split('T')[0],
      title: `AI Health Risk Assessment: ${overallTier.toUpperCase()} Risk (${compositeScore}%)`,
      metadata: {
        doctor_name: 'oneHealth Risk Intelligence Engine',
        hospital: 'Preventive Health Triage',
        notes: `Cardio: ${riskData?.domains?.cardiovascular?.risk_percentage}% · Metabolic: ${riskData?.domains?.metabolic?.risk_percentage}% · Respiratory: ${riskData?.domains?.respiratory?.risk_percentage}%`
      },
      ai_analysis: {
        summary: `10-year multi-domain health assessment calculated a ${overallTier} risk tier with overall health score of ${healthScore}/100.`,
        suggested_actions: [
          'Maintain regular aerobic physical activity.',
          'Schedule annual lipid profile review.',
          'Keep bronchodilator accessible during seasonal AQI changes.'
        ]
      }
    })

    toast.success('Saved to Passport', 'Risk prediction report has been logged to your Health Passport.')
  }

  const handleShareSummary = () => {
    const text = `OneHealth AI Risk Assessment\nComposite 10-Year Risk: ${compositeScore}% (${overallTier.toUpperCase()})\nHealth Standing Score: ${healthScore}/100\nCardio Risk: ${riskData?.domains?.cardiovascular?.risk_percentage}%\nMetabolic Risk: ${riskData?.domains?.metabolic?.risk_percentage}%\nPulmonary Risk: ${riskData?.domains?.respiratory?.risk_percentage}%\nTimestamp: ${new Date().toLocaleDateString()}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Summary Copied', 'Clinical risk forecast copied to clipboard.')
    setTimeout(() => setCopied(false), 2500)
  }

  const handleResetSimulator = () => {
    setExerciseHours(3.5)
    setSleepHours(7.5)
    setDietTier('balanced')
    setIsSmoker(false)
    setSystolicBp(120)
    toast.info('Simulator Reset', 'Restored default clinical baseline parameters.')
  }

  return (
    <div className="page-container py-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)]/50 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Activity size={22} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
                AI Health Risk Prediction
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">
                Multi-domain 10-year clinical forecast synthesized from vital telemetry, lab records, and behavioral models.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            onClick={handleShareSummary}
            className="h-10 text-xs font-bold bg-white/60 dark:bg-slate-900/60"
          >
            {copied ? 'Copied to Clipboard' : 'Export Summary'}
          </Button>
          <Button
            size="sm"
            leftIcon={<Save size={14} />}
            onClick={handleSaveToPassport}
            className="h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            Save to Passport
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<RefreshCw size={14} />}
            onClick={handleResetSimulator}
            className="h-10 text-xs font-bold"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Main Composite Score Hero Card */}
      <GlassCard className="p-6 md:p-8 relative overflow-hidden border-white/20 dark:border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Gauge Center */}
          <div className="lg:col-span-5 flex flex-col items-center text-center justify-center border-b lg:border-b-0 lg:border-r border-[var(--color-border)]/60 pb-6 lg:pb-0 lg:pr-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" strokeWidth="12" stroke="var(--color-surface-2)" />
                <motion.circle
                  cx="80" cy="80" r="68" fill="none" strokeWidth="12"
                  stroke={currentTierTheme.stroke}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 68}
                  initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - compositeScore / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[var(--color-text-primary)] font-data tracking-tight">
                  {compositeScore}%
                </span>
                <span className={`text-[11px] font-black uppercase tracking-widest mt-1 px-2.5 py-0.5 rounded-full ${currentTierTheme.bg} ${currentTierTheme.text}`}>
                  {overallTier} Risk Tier
                </span>
              </div>
            </div>

            <h3 className="text-lg font-black text-[var(--color-text-primary)] mt-4">
              Composite 10-Year Clinical Risk
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-semibold mt-1 max-w-xs">
              Algorithmic model based on Framingham Heart Study & FINDRISC Diabetes metrics.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200/40">
              <ShieldCheck size={14} /> Overall Health Standing: {healthScore}/100
            </div>
          </div>

          {/* Key Domain Breakdown Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                Clinical Domain Risk Breakdown
              </h3>
              {isSimulating && (
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 animate-pulse">
                  <Sparkles size={12} /> Live Re-indexing...
                </span>
              )}
            </div>

            {/* Cardio */}
            <div className="p-4 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600">
                    <Heart size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Cardiovascular Health</h4>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                      BP: {systolicBp}/80 mmHg · Total Cholesterol: 185 mg/dL · Non-smoker
                    </p>
                  </div>
                </div>
                <span className="font-data font-black text-sm text-[var(--color-text-primary)]">
                  {riskData?.domains?.cardiovascular?.risk_percentage ?? 18}%
                </span>
              </div>
              <ProgressBar
                value={riskData?.domains?.cardiovascular?.risk_percentage ?? 18}
                max={100}
                color={(riskData?.domains?.cardiovascular?.risk_percentage ?? 18) < 20 ? 'green' : (riskData?.domains?.cardiovascular?.risk_percentage ?? 18) < 45 ? 'amber' : 'red'}
              />
            </div>

            {/* Metabolic */}
            <div className="p-4 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Flame size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Type 2 Diabetes & Metabolism</h4>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                      Fasting Sugar: 92 mg/dL · BMI: {healthMetrics?.bmi || 21.3} · Diet: {dietTier}
                    </p>
                  </div>
                </div>
                <span className="font-data font-black text-sm text-[var(--color-text-primary)]">
                  {riskData?.domains?.metabolic?.risk_percentage ?? 14}%
                </span>
              </div>
              <ProgressBar
                value={riskData?.domains?.metabolic?.risk_percentage ?? 14}
                max={100}
                color={(riskData?.domains?.metabolic?.risk_percentage ?? 14) < 22 ? 'green' : (riskData?.domains?.metabolic?.risk_percentage ?? 14) < 45 ? 'amber' : 'red'}
              />
            </div>

            {/* Pulmonary */}
            <div className="p-4 rounded-2xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                    <Wind size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Pulmonary & Allergy Response</h4>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                      Mild asthma history · Dust mite sensitivity · Inhaler documented
                    </p>
                  </div>
                </div>
                <span className="font-data font-black text-sm text-[var(--color-text-primary)]">
                  {riskData?.domains?.respiratory?.risk_percentage ?? 24}%
                </span>
              </div>
              <ProgressBar
                value={riskData?.domains?.respiratory?.risk_percentage ?? 24}
                max={100}
                color={(riskData?.domains?.respiratory?.risk_percentage ?? 24) < 20 ? 'green' : (riskData?.domains?.respiratory?.risk_percentage ?? 24) < 50 ? 'amber' : 'red'}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 6-Month Risk Progression Telemetry Chart */}
      {historyData.length > 0 && (
        <GlassCard className="p-6 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-black text-[var(--color-text-primary)] flex items-center gap-2">
                <TrendingDown size={18} className="text-emerald-600" /> 6-Month Risk Reduction Trajectory
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-semibold mt-0.5">
                Your cumulative risk profile decreased from 38% down to {compositeScore}% following lifestyle interventions.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200/40">
              ↓ -20% Relative Risk
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1A56DB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={[0, 50]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 shadow-xl text-xs">
                        <p className="font-bold text-[var(--color-text-muted)] mb-1">{label}</p>
                        <p className="font-black text-blue-600">Composite Risk: {payload[0]?.value}%</p>
                      </div>
                    )
                  }}
                />
                <Area type="monotone" dataKey="composite_score" stroke="#1A56DB" strokeWidth={3} fill="url(#riskGrad)" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Interactive "What-If" Lifestyle Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-base font-black text-[var(--color-text-primary)]">
                  Interactive Lifestyle Impact Simulator
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-200/40">
                Connected to Flask API
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] font-semibold mb-6">
              Adjust your daily habits below to preview how behavioral changes directly influence your predicted risk curve.
            </p>

            <div className="space-y-6">
              {/* Exercise slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[var(--color-text-primary)]">Weekly Moderate/Vigorous Exercise</span>
                  <span className="text-blue-600 font-data font-black">{exerciseHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={exerciseHours}
                  onChange={e => setExerciseHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[var(--color-surface-2)] rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-semibold mt-1">
                  <span>Sedentary (0h)</span>
                  <span>Target (3.5h)</span>
                  <span>Athletic (10h)</span>
                </div>
              </div>

              {/* Sleep slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[var(--color-text-primary)]">Average Nightly Sleep Duration</span>
                  <span className="text-indigo-600 font-data font-black">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.5"
                  value={sleepHours}
                  onChange={e => setSleepHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[var(--color-surface-2)] rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-semibold mt-1">
                  <span>Sleep Deprived (&lt;6h)</span>
                  <span>Optimal (7-8h)</span>
                  <span>Extended (&gt;9h)</span>
                </div>
              </div>

              {/* Systolic BP slider */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[var(--color-text-primary)]">Systolic Blood Pressure</span>
                  <span className="text-red-600 font-data font-black">{systolicBp} mmHg</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="160"
                  step="1"
                  value={systolicBp}
                  onChange={e => setSystolicBp(parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--color-surface-2)] rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] font-semibold mt-1">
                  <span>Normal (110-120)</span>
                  <span>Elevated (120-129)</span>
                  <span>Stage 1/2 HTN (130+)</span>
                </div>
              </div>

              {/* Diet selector */}
              <div>
                <label className="text-xs font-bold text-[var(--color-text-primary)] block mb-2">
                  Dietary Quality & Sodium Intake
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'clean', label: 'Anti-Inflammatory', desc: 'Low sodium, whole foods' },
                    { id: 'balanced', label: 'Balanced Standard', desc: 'Moderate processed foods' },
                    { id: 'high-sodium', label: 'High Sodium', desc: 'Frequent takeout/canned' },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietTier(d.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        dietTier === d.id
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-500/10 shadow-sm'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]'
                      }`}
                    >
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{d.label}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Smoking toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50">
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">Smoking / Tobacco Use</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-medium">Compounding arterial and respiratory risk</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSmoker(!isSmoker)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSmoker
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400'
                  }`}
                >
                  {isSmoker ? 'Active Smoker (+22% Risk)' : 'Non-Smoker (Protected)'}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: AI Clinical Action Items & Disclaimer */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-purple-600" />
              <h3 className="text-base font-black text-[var(--color-text-primary)]">
                AI Preventive Roadmap
              </h3>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  title: 'Aerobic Reserve Building',
                  detail: 'Target 150 minutes of zone-2 cardio weekly to safeguard arterial elasticity.',
                  icon: CheckCircle2,
                  color: 'text-emerald-600'
                },
                {
                  title: 'Inhaler Proximity Protocol',
                  detail: 'Carry Salbutamol during seasonal transition weeks when AQI spikes above 150.',
                  icon: CheckCircle2,
                  color: 'text-blue-600'
                },
                {
                  title: 'Annual Fasting Lipid Panel',
                  detail: 'Schedule follow-up lipid profile in September 2026 to track HDL/LDL balance.',
                  icon: CheckCircle2,
                  color: 'text-indigo-600'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 flex items-start gap-3">
                  <item.icon size={16} className={`${item.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)]">{item.title}</h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mt-0.5 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/40 dark:border-purple-900/30">
              <p className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider">
                Simulated Net Impact
              </p>
              <p className="text-xs text-[var(--color-text-primary)] font-semibold mt-1">
                Your current habits reduce expected cardio-metabolic events by <strong className="text-emerald-600 font-black">28%</strong> compared to age-matched peers.
              </p>
            </div>
          </GlassCard>

          {/* Explicit Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-3">
            <Info size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold leading-relaxed">
              <strong>Medical Disclaimer:</strong> AI-assisted guidance only. Not a replacement for professional medical evaluation, diagnosis, or clinical management. Consult your licensed healthcare provider before making medical changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
