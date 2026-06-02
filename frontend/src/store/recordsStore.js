import { create } from 'zustand'

const MOCK_RECORDS = [
  {
    id: 'rec-001', type: 'report', date: '2026-05-28',
    title: 'Complete Blood Count (CBC)',
    metadata: { doctor_name: 'Dr. Meera Pillai', hospital: 'Apollo Diagnostics', notes: 'Routine annual checkup' },
    ai_analysis: {
      summary: 'Most values are within normal range. Haemoglobin is slightly low at 11.2 g/dL — borderline anaemia. Platelet count is normal.',
      extracted_values: [
        { parameter: 'Haemoglobin', value: '11.2', unit: 'g/dL', reference_range: '12.0–16.0', status: 'low' },
        { parameter: 'WBC Count', value: '6,800', unit: 'cells/μL', reference_range: '4,500–11,000', status: 'normal' },
        { parameter: 'Platelets', value: '2,45,000', unit: '/μL', reference_range: '1,50,000–4,00,000', status: 'normal' },
        { parameter: 'Fasting Glucose', value: '98', unit: 'mg/dL', reference_range: '70–100', status: 'normal' },
      ],
      suggested_actions: ['Increase iron-rich foods (spinach, lentils)', 'Retest in 3 months', 'Consider iron supplement'],
    },
  },
  {
    id: 'rec-002', type: 'prescription', date: '2026-05-15',
    title: 'Asthma Medication Refill',
    metadata: { doctor_name: 'Dr. Arjun Nair', hospital: 'City Clinic', notes: '' },
    ai_analysis: null,
  },
  {
    id: 'rec-003', type: 'diagnosis', date: '2026-04-10',
    title: 'Viral Pharyngitis',
    metadata: { doctor_name: 'Dr. Kavya Verma', hospital: 'Max Hospital', notes: 'Prescribed rest and paracetamol for 3 days.' },
    ai_analysis: null,
  },
  {
    id: 'rec-004', type: 'vaccination', date: '2026-01-20',
    title: 'COVID-19 Booster Dose',
    metadata: { doctor_name: 'Apollo Pharmacy Clinic', hospital: 'Apollo Clinic', notes: 'Covishield Booster' },
    ai_analysis: null,
  },
  {
    id: 'rec-005', type: 'report', date: '2025-11-05',
    title: 'Lipid Profile Test',
    metadata: { doctor_name: 'Dr. Meera Pillai', hospital: 'SRL Diagnostics', notes: '' },
    ai_analysis: {
      summary: 'Cholesterol levels are within acceptable range. LDL is on the higher end — dietary modification recommended.',
      extracted_values: [
        { parameter: 'Total Cholesterol', value: '198', unit: 'mg/dL', reference_range: '<200', status: 'normal' },
        { parameter: 'LDL Cholesterol', value: '128', unit: 'mg/dL', reference_range: '<130', status: 'normal' },
        { parameter: 'HDL Cholesterol', value: '52', unit: 'mg/dL', reference_range: '>40', status: 'normal' },
        { parameter: 'Triglycerides', value: '145', unit: 'mg/dL', reference_range: '<150', status: 'normal' },
      ],
      suggested_actions: ['Reduce saturated fats', 'Increase omega-3 intake', 'Recheck in 6 months'],
    },
  },
  {
    id: 'rec-006', type: 'symptom_check', date: '2025-10-22',
    title: 'Symptom Analysis: Headache + Fatigue',
    metadata: { doctor_name: 'oneHealth AI', hospital: '', notes: '' },
    ai_analysis: { summary: 'Medium risk. Possible tension headache or mild dehydration. Recommended rest and hydration.', suggested_actions: [] },
  },
]

const MOCK_TRENDS = {
  weight: [
    { date: '2025-01', value: 61 }, { date: '2025-04', value: 60 },
    { date: '2025-07', value: 59 }, { date: '2025-10', value: 58 },
    { date: '2026-01', value: 57.5 }, { date: '2026-04', value: 58 },
  ],
  bloodPressure: [
    { date: '2025-01', systolic: 128, diastolic: 84 },
    { date: '2025-04', systolic: 125, diastolic: 82 },
    { date: '2025-07', systolic: 122, diastolic: 80 },
    { date: '2025-10', systolic: 124, diastolic: 81 },
    { date: '2026-01', systolic: 120, diastolic: 79 },
    { date: '2026-04', systolic: 118, diastolic: 78 },
  ],
  bloodSugar: [
    { date: '2025-01', fasting: 102 }, { date: '2025-04', fasting: 100 },
    { date: '2025-07', fasting: 98 }, { date: '2025-10', fasting: 99 },
    { date: '2026-01', fasting: 97 }, { date: '2026-04', fasting: 98 },
  ],
  cholesterol: [
    { date: '2025-11', total: 198, ldl: 128, hdl: 52 },
    { date: '2026-04', total: 194, ldl: 122, hdl: 55 },
  ],
}

export const useRecordsStore = create((set, get) => ({
  records: [], // Default to empty array, will fetch from backend
  trends: MOCK_TRENDS, // Keep mock trends for UI demo until API is built for it
  activeFilter: 'all',
  searchQuery: '',
  isLoading: false,

  fetchRecords: async () => {
    set({ isLoading: true })
    try {
      const { default: api } = await import('../services/api')
      const response = await api.get('/patients/timeline')
      set({ records: response.data.entries, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch records:', error)
      // Fallback to mock records if backend is unreachable
      set({ records: MOCK_RECORDS, isLoading: false })
    }
  },

  setFilter: (filter) => set({ activeFilter: filter }),
  setSearch: (q) => set({ searchQuery: q }),
  setLoading: (v) => set({ isLoading: v }),

  addRecord: (record) => set((s) => ({ records: [record, ...s.records] })),
  removeRecord: (id) => set((s) => ({ records: s.records.filter(r => r.id !== id) })),

  getFilteredRecords: () => {
    const { records, activeFilter, searchQuery } = get()
    return records.filter(r => {
      if (activeFilter !== 'all' && r.type !== activeFilter) return false
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  },
}))
