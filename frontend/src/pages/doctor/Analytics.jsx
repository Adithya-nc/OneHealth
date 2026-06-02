import React from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { MessageSquareHeart, Frown, MessageCircle, ThumbsUp, TrendingUp } from 'lucide-react'
import { Card, GlassCard } from '../../components/ui'

const SENTIMENT_DATA = [
  { name: 'Positive', value: 68, color: '#10b981' },
  { name: 'Neutral', value: 20, color: '#f59e0b' },
  { name: 'Negative', value: 12, color: '#ef4444' }
]

const TREND_DATA = [
  { month: 'Jan', score: 82 },
  { month: 'Feb', score: 85 },
  { month: 'Mar', score: 83 },
  { month: 'Apr', score: 88 },
  { month: 'May', score: 91 },
  { month: 'Jun', score: 94 }
]

export function Analytics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400">AI-driven sentiment analysis of patient reviews and feedback.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Reviews</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">428</h4>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Overall Satisfaction</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">4.8/5</h4>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Recommendation Rate</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">92%</h4>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Response Time</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white"><span className="text-emerald-500">↓</span> 12m</h4>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sentiment Donut */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard className="p-6 h-[400px]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Sentiment Analysis</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SENTIMENT_DATA}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {SENTIMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {SENTIMENT_DATA.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trend Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-6 h-[400px]">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Patient Satisfaction Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip contentStyle={{ borderRadius: '12px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} isAnimationActive={true} animationDuration={1200} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h3 className="font-bold text-emerald-600 mb-4 flex items-center gap-2"><ThumbsUp className="w-5 h-5 animate-bounce" /> Top Appreciations</h3>
            <div className="space-y-3">
              {['Clear explanations of medical terms', 'Short wait times in the clinic', 'Friendly and empathetic staff'].map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100/20 dark:border-emerald-500/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6">
            <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2"><Frown className="w-5 h-5 animate-pulse" /> Areas for Improvement</h3>
            <div className="space-y-3">
              {['Difficulty finding parking near clinic', 'Appointment booking app occasionally slow', 'Waiting room too cold'].map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-red-50/50 dark:bg-red-500/10 rounded-xl border border-red-100/20 dark:border-red-500/10">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

    </motion.div>
  )
}
