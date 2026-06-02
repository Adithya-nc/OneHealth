import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  UploadCloud, FileText, Check, X, TrendingUp, TrendingDown,
  Minus, Sparkles, Download, Save, RotateCcw, ChevronRight
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/Card'
import { Alert, ProgressBar } from '../ui/index'
import { useRecordsStore } from '../../store/recordsStore'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/formatters'

const STEPS = ['Uploading Record', 'Extracting Telemetry', 'Comparing Bio-Markers', 'Compiling AI Summary']

const MOCK_ANALYSIS = {
  report_type: 'Complete Blood Count (CBC)',
  extracted_values: [
    { parameter: 'Haemoglobin', value: '11.2', unit: 'g/dL', reference_range: '12.0–16.0', status: 'low', plain_explanation: 'Your haemoglobin is slightly below normal — this may indicate mild anaemia.' },
    { parameter: 'WBC Count', value: '6,800', unit: 'cells/μL', reference_range: '4,500–11,000', status: 'normal', plain_explanation: 'Your white blood cell count is normal — no signs of active infection.' },
    { parameter: 'Platelets', value: '2,45,000', unit: '/μL', reference_range: '1,50,000–4,00,000', status: 'normal', plain_explanation: 'Platelet count is in the healthy range — good blood clotting ability.' },
    { parameter: 'Fasting Glucose', value: '98', unit: 'mg/dL', reference_range: '70–100', status: 'normal', plain_explanation: 'Fasting blood sugar is within normal range. Your glucose regulation is good.' },
    { parameter: 'Serum Iron', value: '52', unit: 'μg/dL', reference_range: '60–170', status: 'low', plain_explanation: 'Iron levels are slightly low, which may be contributing to the low haemoglobin.' },
  ],
  overall_summary: 'Your blood report shows mild iron-deficiency anaemia. Most other parameters including white blood cells, platelets, and blood sugar are within normal ranges. The low iron and haemoglobin values suggest you may benefit from dietary changes or iron supplementation.',
  abnormal_findings: ['Haemoglobin below normal range', 'Serum Iron slightly low'],
  suggested_actions: [
    'Increase iron-rich foods: spinach, lentils, red meat, fortified cereals.',
    'Take Vitamin C with meals to enhance iron absorption.',
    'Consider iron supplementation after consulting your doctor.',
    'Retest CBC and iron profile in 3 months.',
  ],
  urgency: 'routine',
}

const statusIcons = {
  normal:   { icon: <Minus size={12} />,      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  high:     { icon: <TrendingUp size={12} />,  color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  low:      { icon: <TrendingDown size={12} />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
  critical: { icon: <TrendingUp size={12} />,  color: 'bg-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-400' },
}

export default function ReportAnalyzer() {
  const [step, setStep] = useState('upload') // upload | processing | results
  const [files, setFiles] = useState([])
  const [reportType, setReportType] = useState('report')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState(null)
  const addRecord = useRecordsStore(s => s.addRecord)
  const toast = useToast()

  const onDrop = useCallback((accepted) => setFiles(accepted), [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg'], 'image/png': ['.png'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  const handleAnalyze = async () => {
    setStep('processing')
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i)
      setProgress(((i + 1) / STEPS.length) * 100)
      await new Promise(r => setTimeout(r, 1800))
    }
    setResult(MOCK_ANALYSIS)
    setStep('results')
  }

  const handleSave = () => {
    addRecord({
      id: `rec-${Date.now()}`,
      type: 'report',
      date: new Date().toISOString().split('T')[0],
      title: result?.report_type || files[0]?.name || 'Analyzed Report',
      metadata: { doctor_name: 'oneHealth AI', hospital: '', notes: '' },
      ai_analysis: {
        summary: result?.overall_summary,
        extracted_values: result?.extracted_values,
        suggested_actions: result?.suggested_actions,
      },
    })
    toast.success('Saved to Passport', 'The analyzed report has been saved.')
  }

  const handleReset = () => {
    setStep('upload'); setFiles([]); setResult(null); setProgress(0); setCurrentStep(0)
  }

  return (
    <div className="page-container py-6 space-y-6 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-8">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4 shadow-lg shadow-purple-500/20"
        >
          <Sparkles size={28} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">AI Report Analyzer</h1>
        <p className="text-[var(--color-text-secondary)] mt-1.5 max-w-md mx-auto text-sm">Upload diagnostic medical records. The parser identifies variables and details them immediately.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div 
            key="upload" 
            initial={{ opacity: 0, scale: 0.98, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.98, y: -15 }} 
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Report Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'report',        label: 'Blood Test' },
                { id: 'radiology',     label: 'Radiology' },
                { id: 'prescription',  label: 'Prescription' },
                { id: 'other',         label: 'Other' },
              ].map(t => (
                <motion.button
                  key={t.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReportType(t.id)}
                  className={cn(
                    'p-3.5 rounded-xl border text-xs font-bold transition-all duration-300',
                    reportType === t.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/5'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-slate-300'
                  )}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>

            {/* Drag and Drop Zone */}
            <motion.div
              {...getRootProps()}
              whileHover={{ scale: 1.01 }}
              className={cn(
                'rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden',
                isDragActive ? 'border-blue-500 bg-blue-500/5' :
                files.length ? 'border-emerald-500 bg-emerald-500/5' :
                'border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-surface-2)]/60'
              )}
            >
              <input {...getInputProps()} />
              {files.length ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shadow-md">
                    <FileText size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-base">{files[0].name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 font-semibold">{(files[0].size / 1024).toFixed(0)} KB · Ready to analyze</p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    <UploadCloud size={36} className="text-[var(--color-text-muted)]" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[var(--color-text-primary)]">{isDragActive ? 'Release the file now' : 'Drag & Drop Medical Report'}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 font-medium">Supports PDF, JPG, PNG up to 20 MB</p>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                onClick={handleAnalyze}
                className="w-full h-14 text-base font-bold shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20"
                disabled={files.length === 0}
                leftIcon={<Sparkles size={18} />}
              >
                Analyze Report with AI
              </Button>
            </motion.div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div 
            key="processing" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="py-16 space-y-8 flex flex-col items-center"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white animate-pulse" />
              </div>
            </div>
            <div className="max-w-md w-full space-y-5">
              <ProgressBar value={progress} color="primary" showPercent />
              <div className="space-y-3 bg-[var(--color-surface)]/60 backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-5">
                {STEPS.map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn('flex items-center gap-3 text-xs font-bold transition-all', i <= currentStep ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]')}
                  >
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors', i < currentStep ? 'bg-emerald-500 text-white' : i === currentStep ? 'bg-purple-600 text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]')}>
                      {i < currentStep ? <Check size={12} /> : <span className="font-bold">{i + 1}</span>}
                    </div>
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'results' && result && (
          <motion.div 
            key="results" 
            initial={{ opacity: 0, scale: 0.98, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Summary GlassCard */}
            <GlassCard className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 p-6 relative">
              {/* Highlight overlay */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-purple-600 animate-pulse" />
                <h3 className="font-black text-lg text-[var(--color-text-primary)]">AI Summary — {result.report_type}</h3>
              </div>
              <p className="text-[var(--color-text-primary)] leading-relaxed text-sm font-medium">{result.overall_summary}</p>
              {result.abnormal_findings?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.abnormal_findings.map((f, i) => (
                    <motion.span 
                      key={i} 
                      whileHover={{ scale: 1.05 }}
                      className="text-[10px] font-bold px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 rounded-full border border-amber-200/35 dark:border-amber-500/10"
                    >
                      ⚠ {f}
                    </motion.span>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Extracted Values Table in GlassCard */}
            <GlassCard className="p-0 border border-[var(--color-border)]/60 overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-[var(--color-border)]/50">
                <h3 className="font-black text-base text-[var(--color-text-primary)]">Extracted Parameter Telemetry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--color-surface-2)]/60 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    <tr>
                      {['Parameter', 'Your Value', 'Reference Range', 'Status', 'Explanation'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50 text-[var(--color-text-primary)]">
                    {result.extracted_values.map((v, i) => {
                      const s = statusIcons[v.status] || statusIcons.normal
                      return (
                        <motion.tr 
                          key={i} 
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                          className={cn('transition-colors', v.status !== 'normal' ? 'bg-amber-500/[0.02]' : '')}
                        >
                          <td className="px-5 py-4 font-bold text-sm">{v.parameter}</td>
                          <td className="px-5 py-4 font-data font-bold text-sm">{v.value} <span className="text-xs text-[var(--color-text-muted)] font-normal">{v.unit}</span></td>
                          <td className="px-5 py-4 text-xs font-medium text-[var(--color-text-secondary)]">{v.reference_range}</td>
                          <td className="px-5 py-4">
                            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm', s.color)}>
                              {s.icon} <span className="uppercase text-[9px] tracking-wider font-black">{v.status}</span>
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-[var(--color-text-secondary)] font-medium max-w-xs leading-relaxed">{v.plain_explanation}</td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Suggested Actions */}
            <GlassCard>
              <h3 className="font-black text-base text-[var(--color-text-primary)] mb-4">Suggested Actions</h3>
              <ol className="space-y-3">
                {result.suggested_actions.map((a, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 2 }}
                    className="flex gap-3 text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">{i + 1}</span>
                    {a}
                  </motion.li>
                ))}
              </ol>
            </GlassCard>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full h-12 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" leftIcon={<Save size={16} />} onClick={handleSave}>Save to Passport</Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full h-12" leftIcon={<Download size={16} />}>Download PDF Summary</Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full h-12" leftIcon={<RotateCcw size={16} />} onClick={handleReset}>Analyze Another</Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
