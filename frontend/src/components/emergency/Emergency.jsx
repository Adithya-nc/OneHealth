import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, AlertTriangle, Heart, Pill, Droplet,
  Share2, QrCode, Copy, Check, Mic, X, ChevronDown,
  Shield, Clock, Siren, HeartPulse
} from 'lucide-react'
import { useUserStore } from '../../store/userStore'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Alert } from '../ui/index'
import { GlassCard } from '../ui/Card'
import { cn } from '../../utils/formatters'

function DataSection({ icon: Icon, title, children, iconColor = 'text-[var(--color-primary)]', bgColor = 'bg-blue-50' }) {
  return (
    <GlassCard className="overflow-hidden border border-white/20 dark:border-white/5 p-0 relative shadow-lg">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]/50 bg-white/40 dark:bg-slate-900/40">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, 0] }}
          className={cn('p-2.5 rounded-xl shadow-sm', bgColor)}
        >
          <Icon size={18} className={iconColor} />
        </motion.div>
        <h3 className="font-black text-base text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="p-5 relative z-10">{children}</div>
    </GlassCard>
  )
}

function ContactButton({ contact, index }) {
  return (
    <motion.a
      href={`tel:${contact.phone}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface-2)]/60 hover:bg-green-50/50 dark:hover:bg-green-500/5 hover:border-green-500/30 border border-transparent transition-all duration-300 group"
    >
      <div className="flex-1 min-w-0">
        <p className="font-black text-base text-[var(--color-text-primary)] truncate">{contact.name}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] font-black uppercase tracking-widest mt-0.5">{contact.relationship}</p>
        <p className="text-sm text-[var(--color-text-secondary)] font-semibold mt-1">{contact.phone}</p>
      </div>
      <motion.div 
        whileHover={{ rotate: 15 }}
        className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/10 group-hover:bg-green-600 flex items-center justify-center transition-colors duration-300 shadow-md group-hover:shadow-green-500/20"
      >
        <Phone size={20} className="text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
      </motion.div>
    </motion.a>
  )
}

function AIGuidancePanel() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const MOCK_RESULT = {
    risk_level: 'critical',
    possible_emergency: 'Possible Cardiac Event (Acute MI)',
    immediate_instructions: [
      'Have the patient sit or lie down in a comfortable position immediately.',
      'Loosen any tight clothing around the chest and neck.',
      'If the patient takes prescribed nitroglycerin, help them take it now.',
      'Keep the patient calm and still — avoid any physical exertion.',
      'Begin CPR if the patient becomes unresponsive and stops breathing.',
    ],
    call_emergency_services: true,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2200))
    setResult(MOCK_RESULT)
    setLoading(false)
  }

  return (
    <GlassCard className="border-2 border-red-500/40 p-0 overflow-hidden shadow-2xl relative">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 flex items-center gap-3 relative overflow-hidden">
        {/* Pulsing signal glow overlay */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" />
        <Siren size={20} className="text-white animate-bounce" />
        <h3 className="font-black text-white text-base">AI Live Emergency Assistant</h3>
      </div>
      <div className="p-6 relative z-10 space-y-4">
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Describe current symptoms to receive immediate first-responder instructions.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g., crushing chest pain, difficulty catching breath..."
                className="flex-1 h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/80 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] font-semibold"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" 
                className="h-11 w-11 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <Mic size={18} />
              </motion.button>
            </div>
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Button
                type="submit"
                variant="destructive"
                className="w-full h-11 font-bold shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300"
                isLoading={loading}
              >
                {loading ? 'Processing...' : 'Get AI First-Response Steps'}
              </Button>
            </motion.div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            {result.call_emergency_services && (
              <motion.div
                animate={{ scale: [1, 1.02, 1], boxShadow: ['0 0 10px rgba(224,36,36,0.2)', '0 0 20px rgba(224,36,36,0.5)', '0 0 10px rgba(224,36,36,0.2)'] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="bg-red-600 text-white p-4 rounded-2xl font-black text-center text-lg flex items-center justify-center gap-3 cursor-pointer shadow-lg"
              >
                <Phone size={24} className="animate-pulse" />
                CALL emergency (112) IMMEDIATELY
              </motion.div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-1">Identified Risk State</p>
              <p className="text-xl font-black text-[var(--color-danger)] flex items-center gap-2">
                <AlertTriangle size={20} className="animate-bounce" /> {result.possible_emergency}
              </p>
            </div>
            <div className="border-t border-[var(--color-border)]/50 pt-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Immediate Actions to Take</p>
              <ol className="space-y-3">
                {result.immediate_instructions.map((inst, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 text-sm font-semibold text-[var(--color-text-primary)]"
                  >
                    <span className="w-6.5 h-6.5 rounded-full bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5 shadow-sm">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
            <Button variant="outline" className="w-full h-11 font-bold mt-2" onClick={() => { setResult(null); setQuery('') }}>
              Reset Assessment
            </Button>
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}

export default function Emergency() {
  const profile = useUserStore(s => s.profile)
  const p = profile?.profile

  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `https://onehealth.in/emergency/${profile?.uid || 'demo-user'}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const bloodGroupColors = {
    'O+': 'from-red-500 to-rose-600 shadow-rose-500/25',
    'O-': 'from-red-500 to-rose-600 shadow-rose-500/25',
    'A+': 'from-red-500 to-orange-600 shadow-orange-500/25',
    'A-': 'from-red-500 to-orange-600 shadow-orange-500/25',
    'B+': 'from-red-500 to-pink-600 shadow-pink-500/25',
    'B-': 'from-red-500 to-pink-600 shadow-pink-500/25',
    'AB+': 'from-red-500 to-purple-600 shadow-purple-500/25',
    'AB-': 'from-red-500 to-purple-600 shadow-purple-500/25',
  }
  const bgGradient = bloodGroupColors[p?.blood_group] || 'from-red-500 to-rose-600 shadow-rose-500/25'

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-12 transition-colors duration-300">
      {/* Red Emergency Header with pulse animations */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white relative overflow-hidden shadow-lg shadow-red-700/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="page-container py-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 10px rgba(255,255,255,0.2)', '0 0 25px rgba(255,255,255,0.6)', '0 0 10px rgba(255,255,255,0.2)'] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-lg"
              >
                <AlertTriangle size={32} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">EMERGENCY CARD</h1>
                <p className="text-red-100 text-sm font-semibold opacity-90">Medical Passport Access for First Responders</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShareOpen(true)}
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white border h-11 px-5"
                leftIcon={<Share2 size={16} />}
              >
                Share Card
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* Patient Identity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-red-500/40 bg-[var(--color-surface)]/60 backdrop-blur-xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />
          <div className="bg-red-500/[0.03] dark:bg-red-500/5 px-6 py-6 flex flex-col sm:flex-row items-center sm:justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/20 dark:to-red-900/20 flex items-center justify-center text-3xl font-black text-red-800 dark:text-red-400 flex-shrink-0 shadow-inner"
              >
                {profile?.name?.split(' ').map(n => n[0]).join('') || 'PS'}
              </motion.div>
              <div>
                <h2 className="text-3xl font-black text-[var(--color-text-primary)]">{profile?.name || 'Priya Sharma'}</h2>
                <div className="flex flex-wrap gap-2.5 mt-1.5 items-center">
                  {p?.dob && <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{new Date().getFullYear() - new Date(p.dob).getFullYear()} years old</span>}
                  <span className="text-sm text-[var(--color-text-muted)]">·</span>
                  {p?.gender && <span className="text-sm font-semibold text-[var(--color-text-secondary)]">{p.gender}</span>}
                </div>
              </div>
            </div>
            
            {/* HUGE Blood Group Indicator */}
            <div className="flex-shrink-0 text-center">
              <motion.div 
                whileHover={{ scale: 1.08 }}
                className={cn('bg-gradient-to-br text-white w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border border-white/20', bgGradient)}
              >
                <div>
                  <p className="text-4xl font-black leading-none">{p?.blood_group || 'O+'}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-85 mt-1.5">Blood Type</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 2-column grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Allergies */}
          <DataSection icon={AlertTriangle} title="Known Allergies" iconColor="text-red-600" bgColor="bg-red-50 dark:bg-red-500/10">
            {p?.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {p.allergies.map(a => (
                  <motion.span 
                    key={a} 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-2xl font-bold text-sm border border-red-200 dark:border-red-500/10 shadow-sm"
                  >
                    ⚠ {a}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] font-semibold text-sm">No known clinical allergies reported.</p>
            )}
          </DataSection>

          {/* Chronic Diseases */}
          <DataSection icon={Heart} title="Chronic Conditions" iconColor="text-orange-600" bgColor="bg-orange-50 dark:bg-orange-500/10">
            {p?.chronic_diseases?.length > 0 ? (
              <ul className="space-y-3 font-semibold text-sm">
                {p.chronic_diseases.map(d => (
                  <motion.li 
                    key={d} 
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2.5 text-[var(--color-text-primary)]"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0 animate-pulse" />
                    {d}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--color-text-muted)] font-semibold text-sm">No chronic health conditions recorded.</p>
            )}
          </DataSection>

          {/* Current Medications */}
          <DataSection icon={Pill} title="Current Medications" iconColor="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-500/10">
            <div className="space-y-3">
              {[
                { name: 'Salbutamol 100mcg', dosage: '2 puffs as needed' },
                { name: 'Amlodipine 5mg', dosage: '1 tablet daily (morning)' },
              ].map((med, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -2 }}
                  className="p-4 bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/50 rounded-2xl transition-all duration-300"
                >
                  <p className="font-bold text-sm text-[var(--color-text-primary)]">{med.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{med.dosage}</p>
                </motion.div>
              ))}
            </div>
          </DataSection>

          {/* Emergency Contacts */}
          <DataSection icon={Phone} title="Emergency Contacts" iconColor="text-green-600" bgColor="bg-green-50 dark:bg-green-500/10">
            <div className="space-y-3">
              {p?.emergency_contacts?.map((c, i) => (
                <ContactButton key={i} contact={c} index={i} />
              ))}
            </div>
          </DataSection>
        </div>

        {/* AI Emergency Guidance */}
        <div className="relative z-10">
          <AIGuidancePanel />
        </div>
      </div>

      {/* Share Modal */}
      <Modal isOpen={shareOpen} onClose={() => setShareOpen(false)} title="Share Emergency Card" description="Generate a shareable link for first responders." size="sm">
        <div className="p-6 space-y-4">
          <Alert type="warning" title="Valid for 24 hours">
            Anyone with this link can view your emergency card without logging in.
          </Alert>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 h-10 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text-primary)] focus:outline-none"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              leftIcon={copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex flex-col items-center gap-3 py-4 bg-[var(--color-surface-2)] rounded-xl">
            <QrCode size={80} className="text-[var(--color-text-secondary)]" />
            <p className="text-xs text-[var(--color-text-muted)]">Scan QR code to view emergency card</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
