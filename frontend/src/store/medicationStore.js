import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const MOCK_MEDICATIONS = [
  {
    id: 'med-001',
    name: 'Salbutamol 100mcg',
    dosage: '2 puffs',
    frequency: 'as_needed',
    timing: [],
    start_date: '2026-04-01',
    end_date: '2026-12-31',
    instructions: 'Use inhaler as needed for breathing difficulty.',
    status: 'active',
    remaining_days: 212,
    prescribed_by: 'Dr. Arjun Nair',
    taken_today: true,
    adherence_percent: 94,
    missed_doses: 1,
  },
  {
    id: 'med-002',
    name: 'Amlodipine 5mg',
    dosage: '1 tablet',
    frequency: 'once',
    timing: ['09:00'],
    start_date: '2026-03-01',
    end_date: '2026-09-01',
    instructions: 'Take in the morning with water. Do not crush.',
    status: 'active',
    remaining_days: 6,
    prescribed_by: 'Dr. Arjun Nair',
    taken_today: false,
    adherence_percent: 88,
    missed_doses: 3,
  },
  {
    id: 'med-003',
    name: 'Vitamin D3 1000 IU',
    dosage: '1 capsule',
    frequency: 'once',
    timing: ['08:00'],
    start_date: '2026-05-01',
    end_date: '2026-08-01',
    instructions: 'Take with fatty meal for better absorption.',
    status: 'active',
    remaining_days: 30,
    prescribed_by: 'Self',
    taken_today: true,
    adherence_percent: 100,
    missed_doses: 0,
  },
  {
    id: 'med-004',
    name: 'Azithromycin 500mg',
    dosage: '1 tablet',
    frequency: 'once',
    timing: ['08:00'],
    start_date: '2026-04-10',
    end_date: '2026-04-15',
    instructions: 'Complete the full course even if you feel better.',
    status: 'completed',
    remaining_days: 0,
    prescribed_by: 'Dr. Kavya Verma',
    taken_today: false,
    adherence_percent: 100,
    missed_doses: 0,
  },
]

export const useMedicationStore = create(
  persist(
    (set, get) => ({
      medications: MOCK_MEDICATIONS,
      isLoading: false,
      lastSynced: null,

      // Fetch medications from backend (with mock fallback)
      fetchMedications: async () => {
        set({ isLoading: true })
        try {
          const response = await api.get('/medications')
          if (response.data.medications && response.data.medications.length > 0) {
            set({ medications: response.data.medications, isLoading: false, lastSynced: new Date().toISOString() })
          } else {
            set({ medications: MOCK_MEDICATIONS, isLoading: false })
          }
        } catch {
          // Silently fall back to persisted / mock data
          set({ isLoading: false })
        }
      },

      // Mark a medication as taken today
      markTaken: (id) => set((s) => ({
        medications: s.medications.map(m =>
          m.id === id ? { ...m, taken_today: true } : m
        )
      })),

      // Undo mark-as-taken
      undoTaken: (id) => set((s) => ({
        medications: s.medications.map(m =>
          m.id === id ? { ...m, taken_today: false } : m
        )
      })),

      // Add new medication
      addMedication: (med) => set((s) => ({
        medications: [
          { ...med, id: `med-${Date.now()}`, taken_today: false, adherence_percent: 100, missed_doses: 0 },
          ...s.medications,
        ]
      })),

      // Update medication
      updateMedication: (id, updates) => set((s) => ({
        medications: s.medications.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      // Delete medication
      removeMedication: (id) => set((s) => ({
        medications: s.medications.filter(m => m.id !== id)
      })),

      // Computed: today's active medications
      getTodaysMedications: () => {
        const { medications } = get()
        return medications.filter(m => m.status === 'active')
      },

      // Computed: overall adherence today
      getTodaysAdherence: () => {
        const { medications } = get()
        const active = medications.filter(m => m.status === 'active')
        if (active.length === 0) return 100
        const taken = active.filter(m => m.taken_today).length
        return Math.round((taken / active.length) * 100)
      },

      // Computed: weekly average adherence across all active meds
      getWeeklyAdherence: () => {
        const { medications } = get()
        const active = medications.filter(m => m.status === 'active' && m.adherence_percent != null)
        if (active.length === 0) return 0
        return Math.round(active.reduce((sum, m) => sum + m.adherence_percent, 0) / active.length)
      },
    }),
    {
      name: 'onehealth-medications',
      partialize: (s) => ({ medications: s.medications }),
    }
  )
)
