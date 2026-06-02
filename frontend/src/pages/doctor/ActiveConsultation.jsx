import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Stethoscope, 
  Pill, 
  Save, 
  Sparkles,
  Plus,
  Trash2,
  CalendarDays,
  FileText
} from 'lucide-react'
import { Card, GlassCard, Button, Input } from '../../components/ui'
import { useConsultationStore } from '../../store/doctorStore'

export function ActiveConsultation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const store = useConsultationStore()
  
  const [symptomInput, setSymptomInput] = useState('')

  const handleAddSymptom = (e) => {
    e.preventDefault()
    if (symptomInput.trim() && !store.symptoms.includes(symptomInput.trim())) {
      store.addSymptom(symptomInput.trim())
      setSymptomInput('')
    }
  }

  const handleGenerateSummary = () => {
    // Mock AI Generation
    store.updateDiagnosisField('aiSummary', {
      diagnosis: store.diagnosis || 'Acute Respiratory Infection',
      risk: 'Moderate',
      treatment: 'Antibiotics, Rest, Hydration',
      followUp: '7 days'
    })
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-20 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-600" /> Active Consultation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Patient: Michael Chang (P-9821)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hidden sm:flex">Save Draft</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20">
            <Save className="w-4 h-4 mr-2" /> Complete Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Data Entry */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnosis & Symptoms */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Diagnosis & Symptoms</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Diagnosis Title</label>
                <Input 
                  value={store.diagnosis} 
                  onChange={(e) => store.updateDiagnosisField('diagnosis', e.target.value)}
                  placeholder="e.g. Acute Bronchitis"
                  className="bg-slate-50 dark:bg-slate-800"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
                  <select 
                    value={store.severity}
                    onChange={(e) => store.updateDiagnosisField('severity', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Add Symptoms</label>
                  <form onSubmit={handleAddSymptom} className="relative">
                    <Input 
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      placeholder="Type and press enter..."
                      className="bg-slate-50 dark:bg-slate-800 pr-10"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded-md">
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Symptom Chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                <AnimatePresence>
                  {store.symptoms.map(sym => (
                    <motion.span 
                      key={sym} 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 rounded-full text-sm font-medium flex items-center gap-1 border border-indigo-100 dark:border-indigo-500/20"
                    >
                      {sym}
                      <button type="button" onClick={() => store.removeSymptom(sym)} className="hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3 ml-1" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Raw Doctor Notes</label>
                <textarea 
                  value={store.doctorNotes}
                  onChange={(e) => store.updateDiagnosisField('doctorNotes', e.target.value)}
                  placeholder="Record your observations here. Our AI will structure this later..."
                  className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white"
                ></textarea>
              </div>
            </div>
          </GlassCard>

          {/* Prescription Builder */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-500" /> Prescription Builder
              </h3>
              <Button size="sm" variant="outline" onClick={() => store.addPrescription({ name: '', dosage: '', freq: '', duration: '' })}>
                <Plus className="w-4 h-4 mr-1" /> Add Med
              </Button>
            </div>

            {store.prescriptions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400">No medications prescribed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {store.prescriptions.map((med, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      layout
                      className="flex flex-col sm:flex-row gap-3 items-end p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Medicine Name</label>
                          <Input placeholder="e.g. Amoxicillin" defaultValue={med.name} className="h-9 text-sm bg-white dark:bg-slate-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Dosage</label>
                          <Input placeholder="500mg" defaultValue={med.dosage} className="h-9 text-sm bg-white dark:bg-slate-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                          <Input placeholder="1-0-1" defaultValue={med.freq} className="h-9 text-sm bg-white dark:bg-slate-900" />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 shrink-0" onClick={() => store.removePrescription(idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            <div className="mt-6 flex gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none">
                <FileText className="w-4 h-4 mr-2" /> Generate PDF
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">Save to Passport</Button>
            </div>
          </GlassCard>

        </div>

        {/* Right Col: AI & Follow Up */}
        <div className="space-y-6">
          
          {/* AI Consultation Summary */}
          <GlassCard className="p-0 overflow-hidden relative border border-indigo-100 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" /> AI Summary
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Convert your raw notes into a structured medical record automatically.</p>
              
              {!store.aiSummary ? (
                <motion.div
                  animate={{
                    boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.4)", "0 0 0 10px rgba(99, 102, 241, 0)", "0 0 0 0 rgba(99, 102, 241, 0)"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="rounded-xl overflow-hidden"
                >
                  <Button 
                    onClick={handleGenerateSummary}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Generate Structure
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.15
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3"
                  >
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                      <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider font-sans">Computed Diagnosis</span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{store.aiSummary.diagnosis}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                      <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider font-sans">Risk Level</span>
                      <p className="text-sm font-semibold text-amber-600">{store.aiSummary.risk}</p>
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}>
                      <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider font-sans">Suggested Treatment</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{store.aiSummary.treatment}</p>
                    </motion.div>
                  </motion.div>
                  <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" onClick={() => store.updateDiagnosisField('aiSummary', null)}>
                    Regenerate
                  </Button>
                </motion.div>
              )}
            </div>
          </GlassCard>

          {/* Follow Up */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-blue-600" /> Follow-Up Plan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Schedule Date</label>
                <Input type="date" className="bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Required Tests</label>
                <Input placeholder="e.g. Complete Blood Count" className="bg-slate-50 dark:bg-slate-800" />
              </div>
            </div>
          </GlassCard>

        </div>
      </div>

    </div>
  )
}
