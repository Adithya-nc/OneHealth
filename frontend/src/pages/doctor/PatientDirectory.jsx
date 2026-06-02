import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Activity, 
  Heart, 
  Droplet,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import { Card, Button, Input, Badge, GlassCard } from '../../components/ui'

// Mock Data
const PATIENTS = [
  { id: 'P-9821', name: 'Michael Chang', age: 45, gender: 'M', bloodGroup: 'O+', lastVisit: '2 days ago', healthScore: 78, tags: ['Hypertension'], avatar: 'MC', risk: 'moderate' },
  { id: 'P-3422', name: 'Sarah Jenkins', age: 32, gender: 'F', bloodGroup: 'A-', lastVisit: '1 week ago', healthScore: 92, tags: ['Healthy'], avatar: 'SJ', risk: 'low' },
  { id: 'P-1123', name: 'David Warner', age: 58, gender: 'M', bloodGroup: 'B+', lastVisit: 'Today', healthScore: 45, tags: ['Diabetes', 'Heart Disease'], avatar: 'DW', risk: 'high' },
  { id: 'P-8834', name: 'Emily Davis', age: 28, gender: 'F', bloodGroup: 'O-', lastVisit: '1 month ago', healthScore: 88, tags: ['Asthma'], avatar: 'ED', risk: 'low' },
  { id: 'P-4451', name: 'Robert Fox', age: 51, gender: 'M', bloodGroup: 'AB+', lastVisit: '3 days ago', healthScore: 65, tags: ['Obesity'], avatar: 'RF', risk: 'moderate' },
  { id: 'P-9912', name: 'Jessica Parker', age: 41, gender: 'F', bloodGroup: 'A+', lastVisit: '2 weeks ago', healthScore: 95, tags: ['Healthy'], avatar: 'JP', risk: 'low' },
]

const CHIPS = ['All', 'High Risk', 'Moderate Risk', 'Low Risk', 'Hypertension', 'Diabetes', 'Asthma']

export function PatientDirectory() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  // Filter logic
  const filteredPatients = PATIENTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
    if (!matchesSearch) return false
    
    if (activeFilter === 'All') return true
    if (activeFilter.includes('Risk')) return p.risk === activeFilter.split(' ')[0].toLowerCase()
    return p.tags.includes(activeFilter)
  })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } }
  }

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 22 } }
  }

  return (
    <div className="space-y-6 relative z-10">
      
      {/* Header & Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1.5">Patient Directory</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Search, categorize and monitor client health dossiers securely.</p>
          </div>
          
          <div className="flex-1 max-w-lg relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-[var(--color-surface-2)]/60 dark:bg-slate-800/40 border border-[var(--color-border)] dark:border-slate-700/30 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-[var(--color-text-primary)] font-semibold transition-all"
            />
            <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CHIPS.map(chip => (
            <motion.button
              key={chip}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(chip)}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                activeFilter === chip 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                  : 'bg-[var(--color-surface-2)]/60 text-slate-600 hover:bg-slate-200 dark:text-slate-350 dark:hover:bg-slate-800'
              }`}
            >
              {chip}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Results Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPatients.map((patient, i) => (
            <motion.div
              key={patient.id}
              variants={cardVariant}
              layout
            >
              <GlassCard 
                className="overflow-hidden p-0 group border-none shadow-xl flex flex-col justify-between" 
                onClick={() => navigate(`/doctor/patients/${patient.id}`)}
              >
                {/* Card Header info */}
                <div className="p-6 pb-4 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="relative">
                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-lg shadow-inner"
                      >
                        {patient.avatar}
                      </motion.div>
                      {patient.risk === 'high' && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md animate-pulse">
                          <ShieldAlert className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{patient.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">{patient.id} • {patient.gender}, {patient.age} years</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                {/* Body Stats Telemetry */}
                <div className="px-6 py-4 border-y border-slate-100 dark:border-slate-800/60 grid grid-cols-3 gap-4 bg-slate-50/40 dark:bg-slate-950/10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Droplet className="w-3 h-3 text-red-500" /> Blood</p>
                    <p className="font-bold text-slate-900 dark:text-white">{patient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-blue-500" /> Score</p>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${patient.healthScore > 80 ? 'bg-emerald-500' : patient.healthScore > 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <p className="font-bold text-slate-900 dark:text-white font-data">{patient.healthScore}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Visited</p>
                    <p className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{patient.lastVisit}</p>
                  </div>
                </div>

                {/* Footer tags */}
                <div className="p-6 pt-4 flex items-center justify-between bg-white/10 dark:bg-slate-900/10">
                  <div className="flex gap-1.5 flex-wrap">
                    {patient.tags.map(tag => (
                      <span key={tag} className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border
                        ${tag === 'Healthy' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 
                          'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'}
                      `}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredPatients.length === 0 && (
        <div className="py-20 text-center relative z-10">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Search className="w-8 h-8 text-slate-450" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No patients matching filters</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">Adjust search inputs or reset filters to display clinic roster.</p>
        </div>
      )}

    </div>
  )
}
