import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Search, Plus, Filter, ChevronRight, FileText, Pill,
  Stethoscope, Syringe, Activity, Eye, Trash2,
  UploadCloud, Calendar, User, Building2, X, StickyNote,
  TrendingUp, TrendingDown, Minus, Download, Sparkles, QrCode, ShieldAlert
} from 'lucide-react'
import { useRecordsStore } from '../../store/recordsStore'
import { useUserStore } from '../../store/userStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Badge, RecordTypeBadge } from '../ui/Badge'
import { Avatar, ProgressBar, EmptyState, Alert, GlassCard } from '../ui/index'
import { useToast } from '../ui/Toast'
import { formatDate, formatRelative, getRecordTypeLabel, getHealthScoreConfig } from '../../utils/formatters'
import { cn } from '../../utils/formatters'

const RECORD_ICONS = {
  report:        <FileText size={18} />,
  prescription:  <Pill size={18} />,
  diagnosis:     <Stethoscope size={18} />,
  vaccination:   <Syringe size={18} />,
  symptom_check: <Activity size={18} />,
  treatment:     <Activity size={18} />,
  followup:      <Calendar size={18} />,
}

const ICON_BG = {
  report:       'bg-blue-100 text-blue-600',
  prescription: 'bg-emerald-100 text-emerald-600',
  diagnosis:    'bg-purple-100 text-purple-600',
  vaccination:  'bg-orange-100 text-orange-600',
  symptom_check:'bg-amber-100 text-amber-600',
  followup:     'bg-slate-100 text-slate-600',
}

// Upload Modal
function UploadModal({ isOpen, onClose }) {
  const [step, setStep] = useState('idle') // idle | uploading | done
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({ type: 'report', date: '', doctor: '', hospital: '', notes: '' })
  const addRecord = useRecordsStore(s => s.addRecord)
  const toast = useToast()

  const onDrop = useCallback((accepted) => {
    setFiles(accepted)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStep('uploading')
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500))

    const newRecord = {
      id: `rec-${Date.now()}`,
      type: form.type,
      date: form.date || new Date().toISOString().split('T')[0],
      title: files[0]?.name || `${getRecordTypeLabel(form.type)} Record`,
      metadata: { doctor_name: form.doctor, hospital: form.hospital, notes: form.notes },
      ai_analysis: null,
    }
    addRecord(newRecord)
    setStep('done')
    toast.success('Record Added', 'Your health record has been added to your passport.')
    setTimeout(() => { setStep('idle'); setFiles([]); setForm({ type: 'report', date: '', doctor: '', hospital: '', notes: '' }); onClose() }, 1000)
  }

  const uploading = step === 'uploading'
  const done = step === 'done'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Health Record" description="Upload a medical record to your Health Passport." size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Record Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">Record Type <span className="text-[var(--color-danger)]">*</span></label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'report', label: 'Lab Report', icon: <FileText size={14} /> },
              { id: 'prescription', label: 'Prescription', icon: <Pill size={14} /> },
              { id: 'diagnosis', label: 'Diagnosis', icon: <Stethoscope size={14} /> },
              { id: 'vaccination', label: 'Vaccination', icon: <Syringe size={14} /> },
              { id: 'treatment', label: 'Treatment', icon: <Activity size={14} /> },
              { id: 'followup', label: 'Follow-Up', icon: <Calendar size={14} /> },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t.id }))}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                  form.type === t.id
                    ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'relative rounded-xl border-2 border-dashed transition-all cursor-pointer p-8 text-center',
            isDragActive
              ? 'border-[var(--color-primary)] bg-blue-50'
              : files.length
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)] bg-[var(--color-surface-2)]'
          )}
        >
          <input {...getInputProps()} />
          {files.length ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-100">
                <FileText size={24} className="text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{files[0].name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{(files[0].size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ) : (
            <div>
              <UploadCloud size={36} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {isDragActive ? 'Drop your file here' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">PDF, JPG, PNG · Max 20 MB</p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date of Record" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Input label="Doctor Name" placeholder="Dr. Smith" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))} />
        </div>
        <Input label="Hospital / Lab" placeholder="City Hospital" value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} />
        <Input label="Notes (Optional)" placeholder="Any additional details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <ProgressBar value={75} color="primary" label="Uploading..." showPercent />
          </div>
        )}

        {done && (
          <Alert type="success" title="Record saved successfully!">
            Your record has been added to your Health Passport.
          </Alert>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={uploading} disabled={done}>
            {done ? 'Saved!' : 'Upload & Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Record Detail Modal
function RecordDetail({ record, isOpen, onClose }) {
  if (!record) return null
  const ai = record.ai_analysis

  const statusConfig = {
    normal:   { label: 'Normal',   color: 'text-emerald-700 bg-emerald-50', icon: <Minus size={12} /> },
    high:     { label: 'High ↑',   color: 'text-red-700 bg-red-50',         icon: <TrendingUp size={12} /> },
    low:      { label: 'Low ↓',    color: 'text-blue-700 bg-blue-50',       icon: <TrendingDown size={12} /> },
    critical: { label: 'Critical', color: 'text-red-900 bg-red-100',        icon: <TrendingUp size={12} /> },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={record.title} size="lg">
      <div className="p-6 space-y-5">
        {/* Meta */}
        <div className="flex flex-wrap gap-4 p-4 bg-[var(--color-surface-2)] rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-secondary)]">{formatDate(record.date)}</span>
          </div>
          {record.metadata?.doctor_name && (
            <div className="flex items-center gap-2 text-sm">
              <User size={14} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-secondary)]">{record.metadata.doctor_name}</span>
            </div>
          )}
          {record.metadata?.hospital && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={14} className="text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-secondary)]">{record.metadata.hospital}</span>
            </div>
          )}
          <RecordTypeBadge type={record.type} />
        </div>

        {/* AI Analysis */}
        {ai && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100">
                <Sparkles size={14} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">AI Analysis</h3>
            </div>

            {/* AI Summary */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{ai.summary}</p>
            </div>

            {/* Extracted Values Table */}
            {ai.extracted_values?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Extracted Values</h4>
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[var(--color-surface-2)]">
                      <tr>
                        {['Parameter', 'Your Value', 'Reference Range', 'Status'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {ai.extracted_values.map((v, i) => {
                        const s = statusConfig[v.status] || statusConfig.normal
                        return (
                          <tr key={i} className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors">
                            <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{v.parameter}</td>
                            <td className="px-4 py-3 font-data font-semibold text-[var(--color-text-primary)]">{v.value} {v.unit}</td>
                            <td className="px-4 py-3 text-[var(--color-text-secondary)]">{v.reference_range}</td>
                            <td className="px-4 py-3">
                              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', s.color)}>
                                {s.icon} {s.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Suggested Actions */}
            {ai.suggested_actions?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Suggested Actions</h4>
                <ul className="space-y-2">
                  {ai.suggested_actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {i + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {record.metadata?.notes && (
          <div className="p-4 bg-[var(--color-surface-2)] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote size={14} className="text-[var(--color-text-muted)]" />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Notes</span>
            </div>
            <p className="text-sm text-[var(--color-text-primary)]">{record.metadata.notes}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download size={14} />} className="flex-1">Download</Button>
          <Button leftIcon={<Sparkles size={14} />} className="flex-1" onClick={() => {}}>Analyze with AI</Button>
        </div>
      </div>
    </Modal>
  )
}

// Timeline Card
function TimelineCard({ record, onClick, index }) {
  const iconBg = ICON_BG[record.type] || 'bg-slate-100 text-slate-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => onClick(record)}
      className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className={cn('p-2.5 rounded-xl flex-shrink-0', iconBg)}>
        {RECORD_ICONS[record.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
          <h3 className="font-semibold text-[var(--color-text-primary)] text-sm truncate">{record.title}</h3>
          <RecordTypeBadge type={record.type} />
          {record.ai_analysis && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              <Sparkles size={8} /> AI Analyzed
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 text-xs text-[var(--color-text-muted)]">
          <span>{formatDate(record.date)}</span>
          {record.metadata?.doctor_name && <span>· {record.metadata.doctor_name}</span>}
          {record.metadata?.hospital && <span>· {record.metadata.hospital}</span>}
        </div>
        {record.ai_analysis?.summary && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{record.ai_analysis.summary}</p>
        )}
      </div>
      <ChevronRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] flex-shrink-0 mt-1" />
    </motion.div>
  )
}

// Overview Card (Digital Ayushman Health ID Card)
function PassportOverview({ profile, healthMetrics }) {
  const p = profile?.profile
  const name = profile?.name || 'User'
  const healthId = profile?.email || 'priya@onehealth'

  return (
    <GlassCard className="overflow-hidden border border-white/20 dark:border-white/5 p-0 relative shadow-2xl bg-gradient-to-br from-indigo-900/90 via-slate-900/90 to-blue-950/90">
      {/* Decorative floating grids/lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Premium Gradient Overlay */}
      <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="relative"
          >
            <Avatar name={name} src={p?.photo_url} size="xl" className="border-4 border-white/20 shadow-xl" />
            {p?.blood_group && (
              <span className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center border-2 border-slate-900 shadow-md">
                {p.blood_group}
              </span>
            )}
          </motion.div>
          
          <div className="text-white space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ABDM Unified Health Account</p>
            <h2 className="text-2xl font-black tracking-tight">{name}</h2>
            <p className="text-xs font-semibold opacity-75">{healthId}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-2.5">
              {p?.dob && <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded-full font-bold">{new Date().getFullYear() - new Date(p.dob).getFullYear()} Years</span>}
              {p?.gender && <span className="text-xs px-2.5 py-0.5 bg-white/10 rounded-full font-bold capitalize">{p.gender}</span>}
              <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-full font-bold">
                <ShieldAlert size={10} /> Active Emergency Profile
              </span>
            </div>
          </div>
        </div>

        {/* QR Code and Health ID Indicators */}
        <div className="flex items-center gap-5 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-6 w-full md:w-auto justify-around md:justify-start flex-shrink-0">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg mb-1 min-w-[76px]">
              <p className="text-3xl font-black text-white font-data">{healthMetrics?.health_score || 74}</p>
              <p className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Score</p>
            </div>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Good standing</p>
          </div>

          <div className="flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -2 }}
              className="bg-white p-2 rounded-xl shadow-lg border border-white/20"
            >
              <QrCode size={52} className="text-slate-900" />
            </motion.div>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider mt-1.5">Scan Health Card</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/5 bg-black/30 backdrop-blur-md">
        {[
          { label: 'Reports',       value: healthMetrics?.reports_count || 0 },
          { label: 'Prescriptions', value: healthMetrics?.prescriptions_count || 0 },
          { label: 'Consultations', value: healthMetrics?.consultations_count || 0 },
          { label: 'Vaccinations',  value: healthMetrics?.vaccinations_count || 0 },
        ].map((s, i) => (
          <motion.div 
            key={s.label} 
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.02)' }}
            className="p-4 text-center flex flex-col justify-center transition-colors duration-300"
          >
            <p className="text-xl font-black text-white font-data">
              {s.value}
            </p>
            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function Passport() {
  const records = useRecordsStore(s => s.records)
  const activeFilter = useRecordsStore(s => s.activeFilter)
  const searchQuery = useRecordsStore(s => s.searchQuery)
  const getFilteredRecords = useRecordsStore(s => s.getFilteredRecords)
  const setFilter = useRecordsStore(s => s.setFilter)
  const setSearch = useRecordsStore(s => s.setSearch)
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)

  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filtered = getFilteredRecords()

  const filters = [
    { value: 'all',         label: 'All' },
    { value: 'report',      label: 'Reports' },
    { value: 'prescription',label: 'Prescriptions' },
    { value: 'diagnosis',   label: 'Diagnoses' },
    { value: 'vaccination', label: 'Vaccinations' },
  ]

  return (
    <div className="page-container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Health Passport</h1>
          <p className="text-[var(--color-text-secondary)] mt-0.5">Your complete lifelong medical record</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setUploadOpen(true)}>
          Add Record
        </Button>
      </div>

      {/* Overview Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <PassportOverview profile={profile} healthMetrics={healthMetrics} />
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Search your health records..."
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                activeFilter === f.value
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="No records found"
            description={searchQuery ? 'Try a different search term.' : 'Add your first health record to get started.'}
            action={<Button leftIcon={<Plus size={16} />} onClick={() => setUploadOpen(true)}>Add Record</Button>}
          />
        ) : (
          filtered.map((record, i) => (
            <TimelineCard key={record.id} record={record} index={i} onClick={setSelectedRecord} />
          ))
        )}
      </div>

      {/* Modals */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      <RecordDetail record={selectedRecord} isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  )
}
