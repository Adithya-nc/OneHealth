import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Calendar, Clock, TrendingUp, AlertCircle, FileText,
  Activity, ArrowRight, Star, MessageSquare, Search, Sparkles,
  ShieldAlert, CheckCircle2, Heart, Award, TrendingDown
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import { Button, GlassCard } from '../../components/ui'
import { cn } from '../../utils/formatters'

// Mock Data for Doctor Analytics & Trends
const DIAGNOSIS_TRENDS = [
  { name: 'Mon', count: 4, compliance: 85 },
  { name: 'Tue', count: 7, compliance: 88 },
  { name: 'Wed', count: 5, compliance: 82 },
  { name: 'Thu', count: 11, compliance: 90 },
  { name: 'Fri', count: 8, compliance: 94 },
  { name: 'Sat', count: 3, compliance: 96 },
  { name: 'Sun', count: 2, compliance: 98 },
]

const PIE_DATA = [
  { name: 'Positive', value: 85, color: '#0E9F6E' },
  { name: 'Neutral',  value: 10,  color: '#64748b' },
  { name: 'Negative', value: 5,  color: '#E02424' },
]

const RATING_DISTRIBUTION = [
  { stars: '5 Stars', count: 180, fill: 'var(--color-emerald-500)' },
  { stars: '4 Stars', count: 45,  fill: 'var(--color-primary-400)' },
  { stars: '3 Stars', count: 8,   fill: 'var(--color-amber-400)' },
  { stars: '2 Stars', count: 3,   fill: 'var(--color-warning)' },
  { stars: '1 Star',  count: 1,   fill: 'var(--color-danger)' },
]

const CLINICAL_ALERTS = [
  { type: 'Critical', patient: 'David Warner', id: 'P-9821', desc: 'Abnormal ECG telemetry log.', category: 'abnormal_reports', time: '5m ago', icon: ShieldAlert, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
  { type: 'High Risk', patient: 'Susan Clarke', id: 'P-3422', desc: 'Missed 3 medication doses (Amlodipine).', category: 'missed_medications', time: '20m ago', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { type: 'Urgent', patient: 'James Smith', id: 'P-4451', desc: 'Blood pressure spike (142/95 mmHg) logged.', category: 'urgent_followup', time: '1h ago', icon: Activity, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
]

const PATIENT_QUEUE = [
  { id: 1, patient: 'Michael Chang', patientId: 'P-9821', time: '09:00 AM', type: 'Follow-up', disease: 'Hypertension', priority: 'High', status: 'Waiting' },
  { id: 2, patient: 'Sarah Jenkins', patientId: 'P-3422', time: '09:45 AM', type: 'Consultation', disease: 'Cardiac Recovery', priority: 'Routine', status: 'Confirmed' },
  { id: 3, patient: 'Robert Fox', patientId: 'P-4451', time: '10:30 AM', type: 'Report Review', disease: 'Arrhythmia', priority: 'Critical', status: 'Confirmed' },
  { id: 4, patient: 'Emily Davis', patientId: 'P-8834', time: '11:15 AM', type: 'Consultation', disease: 'Mild Asthma', priority: 'Routine', status: 'Delayed' },
  { id: 5, patient: 'Priya Sharma', patientId: 'mock-uid-001', time: '12:00 PM', type: 'Consultation', disease: 'Anemia / Asthma', priority: 'High', status: 'Confirmed' },
]

// Custom CountUp Component
function CountUp({ value, suffix = '', duration = 1000 }) {
  const numericVal = parseFloat(value.replace(/,/g, '')) || 0
  const isFloat = value.includes('.')
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = numericVal / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numericVal) {
        setCount(numericVal)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [numericVal, duration])

  const formatted = isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString()
  return <span>{formatted}{suffix}</span>
}

export function Dashboard() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [queueTab, setQueueTab] = useState('today') // today | upcoming | priority
  const [alertFilter, setAlertFilter] = useState('all') // all | abnormal_reports | missed_medications | urgent_followup

  const stats = [
    { title: 'Total Patients Managed', value: '1248', icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', glow: 'hover:shadow-blue-500/15' },
    { title: "Today's Consultations", value: '14', icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', glow: 'hover:shadow-emerald-500/15' },
    { title: 'Pending Follow-ups', value: '8', icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', glow: 'hover:shadow-amber-500/15' },
    { title: 'AI Diagnostics Run', value: '384', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', glow: 'hover:shadow-purple-500/15' },
  ]

  // Filter Queue based on Search Bar and Queue Tabs
  const getFilteredQueue = () => {
    let list = PATIENT_QUEUE
    if (queueTab === 'upcoming') {
      list = PATIENT_QUEUE.filter(p => p.status === 'Confirmed' || p.status === 'Delayed')
    } else if (queueTab === 'priority') {
      list = PATIENT_QUEUE.filter(p => p.priority === 'High' || p.priority === 'Critical')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => 
        p.patient.toLowerCase().includes(q) ||
        p.disease.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q)
      )
    }
    return list
  }

  // Filter AI Clinical Alerts
  const getFilteredAlerts = () => {
    if (alertFilter === 'all') return CLINICAL_ALERTS
    return CLINICAL_ALERTS.filter(a => a.category === alertFilter)
  }

  const filteredQueue = getFilteredQueue()
  const filteredAlerts = getFilteredAlerts()

  return (
    <div className="space-y-6 relative z-10">
      
      {/* Doctor Hero Command Center Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[var(--color-border)]/50 pb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-500/15">
            DR
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              Welcome back, Dr. Sarah Smith 👋
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] font-semibold mt-1 flex flex-wrap items-center gap-2">
              <span>Cardiology Command Center</span>
              <span className="h-4 w-px bg-[var(--color-border)]" />
              <span className="text-emerald-600 font-bold">12 Patients Managed Today</span>
            </p>
          </div>
        </div>

        {/* Dynamic AI insights highlight */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-900/20 rounded-2xl max-w-md">
          <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={12} className="animate-pulse" /> AI Clinical Intelligence
          </p>
          <p className="text-xs text-[var(--color-text-primary)] mt-1 font-semibold leading-relaxed">
            James Smith's metrics stabilized. David Warner flagged with telemetry anomalies.
          </p>
        </div>
      </motion.div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className={cn('relative group cursor-pointer border-white/20 dark:border-white/5 shadow-xl', stat.glow)}>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">{stat.title}</p>
                  <h3 className="text-3xl font-black text-[var(--color-text-primary)] font-data">
                    <CountUp value={stat.value} suffix={stat.suffix || ''} />
                  </h3>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={cn('p-3 rounded-2xl shadow-sm transition-all duration-300', stat.bg)}
                >
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Patient Search Command Palette Card */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-3 items-center shadow-lg relative border-white/20 dark:border-white/5">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search command palette: filter patient queue by Name, Condition (e.g. Arrhythmia), or ID..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-[var(--color-text-muted)] text-slate-900 dark:text-white font-semibold"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
          <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-wider flex items-center border border-[var(--color-border)] px-3 py-2 rounded-xl bg-[var(--color-surface-2)]">
            Instant Filtering
          </span>
        </div>
      </GlassCard>

      {/* AI Clinical Intelligence & Patient Queue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patient Queue Command */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-0 border border-[var(--color-border)]/60 overflow-hidden shadow-2xl flex flex-col justify-between h-full">
            <div>
              {/* Header with queue navigation */}
              <div className="p-6 border-b border-[var(--color-border)]/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/40 dark:bg-slate-900/45">
                <div>
                  <h3 className="text-lg font-black text-[var(--color-text-primary)]">Patient Queue Command</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-semibold">Today's clinic visitation status</p>
                </div>
                
                {/* Tab selections */}
                <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]/55">
                  {[
                    { id: 'today', label: "Today's Queue" },
                    { id: 'upcoming', label: 'Confirmed Visits' },
                    { id: 'priority', label: 'Priority Alerts' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setQueueTab(tab.id)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                        queueTab === tab.id
                          ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table display */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/60 dark:bg-slate-800/40 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Patient Name</th>
                      <th className="px-6 py-4">Priority ID</th>
                      <th className="px-6 py-4">Disease/Condition</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Consult Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                    {filteredQueue.length > 0 ? (
                      filteredQueue.map((apt) => (
                        <motion.tr 
                          key={apt.id} 
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                          className="transition-colors group text-sm"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8.5 h-8.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-450 flex items-center justify-center font-black text-xs shadow-sm">
                                {apt.patient.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-bold text-[var(--color-text-primary)]">{apt.patient}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border shadow-sm', 
                              apt.priority === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' :
                              apt.priority === 'High' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              'bg-slate-50 border-slate-200 text-slate-600'
                            )}>
                              {apt.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-[var(--color-text-secondary)]">{apt.disease}</td>
                          <td className="px-6 py-4">
                            <span className={cn('text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border',
                              apt.status === 'Waiting' ? 'bg-amber-100/50 border-amber-200 text-amber-700' :
                              apt.status === 'Confirmed' ? 'bg-emerald-100/50 border-emerald-250 text-emerald-700' :
                              'bg-red-100/50 border-red-250 text-red-700'
                            )}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate(`/doctor/consultation/${apt.patientId}`)}
                              className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold h-8 px-3"
                            >
                              Start Consult <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[var(--color-text-muted)] font-semibold text-xs">
                          No patient matches found in queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Futuristic AI Clinical Intelligence Alerts */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col justify-between border-purple-250/20 dark:border-purple-900/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-[var(--color-text-primary)]">AI Clinical Alerts</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mt-0.5">Critical anomalies engine</p>
                </div>
                <span className="px-2.5 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider rounded-full animate-pulse">
                  {filteredAlerts.length} Urgent
                </span>
              </div>

              {/* Alert Category Filter Buttons */}
              <div className="flex flex-wrap gap-1 mb-4 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border)]/40">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'abnormal_reports', label: 'Reports' },
                  { id: 'missed_medications', label: 'Meds' },
                  { id: 'urgent_followup', label: 'Vitals' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setAlertFilter(f.id)}
                    className={cn(
                      'flex-1 text-[10px] font-bold py-1 px-2 rounded-lg transition-all capitalize',
                      alertFilter === f.id
                        ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-black'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                {filteredAlerts.map((alert, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.025, x: 2 }}
                    onClick={() => navigate(`/doctor/consultation/${alert.id}`)}
                    className="flex gap-3.5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group shadow-sm"
                  >
                    <div className={cn('p-2.5 rounded-xl h-fit shrink-0 relative', alert.bg)}>
                      {/* Pulse neon indicators */}
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-ping" />
                      <alert.icon className={cn('w-5 h-5', alert.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors">{alert.patient}</h4>
                        <span className="text-[9px] text-[var(--color-text-muted)] font-semibold">{alert.time}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-semibold">{alert.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <Button variant="ghost" className="w-full mt-6 text-purple-600 dark:text-purple-400 hover:bg-purple-500/5 font-bold text-xs" leftIcon={<Sparkles size={14} />}>
              Configure Telemetry Thresholds
            </Button>
          </GlassCard>
        </div>

      </div>

      {/* Analytics, Appreciations, and Sentiment row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sentiment Analytics */}
        <GlassCard className="p-5 shadow-lg relative border-white/20 dark:border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-[var(--color-text-primary)]">Clinical Sentiment AI</h3>
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mt-0.5">Patient satisfaction logs</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full text-xs shadow-sm">
              <Star size={12} className="fill-amber-400 text-amber-400" /> 4.8 / 5 Rating
            </div>
          </div>

          <div className="space-y-4">
            {/* Rating distribution bar lists */}
            <div className="space-y-2 border-b border-[var(--color-border)]/50 pb-4">
              {RATING_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-[var(--color-text-secondary)]">
                  <span className="w-12 text-left">{item.stars}</span>
                  <div className="flex-1 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.count / 237) * 100}%`, backgroundColor: item.fill }} />
                  </div>
                  <span className="w-8 text-right font-data">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs font-bold pt-1">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>85% Positive</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>10% Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>5% Negative</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Doctor Analytics (Diagnosis Trends & Follow-Up Compliance) */}
        <GlassCard className="p-5 shadow-lg lg:col-span-2 relative border-white/20 dark:border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-[var(--color-text-primary)]">Follow-up Compliance & Treated</h3>
              <p className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mt-0.5">Triage compliance trends</p>
            </div>
            <div className="flex gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Diagnosis Volume
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Compliance Index %
              </span>
            </div>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DIAGNOSIS_TRENDS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReportsDr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dx={-10} />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Diagnoses Treated" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReportsDr)" dot={{ r: 0 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="compliance" name="Compliance Index %" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompliance)" dot={{ r: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

    </div>
  )
}
