import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  PhoneCall, 
  AlertTriangle, 
  Pill, 
  Activity, 
  FileText,
  Calendar,
  Syringe,
  Building
} from 'lucide-react'
import { Card, GlassCard, Button, Badge } from '../../components/ui'
import { MedicalTimeline } from '../../components/doctor/passport/MedicalTimeline'
import { ReportReviewModule } from '../../components/doctor/passport/ReportReviewModule'

// Mock Patient Data
const PATIENT = {
  id: 'P-9821',
  name: 'Michael Chang',
  age: 45,
  gender: 'Male',
  bloodGroup: 'O+',
  dob: '12 May 1981',
  phone: '+1 (555) 123-4567',
  emergencyContact: {
    name: 'Sarah Chang',
    relation: 'Wife',
    phone: '+1 (555) 987-6543'
  },
  allergies: ['Penicillin', 'Peanuts'],
  chronicDiseases: ['Hypertension', 'Type 2 Diabetes'],
  currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
}

export function PatientPassport() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // In a real app, we would fetch patient data based on `id`

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Nav Action */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/doctor/patients')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" onClick={() => navigate(`/doctor/consultation/${id}`)}>
          Start Consultation
        </Button>
      </div>

      {/* Comprehensive Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <GlassCard className="p-0 overflow-hidden border-0 shadow-md">
          
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

            {/* Profile Info */}
            <div className="flex gap-6 items-center md:w-1/3 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-3xl shadow-inner border-4 border-white dark:border-slate-900">
                {PATIENT.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{PATIENT.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">ID: {PATIENT.id}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>{PATIENT.gender}, {PATIENT.age}y</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="flex items-center gap-1 font-bold text-red-500"><DropletIcon className="w-3 h-3" /> {PATIENT.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="w-px h-24 bg-slate-200 dark:bg-slate-800 hidden md:block relative z-10"></div>

            {/* Emergency & Quick Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Emergency Contact</h4>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{PATIENT.emergencyContact.name} ({PATIENT.emergencyContact.relation})</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{PATIENT.emergencyContact.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Pill className="w-3 h-3" /> Current Meds</h4>
                  <div className="flex flex-wrap gap-2">
                    {PATIENT.currentMedications.map(med => (
                      <span key={med} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">{med}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Badges Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-red-100 text-red-600 rounded-md mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Allergies</p>
                <div className="flex gap-2 flex-wrap">
                  {PATIENT.allergies.map(a => <Badge key={a} variant="danger">{a}</Badge>)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md mt-0.5"><Activity className="w-4 h-4" /></div>
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Chronic Conditions</p>
                <div className="flex gap-2 flex-wrap">
                  {PATIENT.chronicDiseases.map(d => <Badge key={d} variant="warning">{d}</Badge>)}
                </div>
              </div>
            </div>
          </div>

        </GlassCard>
      </motion.div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Medical Timeline
            </h3>
            <GlassCard className="p-6">
              <MedicalTimeline />
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column: Report Viewer & Quick Actions */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Recent Reports
            </h3>
            <ReportReviewModule />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 15 }}>
             <GlassCard className="p-6">
               <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Visits</span>
                   <span className="font-bold text-slate-900 dark:text-white">24</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Admission</span>
                   <span className="font-bold text-slate-900 dark:text-white">Oct 2024</span>
                 </div>
               </div>
             </GlassCard>
          </motion.div>
        </div>

      </div>

    </div>
  )
}

function DropletIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.5c-3.5 0-6.5-2.9-6.5-6.4 0-3.9 6.5-12.6 6.5-12.6s6.5 8.7 6.5 12.6c0 3.5-3 6.4-6.5 6.4z"/>
    </svg>
  )
}
