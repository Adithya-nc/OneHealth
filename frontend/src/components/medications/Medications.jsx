import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pill, Plus, Clock, Check, Edit, Trash2, AlertTriangle,
  Calendar, RefreshCw, ChevronRight, RotateCcw, Flame, ShieldAlert
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { ProgressBar, EmptyState, Alert } from '../ui/index'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/formatters'
import { useMedicationStore } from '../../store/medicationStore'

const FREQ_LABELS = {
  once: 'Once daily',
  twice: 'Twice daily',
  thrice: 'Thrice daily',
  weekly: 'Weekly',
  as_needed: 'As needed'
}

function MedCard({ med, onMarkTaken, onUndoTaken, onDelete }) {
  const isLow = med.remaining_days <= 7 && med.status === 'active'
  const progress = med.end_date && med.start_date
    ? Math.max(0, Math.min(100, (1 - med.remaining_days / Math.max(1, Math.ceil((new Date(med.end_date) - new Date(med.start_date)) / 86400000))) * 100))
    : (med.adherence_percent || 80)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        'rounded-2xl border bg-[var(--color-surface)] p-5 transition-all shadow-sm',
        isLow ? 'border-amber-300 dark:border-amber-500/40 shadow-[0_0_0_2px_rgba(217,119,6,0.1)]' : 'border-[var(--color-border)]'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-[var(--color-text-primary)]">{med.name}</h3>
            {isLow && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 rounded-full">
                <AlertTriangle size={10} /> Low Supply
              </span>
            )}
            {med.taken_today && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full">
                <Check size={10} /> Taken Today
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">
            {med.dosage} · {FREQ_LABELS[med.frequency] || med.frequency}
            {med.prescribed_by && <span className="text-[var(--color-text-muted)]"> · Prescribed by {med.prescribed_by}</span>}
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {!med.taken_today && med.status === 'active' ? (
            <Button size="sm" variant="outline" onClick={() => onMarkTaken(med.id)} leftIcon={<Check size={12} className="text-emerald-600" />}>
              Mark Taken
            </Button>
          ) : med.taken_today && med.status === 'active' ? (
            <Button size="sm" variant="ghost" onClick={() => onUndoTaken(med.id)} leftIcon={<RotateCcw size={12} />}>
              Undo
            </Button>
          ) : null}
          <button
            onClick={() => onDelete(med.id)}
            aria-label="Delete medication"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Instructions */}
      {med.instructions && (
        <p className="text-xs text-[var(--color-text-secondary)] italic mb-3 bg-[var(--color-surface-2)]/60 px-3 py-1.5 rounded-lg border border-[var(--color-border)]/40">
          "{med.instructions}"
        </p>
      )}

      {/* Progress & Supply */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] font-semibold">
          <span>Adherence: {med.adherence_percent ?? 90}%</span>
          <span>{med.status === 'active' ? `${med.remaining_days} days remaining` : 'Course completed'}</span>
        </div>
        <ProgressBar value={progress} max={100} color={isLow ? 'amber' : 'blue'} />
      </div>
    </motion.div>
  )
}

function AddMedModal({ isOpen, onClose, onAdd, existingMeds }) {
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: 'once', start_date: '', end_date: '', instructions: ''
  })
  const [loading, setLoading] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState('')

  // Check for potential duplicate name
  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val }))
    if (!val.trim()) {
      setDuplicateWarning('')
      return
    }
    const clean = val.trim().toLowerCase()
    const duplicate = existingMeds.find(m =>
      m.status === 'active' &&
      (m.name.toLowerCase().includes(clean) || clean.includes(m.name.toLowerCase()))
    )
    if (duplicate) {
      setDuplicateWarning(`Potential duplicate detected with active prescription: ${duplicate.name}`)
    } else {
      setDuplicateWarning('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    onAdd({
      ...form,
      status: 'active',
      remaining_days: 30,
      prescribed_by: 'Self',
      adherence_percent: 100,
      missed_doses: 0,
      timing: ['09:00']
    })
    setForm({ name: '', dosage: '', frequency: 'once', start_date: '', end_date: '', instructions: '' })
    setDuplicateWarning('')
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Medication" description="Track a new medication with reminders." size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <Input
            id="med-name"
            label="Medication Name"
            placeholder="e.g., Metformin 500mg"
            required
            value={form.name}
            onChange={e => handleNameChange(e.target.value)}
          />
          {duplicateWarning && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="med-dosage" label="Dosage" placeholder="e.g., 1 tablet" required value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} />
          <Select id="med-freq" label="Frequency" value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}>
            {Object.entries(FREQ_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input id="med-start" label="Start Date" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
          <Input id="med-end" label="End Date" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
        </div>
        <Input id="med-notes" label="Instructions (Optional)" placeholder="Take with food, avoid alcohol..." value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={loading}>Save Medication</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Medications() {
  const medications = useMedicationStore(s => s.medications)
  const markTaken = useMedicationStore(s => s.markTaken)
  const undoTaken = useMedicationStore(s => s.undoTaken)
  const addMedication = useMedicationStore(s => s.addMedication)
  const removeMedication = useMedicationStore(s => s.removeMedication)
  const getTodaysAdherence = useMedicationStore(s => s.getTodaysAdherence)
  const getWeeklyAdherence = useMedicationStore(s => s.getWeeklyAdherence)
  const fetchMedications = useMedicationStore(s => s.fetchMedications)

  const [addOpen, setAddOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('active')
  const toast = useToast()

  useEffect(() => {
    fetchMedications()
  }, [fetchMedications])

  const handleMarkTaken = (id) => {
    markTaken(id)
    toast.success('Dose Recorded', 'Medication marked as taken for today.')
  }

  const handleUndoTaken = (id) => {
    undoTaken(id)
    toast.info('Status Updated', 'Marked as pending.')
  }

  const handleDelete = (id) => {
    removeMedication(id)
    toast.info('Removed', 'Medication removed from your list.')
  }

  const handleAdd = (med) => {
    addMedication(med)
    toast.success('Medication Added', `${med.name} has been added to your tracker.`)
  }

  const filtered = medications.filter(m => m.status === activeTab)
  const lowSupply = medications.filter(m => m.remaining_days <= 7 && m.status === 'active')
  const takenToday = medications.filter(m => m.taken_today && m.status === 'active').length
  const totalActive = medications.filter(m => m.status === 'active').length
  const todayAdherence = getTodaysAdherence()
  const weeklyAdherence = getWeeklyAdherence()

  return (
    <div className="page-container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Medication Schedule & Adherence</h1>
          <p className="text-sm text-[var(--color-text-secondary)] font-medium mt-0.5">Track prescriptions, view adherence trends, and manage refills.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Medication</Button>
      </div>

      {/* Adherence Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-sm">
          <p className="text-2xl font-black font-data text-[var(--color-primary)]">{totalActive}</p>
          <p className="text-xs text-[var(--color-text-muted)] font-semibold mt-1">Active Prescriptions</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-sm">
          <p className="text-2xl font-black font-data text-emerald-600">{takenToday}/{totalActive}</p>
          <p className="text-xs text-[var(--color-text-muted)] font-semibold mt-1">Doses Taken Today</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-sm">
          <p className="text-2xl font-black font-data text-indigo-600">{todayAdherence}%</p>
          <p className="text-xs text-[var(--color-text-muted)] font-semibold mt-1">Today's Adherence</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-sm">
          <p className="text-2xl font-black font-data text-amber-600 flex items-center justify-center gap-1">
            <Flame size={18} className="text-amber-500 fill-amber-500" /> 14 Days
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-semibold mt-1">Adherence Streak</p>
        </div>
      </div>

      {/* Low Supply Alert */}
      {lowSupply.length > 0 && (
        <Alert type="warning" title="Refill Notice">
          {lowSupply.map(m => m.name).join(', ')} {lowSupply.length === 1 ? 'is' : 'are'} running low on supply (&le; 7 days left). Please request a refill from your physician.
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {['active', 'completed'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all',
              activeTab === t
                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]'
            )}
          >
            {t} ({medications.filter(m => m.status === t).length})
          </button>
        ))}
      </div>

      {/* Medication List */}
      <AnimatePresence>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Pill size={28} />}
            title={activeTab === 'active' ? 'No active medications' : 'No completed medications'}
            description={activeTab === 'active' ? 'Add your first medication to start tracking.' : 'Completed medications will appear here.'}
            action={activeTab === 'active' ? <Button leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>Add Medication</Button> : null}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(med => (
              <MedCard
                key={med.id}
                med={med}
                onMarkTaken={handleMarkTaken}
                onUndoTaken={handleUndoTaken}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <AddMedModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
        existingMeds={medications}
      />
    </div>
  )
}
