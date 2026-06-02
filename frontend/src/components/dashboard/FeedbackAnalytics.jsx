import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Send, Sparkles, ThumbsUp, ThumbsDown,
  Minus, TrendingUp, TrendingDown, Star, BarChart3,
  Hash, Tag, RefreshCw, Award, User, Heart, Clock, Check,
  AlertTriangle, Calendar, StarHalf, FileText
} from 'lucide-react'
import {
  ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area,
  BarChart, Bar, Cell
} from 'recharts'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/Card'
import { Alert, Spinner } from '../ui/index'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/formatters'

// Doctor Profile Info Mock
const DOCTOR_INFO = {
  name: 'Dr. Sarah Smith',
  specialization: 'Cardiologist',
  hospital: 'City Health Hospital',
  date: 'June 1, 2026',
  initials: 'SS',
}

// Initial Mock Reviews and stats for the Analytics dashboard
const INITIAL_STATS = {
  satisfaction: 88,
  averageRating: 4.6,
  positivePct: 92,
  negativePct: 8,
  topPositive: 'Friendly Doctor',
  topComplaint: 'Long Waiting Time',
}

const INITIAL_RATING_DIST = [
  { stars: '5 Stars', count: 120, pct: 60, fill: 'var(--color-emerald-500)' },
  { stars: '4 Stars', count: 60,  pct: 30, fill: 'var(--color-primary-400)' },
  { stars: '3 Stars', count: 12,  pct: 6,  fill: 'var(--color-amber-400)' },
  { stars: '2 Stars', count: 5,   pct: 2.5,fill: 'var(--color-warning)' },
  { stars: '1 Star',  count: 3,   pct: 1.5,fill: 'var(--color-danger)' },
]

const INITIAL_TREND = [
  { month: 'Jan', satisfaction: 84 },
  { month: 'Feb', satisfaction: 86 },
  { month: 'Mar', satisfaction: 85 },
  { month: 'Apr', satisfaction: 89 },
  { month: 'May', satisfaction: 87 },
  { month: 'Jun', satisfaction: 88 },
]

const QUESTIONS = [
  { id: 1, text: "How would you rate the doctor's communication?" },
  { id: 2, text: "How well did the doctor explain your condition?" },
  { id: 3, text: "How satisfied are you with the treatment provided?" },
  { id: 4, text: "How would you rate the doctor's professionalism?" },
  { id: 5, text: "How likely are you to recommend this doctor?" },
  { id: 6, text: "How satisfied were you with the hospital experience?" },
  { id: 7, text: "How would you rate the waiting time?" },
  { id: 8, text: "Overall satisfaction with the consultation?" }
]

const POSITIVE_TAGS = [
  "Friendly Doctor",
  "Clear Explanation",
  "Professional",
  "Helpful Staff",
  "Quick Service",
  "Good Treatment"
]

const NEGATIVE_TAGS = [
  "Long Waiting Time",
  "Poor Communication",
  "Expensive",
  "Confusing Instructions",
  "Unfriendly Staff"
]

const RATING_SCALE = {
  1: { label: 'Poor', color: 'text-red-500 hover:bg-red-50 hover:border-red-500 selected:bg-red-500 selected:text-white', activeBg: 'bg-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  2: { label: 'Fair', color: 'text-orange-500 hover:bg-orange-50 hover:border-orange-500 selected:bg-orange-500 selected:text-white', activeBg: 'bg-orange-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  3: { label: 'Good', color: 'text-yellow-500 hover:bg-yellow-50 hover:border-yellow-500 selected:bg-yellow-500 selected:text-white', activeBg: 'bg-yellow-500', glow: 'shadow-[0_0_15px_rgba(252,211,77,0.5)]' },
  4: { label: 'Very Good', color: 'text-emerald-400 hover:bg-emerald-50 hover:border-emerald-400 selected:bg-emerald-500 selected:text-white', activeBg: 'bg-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
  5: { label: 'Excellent', color: 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 selected:bg-emerald-600 selected:text-white', activeBg: 'bg-emerald-600', glow: 'shadow-[0_0_15px_rgba(5,150,105,0.5)]' }
}

export default function FeedbackAnalytics() {
  const [activeTab, setActiveTab] = useState('survey') // survey | analytics
  const [ratings, setRatings] = useState({}) // { questionId: value }
  const [hoveredRatings, setHoveredRatings] = useState({}) // { questionId: value }
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  
  // Dynamic stats that update on review submission
  const [stats, setStats] = useState(INITIAL_STATS)
  const [ratingDist, setRatingDist] = useState(INITIAL_RATING_DIST)
  const [trendData, setTrendData] = useState(INITIAL_TREND)

  const toast = useToast()

  const handleRatingClick = (questionId, value) => {
    setRatings(prev => ({ ...prev, [questionId]: value }))
  }

  const handleRatingHover = (questionId, value) => {
    setHoveredRatings(prev => ({ ...prev, [questionId]: value }))
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if at least 1 question is rated
    if (Object.keys(ratings).length === 0) {
      toast.warning('Ratings Required', 'Please rate at least one question before submitting.')
      return
    }

    setSubmitting(true)
    
    // Simulate complex sentiment analysis and write to database
    await new Promise(r => setTimeout(r, 2200))
    
    // Calculate custom average based on active answers
    const ratingsArray = Object.values(ratings)
    const avgScore = ratingsArray.reduce((acc, curr) => acc + curr, 0) / ratingsArray.length
    const satisfactionScore = Math.round((avgScore / 5) * 100)

    // Generate dynamic sentiment response
    const sentiment = avgScore >= 3.8 ? 'Positive' : avgScore >= 2.5 ? 'Neutral' : 'Negative'
    const confidence = Math.round(85 + Math.random() * 14)
    
    const positiveThemes = selectedTags.filter(t => POSITIVE_TAGS.includes(t))
    const negativeThemes = selectedTags.filter(t => NEGATIVE_TAGS.includes(t))

    // Fallback if no tags selected
    if (positiveThemes.length === 0 && avgScore >= 3.5) {
      positiveThemes.push('Communication', 'Professionalism')
    }
    if (negativeThemes.length === 0 && avgScore < 3.5) {
      negativeThemes.push('Waiting Time')
    }

    const generatedAnalysis = {
      sentiment,
      confidence,
      positiveThemes,
      negativeThemes,
      keyInsights: comment.trim() 
        ? `The patient shared: "${comment.trim()}". AI sentiment extraction confirms high clinical trust with minor notes regarding efficiency.`
        : `Strong satisfaction observed in general clinical interaction. The patient rated the doctor ${avgScore.toFixed(1)}/5 stars, indicating good doctor alignment.`
    }

    // Update state variables to simulate real-time dashboard updates
    setAnalysisResult(generatedAnalysis)
    
    // Update Global Analytics stats
    setStats(prev => {
      const newSatisfy = Math.round((prev.satisfaction + satisfactionScore) / 2)
      const newAvgRating = parseFloat(((prev.averageRating + avgScore) / 2).toFixed(1))
      return {
        ...prev,
        satisfaction: newSatisfy,
        averageRating: newAvgRating,
        topPositive: positiveThemes[0] || prev.topPositive,
        topComplaint: negativeThemes[0] || prev.topComplaint,
      }
    })

    // Update Rating distribution
    setRatingDist(prev => {
      const roundedStars = Math.round(avgScore)
      return prev.map(item => {
        const starVal = parseInt(item.stars)
        if (starVal === roundedStars) {
          const newCount = item.count + 1
          return { ...item, count: newCount }
        }
        return item
      })
    })

    // Update trend data
    setTrendData(prev => [
      ...prev.slice(0, prev.length - 1),
      { month: 'Jun', satisfaction: Math.round((prev[prev.length - 1].satisfaction + satisfactionScore) / 2) }
    ])

    setSubmitting(false)
    toast.success('Feedback Saved', 'Your healthcare rating has been analyzed and recorded.')
  }

  const handleResetSurvey = () => {
    setRatings({})
    setHoveredRatings({})
    setComment('')
    setSelectedTags([])
    setAnalysisResult(null)
    toast.info('Survey Reset', 'You can submit another feedback card now.')
  }

  return (
    <div className="page-container py-6 space-y-6 relative z-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Rate Your Healthcare Experience</h1>
          <p className="text-[var(--color-text-secondary)] mt-1.5 text-sm">
            Help us improve healthcare quality by sharing your experience.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1.5 p-1 bg-[var(--color-surface-2)] rounded-2xl w-fit border border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab('survey')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300',
              activeTab === 'survey'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            Feedback Survey
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300',
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            Analytics Insights
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'survey' ? (
          <motion.div
            key="survey-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Col: Doctor Card & Quick Actions */}
            <div className="space-y-6 lg:col-span-1">
              {/* Doctor Information Card */}
              <GlassCard className="p-0 overflow-hidden relative shadow-2xl border-white/20 dark:border-white/5">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black text-white shadow-inner flex-shrink-0">
                      {DOCTOR_INFO.initials}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Recent Visit</p>
                      <h3 className="text-xl font-black">{DOCTOR_INFO.name}</h3>
                      <p className="text-xs font-semibold opacity-90">{DOCTOR_INFO.specialization}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 text-sm font-semibold">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-3">
                    <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Hospital</span>
                    <span className="text-[var(--color-text-primary)]">{DOCTOR_INFO.hospital}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-3">
                    <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Date</span>
                    <span className="text-[var(--color-text-primary)]">{DOCTOR_INFO.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">Consultation Status</span>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>
              </GlassCard>

              {/* Sentiment Results overlay if analyzed */}
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <GlassCard className="border-emerald-300 dark:border-emerald-950 p-6 space-y-4 shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} className="text-emerald-500 animate-pulse" />
                      <h3 className="font-black text-base text-[var(--color-text-primary)]">AI Sentiment Analysis</h3>
                    </div>

                    <div className="space-y-3.5 pt-2 border-t border-[var(--color-border)]/50">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-[var(--color-text-secondary)]">Overall Sentiment</span>
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-550/10 text-emerald-800 dark:text-emerald-400 rounded-full font-black text-xs uppercase tracking-wider">
                          {analysisResult.sentiment}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-[var(--color-text-secondary)]">Confidence Score</span>
                        <span className="text-emerald-600 font-data font-black text-lg">{analysisResult.confidence}%</span>
                      </div>

                      {analysisResult.positiveThemes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Positive Themes</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.positiveThemes.map(t => (
                              <span key={t} className="text-xs px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/10 text-emerald-700 dark:text-emerald-450 rounded-full font-bold">
                                ✓ {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisResult.negativeThemes.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">Negative Themes</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.negativeThemes.map(t => (
                              <span key={t} className="text-xs px-2.5 py-0.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-550/10 text-red-650 dark:text-red-400 rounded-full font-bold">
                                ✗ {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-[var(--color-border)]/50 pt-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Key Insights</p>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-semibold italic">
                          {analysisResult.keyInsights}
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleResetSurvey} className="w-full mt-4" variant="outline">
                      Submit New Review
                    </Button>
                  </GlassCard>
                </motion.div>
              )}
            </div>

            {/* Right Col: Rating Survey */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6 relative shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating Questions List */}
                  <div className="space-y-6 divide-y divide-[var(--color-border)]/40">
                    {QUESTIONS.map((q, idx) => {
                      const activeVal = ratings[q.id]
                      const hoveredVal = hoveredRatings[q.id]
                      const currentVal = hoveredVal || activeVal
                      const displayScale = RATING_SCALE[currentVal] || {}

                      return (
                        <div key={q.id} className={cn('pt-5', idx === 0 && 'pt-0')}>
                          <h4 className="font-bold text-sm text-[var(--color-text-primary)] mb-4">
                            {q.id}. {q.text}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(val => {
                                const isSelected = ratings[q.id] === val
                                const isHovered = hoveredRatings[q.id] === val
                                const cfg = RATING_SCALE[val]

                                return (
                                  <motion.button
                                    key={val}
                                    type="button"
                                    onClick={() => handleRatingClick(q.id, val)}
                                    onMouseEnter={() => handleRatingHover(q.id, val)}
                                    onMouseLeave={() => handleRatingHover(q.id, null)}
                                    whileHover={{ scale: 1.25, z: 20 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                      'w-11 h-11 rounded-full border-2 flex items-center justify-center font-black text-sm transition-all duration-300 relative',
                                      isSelected
                                        ? `${cfg.activeBg} text-white border-transparent ${cfg.glow}`
                                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-slate-400'
                                    )}
                                  >
                                    {val}
                                    {isHovered && (
                                      <motion.div
                                        layoutId={`bubble-tooltip-${q.id}`}
                                        className="absolute -top-7 px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] whitespace-nowrap pointer-events-none"
                                      >
                                        {cfg.label}
                                      </motion.div>
                                    )}
                                  </motion.button>
                                )
                              })}
                            </div>
                            
                            {/* Selected rating label feedback */}
                            {currentVal && (
                              <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn('text-xs font-black uppercase tracking-wider ml-2', RATING_SCALE[currentVal]?.color.split(' ')[0])}
                              >
                                {displayScale.label}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Quick Tags */}
                  <div className="border-t border-[var(--color-border)]/50 pt-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">Select tags that describe your visit</h4>
                      <p className="text-xs text-[var(--color-text-muted)]">Select multiple items if applicable.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Positive Flags</p>
                        <div className="flex flex-wrap gap-2">
                          {POSITIVE_TAGS.map(tag => {
                            const isSelected = selectedTags.includes(tag)
                            return (
                              <motion.button
                                key={tag}
                                type="button"
                                whileHover={{ y: -1 }}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300',
                                  isSelected
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-550/15 dark:text-emerald-450 shadow-md shadow-emerald-500/10'
                                    : 'bg-[var(--color-surface-2)]/60 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-slate-350'
                                )}
                              >
                                {isSelected ? '✓ ' : ''}{tag}
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-650 mb-2">Negative Flags</p>
                        <div className="flex flex-wrap gap-2">
                          {NEGATIVE_TAGS.map(tag => {
                            const isSelected = selectedTags.includes(tag)
                            return (
                              <motion.button
                                key={tag}
                                type="button"
                                whileHover={{ y: -1 }}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300',
                                  isSelected
                                    ? 'bg-red-50 border-red-300 text-red-800 dark:bg-red-550/15 dark:text-red-400 shadow-md shadow-red-500/10'
                                    : 'bg-[var(--color-surface-2)]/60 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-slate-350'
                                )}
                              >
                                {isSelected ? '✗ ' : ''}{tag}
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Feedback Textarea */}
                  <div className="border-t border-[var(--color-border)]/50 pt-6 space-y-2">
                    <label htmlFor="survey-feedback" className="block text-sm font-bold text-[var(--color-text-primary)]">Additional Comments</label>
                    <textarea
                      id="survey-feedback"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Tell us more about your experience... e.g. The doctor explained everything clearly and was very supportive."
                      rows={3}
                      className="w-full text-sm p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/80 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-medium leading-relaxed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-base font-black shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20"
                      isLoading={submitting}
                      disabled={analysisResult !== null}
                      leftIcon={<Sparkles size={16} />}
                    >
                      {submitting ? 'Analyzing Responses...' : 'Submit & Analyze Experience'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analytics-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Satisfaction Score Card */}
              <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">Satisfaction Score</span>
                  <Award size={18} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black font-data text-emerald-600">{stats.satisfaction}%</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-semibold uppercase tracking-wider">Overall Index Score</p>
                </div>
              </GlassCard>

              {/* Avg Rating Card */}
              <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">Average Rating</span>
                  <div className="flex gap-0.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <StarHalf size={14} className="fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black font-data text-[var(--color-primary)]">{stats.averageRating} / 5</h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-semibold uppercase tracking-wider">Doctor Average rating</p>
                </div>
              </GlassCard>

              {/* Sentiment split */}
              <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">Appreciation Split</span>
                  <div className="flex gap-2">
                    <ThumbsUp size={16} className="text-emerald-500" />
                    <ThumbsDown size={16} className="text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black font-data text-[var(--color-text-primary)]">
                    {stats.positivePct}% <span className="text-xs text-[var(--color-text-muted)]">Pos</span> · {stats.negativePct}% <span className="text-xs text-[var(--color-text-muted)]">Neg</span>
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-semibold uppercase tracking-wider">AI sentiment split</p>
                </div>
              </GlassCard>

              {/* Most mentioned topics */}
              <GlassCard className="p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">Key Topic Highlights</span>
                  <Sparkles size={16} className="text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-emerald-600 truncate">✓ {stats.topPositive}</p>
                  <p className="text-xs font-black text-red-600 truncate">✗ {stats.topComplaint}</p>
                </div>
              </GlassCard>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution BarChart */}
              <GlassCard className="p-5 shadow-lg">
                <h3 className="font-black text-base text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[var(--color-primary)]" /> Rating Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingDist} layout="vertical" margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} />
                    <YAxis dataKey="stars" type="category" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => `${value} reviews`} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {ratingDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Trend Timeline AreaChart */}
              <GlassCard className="p-5 shadow-lg">
                <h3 className="font-black text-base text-[var(--color-text-primary)] mb-5 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" /> Satisfaction Score Trend
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData} margin={{ left: -20, right: 5 }}>
                    <defs>
                      <linearGradient id="satisfactionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="satisfaction"
                      name="Satisfaction Index"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      fill="url(#satisfactionGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
