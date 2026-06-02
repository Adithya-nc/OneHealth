import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Stethoscope, Send, Sparkles, AlertTriangle, Pill, Check, Clock, Save, RefreshCw, X, HelpCircle
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Alert, GlassCard } from '../ui/index'
import { SeverityBadge } from '../ui/Badge'
import { useUserStore } from '../../store/userStore'
import { useRecordsStore } from '../../store/recordsStore'
import { useToast } from '../ui/Toast'
import { SYMPTOM_CATEGORIES } from '../../utils/constants'
import { cn } from '../../utils/formatters'

// Pre-packaged diagnostic AI response
const MOCK_AI_TRIAGE = {
  severity: 'medium',
  severity_explanation: 'Your symptoms suggest a common respiratory viral infection (such as Influenza or URI). Monitor parameters closely and seek care if fever persists.',
  possible_conditions: [
    { name: 'Viral URI (Common Cold)', explanation: 'A viral infection of the upper respiratory tract. Usually resolves in 7–10 days with rest.', confidence: 'high' },
    { name: 'Influenza (Flu)', explanation: 'Systemic viral infection characterized by sudden fever, muscle aches, and fatigue.', confidence: 'medium' },
    { name: 'Allergic Rhinitis', explanation: 'Nasal inflammation caused by environmental allergens.', confidence: 'low' },
  ],
  recommendations: [
    'Prioritize sleep and stay hydrated (2-3L fluid daily).',
    'Monitor body temperature every 4–6 hours.',
    'Use warm steam inhalation to relieve congestion.',
    'Isolate from vulnerable individuals to reduce spread.',
  ],
  otc_suggestions: [
    { medicine: 'Paracetamol 500mg', dosage_note: '1 tablet every 6 hours for fever/ache' },
    { medicine: 'Saline Nasal Spray', dosage_note: '2 sprays per nostril as needed' },
    { medicine: 'Cetirizine 10mg', dosage_note: '1 tablet at night for congestion' },
  ],
  warning_signs: [
    'Temperature exceeds 103°F (39.4°C)',
    'Difficulty breathing or chest tightness develops',
    'Symptoms worsen after 48 hours of care',
  ],
  seek_emergency: false,
}

export default function SymptomAnalyzer() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am your oneHealth AI Clinical Assistant. What symptoms are you experiencing today?",
      type: 'text'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [duration, setDuration] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [activeCategory, setActiveCategory] = useState('General')
  const [hasCompleted, setHasCompleted] = useState(false)

  const messagesEndRef = useRef(null)
  const addRecord = useRecordsStore(s => s.addRecord)
  const toast = useToast()

  const categories = Object.keys(SYMPTOM_CATEGORIES)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const handleSendCustomMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    setSelectedSymptoms(prev => [...prev, userText])
    
    // Add user message to chat
    setMessages(prev => [
      ...prev,
      { id: `msg-${Date.now()}`, sender: 'user', text: userText, type: 'text' }
    ])
    setInputValue('')
  }

  const handleStartAnalysis = async () => {
    if (selectedSymptoms.length === 0) {
      toast.warning('No Symptoms', 'Please enter or select at least one symptom.')
      return
    }
    if (!duration) {
      toast.warning('Duration Required', 'Please select the duration of your symptoms.')
      return
    }

    // Add user summary trigger message
    const triggerText = `Analyze symptoms: ${selectedSymptoms.join(', ')} (Duration: ${duration})`
    setMessages(prev => [
      ...prev,
      { id: `msg-trigger-${Date.now()}`, sender: 'user', text: triggerText, type: 'text' }
    ])

    setIsThinking(true)

    // Simulate AI thinking and analysis
    await new Promise(r => setTimeout(r, 2600))
    setIsThinking(false)

    // Add AI result card message
    setMessages(prev => [
      ...prev,
      {
        id: `msg-res-${Date.now()}`,
        sender: 'ai',
        text: "I have compiled your clinical triage analysis based on your symptoms and timeline logs.",
        type: 'result',
        result: MOCK_AI_TRIAGE
      }
    ])
    setHasCompleted(true)
  }

  const handleSaveToPassport = () => {
    addRecord({
      id: `rec-${Date.now()}`,
      type: 'symptom_check',
      date: new Date().toISOString().split('T')[0],
      title: `AI Symptom Check: ${selectedSymptoms.slice(0, 2).join(', ')}${selectedSymptoms.length > 2 ? '...' : ''}`,
      metadata: { doctor_name: 'oneHealth AI', hospital: '', notes: `Duration: ${duration}. Severity: ${MOCK_AI_TRIAGE.severity}` },
      ai_analysis: { summary: MOCK_AI_TRIAGE.severity_explanation, suggested_actions: MOCK_AI_TRIAGE.recommendations },
    })
    toast.success('Saved to Passport', 'This symptom check has been saved to your Health Passport logs.')
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "Hello! I am your oneHealth AI Clinical Assistant. What symptoms are you experiencing today?",
        type: 'text'
      }
    ])
    setSelectedSymptoms([])
    setDuration('')
    setHasCompleted(false)
    toast.info('Chat Cleared', 'Conversation history has been reset.')
  }

  return (
    <div className="page-container py-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] relative z-10">
      {/* ChatGPT Layout Shell */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 relative shadow-2xl border-white/20 dark:border-white/5 h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]/55 bg-white/45 dark:bg-slate-900/45">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Stethoscope size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-sm text-[var(--color-text-primary)]">Gemini Clinical Assistant</h2>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Online Triage Node
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw size={12} />} onClick={handleReset} className="h-8 text-xs font-bold bg-white/60 dark:bg-slate-900/60 border-[var(--color-border)]">
            Reset Chat
          </Button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div className={cn('max-w-[85%] flex items-start gap-2.5', msg.sender === 'user' && 'flex-row-reverse')}>
                  {/* Avatar Icon */}
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm', 
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  )}>
                    {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
                  </div>

                  {/* Message Bubble Content */}
                  <div className="space-y-3 flex flex-col">
                    <div className={cn('p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm',
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[var(--color-surface-2)]/80 text-[var(--color-text-primary)] rounded-tl-none border border-[var(--color-border)]/50'
                    )}>
                      {msg.text}
                    </div>

                    {/* Nested Triage Results if type is 'result' */}
                    {msg.type === 'result' && msg.result && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 mt-2 max-w-full"
                      >
                        {/* Severity Banner */}
                        <div className={cn('rounded-2xl border p-4 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 border-amber-200/50')}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} className="text-amber-600 animate-bounce" />
                            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-450">Triage Assessment</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {msg.result.severity_explanation}
                          </p>
                        </div>

                        {/* Possible Conditions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <GlassCard className="p-4 border-[var(--color-border)]/50">
                            <h4 className="font-bold text-xs text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
                              <Sparkles size={12} className="text-purple-500" /> Possible Diagnoses
                            </h4>
                            <div className="space-y-2">
                              {msg.result.possible_conditions.map((c, i) => (
                                <div key={i} className="p-2 rounded-lg bg-[var(--color-surface-2)]/60 border border-[var(--color-border)]/40 text-[11px]">
                                  <div className="flex justify-between font-bold text-[var(--color-text-primary)]">
                                    <span>{c.name}</span>
                                    <span className="text-[9px] text-emerald-600 font-bold uppercase">{c.confidence} MATCH</span>
                                  </div>
                                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{c.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>

                          {/* Action Recommendations */}
                          <GlassCard className="p-4 border-[var(--color-border)]/50">
                            <h4 className="font-bold text-xs text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
                              <Check size={12} className="text-emerald-500" /> Recommendations
                            </h4>
                            <ul className="space-y-2 text-[11px] text-[var(--color-text-secondary)] font-semibold">
                              {msg.result.recommendations.map((r, i) => (
                                <li key={i} className="flex gap-2 leading-relaxed">
                                  <span className="text-emerald-500">✓</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </GlassCard>
                        </div>

                        {/* Medicine OTC Suggestions */}
                        <GlassCard className="p-4 border-[var(--color-border)]/50">
                          <h4 className="font-bold text-xs text-[var(--color-text-primary)] mb-3 flex items-center gap-1.5">
                            <Pill size={12} className="text-blue-500" /> Suggested OTC Medications
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {msg.result.otc_suggestions.map((m, i) => (
                              <div key={i} className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
                                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">{m.medicine}</p>
                                <p className="text-[10px] text-blue-700 dark:text-blue-450 mt-0.5">{m.dosage_note}</p>
                              </div>
                            ))}
                          </div>
                        </GlassCard>

                        {/* Warning signs & save button */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button size="sm" leftIcon={<Save size={12} />} onClick={handleSaveToPassport} className="flex-1 text-xs font-bold h-9">
                            Save Analysis to Passport
                          </Button>
                          <Button size="sm" variant="outline" leftIcon={<RefreshCw size={12} />} onClick={handleReset} className="flex-1 text-xs font-bold h-9 bg-white dark:bg-slate-900 border-[var(--color-border)] text-[var(--color-text-secondary)]">
                            Start New Assessment
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles size={14} className="text-white animate-pulse" />
                  </div>
                  <div className="bg-[var(--color-surface-2)]/80 text-[var(--color-text-primary)] rounded-2xl rounded-tl-none border border-[var(--color-border)]/50 px-4 py-3.5 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Bottom Control Panel (suggestions + duration + input form) */}
        <div className="px-6 py-5 border-t border-[var(--color-border)]/55 bg-white/45 dark:bg-slate-900/45 space-y-4">
          
          {/* Quick chips selector (Category + Symptom list) only if not completed */}
          {!hasCompleted && (
            <div className="space-y-3">
              {/* Category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300',
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-[var(--color-surface-2)]/80 text-[var(--color-text-secondary)] border border-[var(--color-border)]/30 hover:border-slate-350'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Selected symptoms checklist display */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-1">
                {SYMPTOM_CATEGORIES[activeCategory]?.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom)
                  return (
                    <motion.button
                      key={symptom}
                      whileHover={{ y: -1 }}
                      onClick={() => toggleSymptom(symptom)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all duration-300',
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-500'
                      )}
                    >
                      {isSelected ? '✓ ' : ''}{symptom}
                    </motion.button>
                  )
                })}
              </div>

              {/* Duration picker */}
              <div className="flex items-center gap-3 border-t border-[var(--color-border)]/40 pt-3">
                <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1">
                  <Clock size={12} className="text-blue-500" /> Duration:
                </span>
                <div className="flex gap-1.5 overflow-x-auto">
                  {[
                    { value: '1_day', label: '1 Day' },
                    { value: 'few_days', label: '2-3 Days' },
                    { value: 'week', label: '1 Week' },
                    { value: 'chronic', label: '1 Month+' },
                  ].map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-[10px] font-bold border transition-all duration-300',
                        duration === d.value
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-slate-350'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Input panel */}
          <form onSubmit={handleSendCustomMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={hasCompleted}
              placeholder={hasCompleted ? "AI analysis completed. Clear chat to restart." : "Describe other signs (e.g. sore throat, congestion)..."}
              className="flex-1 h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
            />
            
            {!hasCompleted ? (
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  variant="outline"
                  className="h-11 px-4 text-xs font-bold bg-white dark:bg-slate-900 border-[var(--color-border)]"
                >
                  Add Symptom
                </Button>
                <Button 
                  type="button" 
                  onClick={handleStartAnalysis}
                  disabled={selectedSymptoms.length === 0 || !duration}
                  className="h-11 px-5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg shadow-blue-500/10"
                  leftIcon={<Sparkles size={14} />}
                >
                  Analyze with AI
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                onClick={handleReset}
                className="h-11 px-5 text-xs font-bold"
                leftIcon={<RefreshCw size={14} />}
              >
                Clear & Restart
              </Button>
            )}
          </form>
        </div>
      </GlassCard>
    </div>
  )
}

function User(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
