import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import {
  HeartPulse, Shield, Zap, Brain, ArrowRight, Check,
  Stethoscope, FileSearch, AlertTriangle, BarChart3,
  BookHeart, Star, ChevronRight, User, Pill, Activity,
  Lock, CheckCircle2, Quote, ActivitySquare
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { cn } from '../utils/formatters'

// --- HELPER: GlassCard with Glow ---
const PremiumGlassCard = ({ children, className, ...props }) => (
  <motion.div
    {...props}
    className={cn(
      "relative overflow-hidden rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] group",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </motion.div>
)

// --- HELPER: CountUp Animation ---
function CountUp({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const inView = useInView(nodeRef, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const val = parseFloat(value)
    if (isNaN(val)) { setCount(value); return }
    const step = val / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= val) { setCount(val); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration, inView])

  const displayVal = typeof count === 'number' 
    ? (Number.isInteger(count) ? count : count.toFixed(1))
    : count;
    
  return <span ref={nodeRef}>{displayVal}{suffix}</span>
}

// --- CONSTANTS ---
const features = [
  { icon: BookHeart, title: 'Lifetime Health Passport', desc: 'All your medical records in one secure, unified digital vault.', color: 'from-blue-500 to-indigo-600' },
  { icon: Brain, title: 'AI Symptom Analyzer', desc: 'Advanced differential diagnosis engine powered by state-of-the-art AI.', color: 'from-purple-500 to-pink-600' },
  { icon: AlertTriangle, title: 'Emergency Assistant', desc: 'Zero-login emergency access to critical blood types and allergies.', color: 'from-red-500 to-rose-600' },
  { icon: FileSearch, title: 'AI Report Analyzer', desc: 'Instant extraction of biomarkers and anomalies from complex lab PDFs.', color: 'from-emerald-500 to-teal-600' },
  { icon: BarChart3, title: 'Feedback Analytics', desc: 'Sentiment analysis and dynamic rating pipelines for modern clinics.', color: 'from-amber-500 to-orange-600' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Military-grade AES-256 encryption. Fully aligned with HIPAA standards.', color: 'from-slate-500 to-slate-700' },
]

const stats = [
  { value: '400', suffix: 'M+', label: 'Health Records Unified' },
  { value: '85', suffix: '%',   label: 'AI Symptom Accuracy' },
  { value: '<1', suffix: 's',   label: 'Emergency Card Access' },
  { value: '99.9', suffix: '%', label: 'Platform Uptime' },
]

const testimonials = [
  { name: 'Priya S.', role: 'Patient', location: 'Bengaluru', image: 'https://i.pravatar.cc/150?u=1', text: 'I carry my entire medical history in my phone now. The emergency card feature alone is worth it.', rating: 5 },
  { name: 'Dr. Arjun N.', role: 'Cardiologist', location: 'Apollo Hospitals', image: 'https://i.pravatar.cc/150?u=2', text: 'My patients come in with organized records. It saves 10 minutes per consultation. Exceptional.', rating: 5 },
  { name: 'Meena R.', role: 'Caregiver', location: 'Mumbai', image: 'https://i.pravatar.cc/150?u=3', text: 'Managing my father\'s medications and records used to be chaos. oneHealth changed everything.', rating: 5 },
]

const PARTICLE_COUNT = 15

export default function Landing() {
  const [authIntent, setAuthIntent] = useState(null)
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -200])

  const handleRoleSelect = (role) => {
    if (authIntent === 'login') {
      navigate(role === 'doctor' ? '/doctor/login' : '/login')
    } else {
      navigate(role === 'doctor' ? '/doctor/register' : '/register')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1121] relative overflow-hidden transition-colors duration-300 font-sans selection:bg-blue-500/30">
      
      {/* --- BACKGROUND MESH & PARTICLES --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[20%] w-[900px] h-[900px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[150px]" 
        />
        
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-[2px]"
            style={{
              width: (i % 5 + 2) * 4, height: (i % 5 + 2) * 4,
              left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%`,
            }}
            animate={{ y: [0, -150, 0], x: [0, (i % 3 - 1) * 50, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* --- AUTH MODAL --- */}
      <AnimatePresence>
        {authIntent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4"
            onClick={() => setAuthIntent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-white/10 p-8 relative"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
              
              <div className="text-center mb-10 relative z-10">
                <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" onError={(e) => e.target.style.display = 'none'} />
                <h2 className="text-3xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">
                  {authIntent === 'login' ? 'Welcome Back' : 'Join oneHealth'}
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm font-medium">Select your account type to continue</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleSelect('patient')}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/10 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100">Patient</h3>
                    <p className="text-xs text-blue-600/70 dark:text-blue-300 mt-1">Access my passport</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleSelect('doctor')}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Stethoscope size={24} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Doctor</h3>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-300 mt-1">Manage my clinic</p>
                  </div>
                </motion.button>
              </div>

              <div className="mt-8 text-center relative z-10">
                <Button variant="ghost" onClick={() => setAuthIntent(null)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVBAR --- */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ scale: 1.05 }} className="relative flex items-center justify-center w-10 h-10">
               <img src="/logo.png" alt="oneHealth Logo" className="w-10 h-10 object-contain drop-shadow-md z-10" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
               {/* Fallback if logo.png is missing */}
               <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl items-center justify-center shadow-lg">
                  <HeartPulse size={20} className="text-white" />
               </div>
            </motion.div>
            <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">oneHealth</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
            <a href="#doctors" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">For Doctors</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold hidden sm:flex" onClick={() => setAuthIntent('login')}>Log In</Button>
            <Button className="font-semibold shadow-lg shadow-blue-500/25 rounded-full px-6" onClick={() => setAuthIntent('register')}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/30 text-sm font-bold text-blue-700 dark:text-blue-300 mb-8 shadow-sm backdrop-blur-md"
            >
              <Zap size={16} className="text-amber-500 animate-pulse" />
              Powered by Google Gemini AI
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              Your Lifetime <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 animate-gradient-x bg-[length:200%_auto]">
                Health Passport.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
              oneHealth unifies your medical history, delivers AI-powered health insights, and ensures critical data is ready for emergencies — all in one beautifully secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="xl" className="rounded-full shadow-2xl shadow-blue-500/30 text-lg px-8 py-7" rightIcon={<ArrowRight size={22} />} onClick={() => setAuthIntent('register')}>
                Create Free Account
              </Button>
              <Link to="/emergency">
                <Button size="xl" variant="outline" className="rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-lg px-8 py-7 border-slate-300 dark:border-slate-700">
                  View Emergency Card
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 flex-wrap">
              {['HIPAA Compliant', 'AES-256 Encryption', 'AI Verified'].map((badge, idx) => (
                <div key={badge} className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive 3D Visualization */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[500px] lg:h-[600px] w-full perspective-1000 hidden md:block"
          >
            {/* Center Logo Orb */}
            <motion.div 
              animate={{ y: [-15, 15, -15], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-emerald-500/10 blur-xl flex items-center justify-center border border-white/20"
            >
              <img src="/logo.png" alt="Logo Orb" className="w-32 h-32 object-contain drop-shadow-2xl" onError={(e) => e.target.style.display = 'none'} />
            </motion.div>

            {/* Floating Card 1: Health Score */}
            <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[15%] left-[5%] z-20">
              <PremiumGlassCard className="p-5 flex items-center gap-4 w-60 rotate-[-5deg]">
                <div className="p-3 rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                  <ActivitySquare size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black tracking-wider text-slate-500 uppercase">Health Score</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">94<span className="text-sm font-bold text-emerald-500 ml-1">Excellent</span></p>
                </div>
              </PremiumGlassCard>
            </motion.div>

            {/* Floating Card 2: Emergency */}
            <motion.div animate={{ y: [0, 25, 0], x: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute top-[50%] right-[0%] z-30">
              <PremiumGlassCard className="p-5 w-64 rotate-[3deg] border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-red-100/80 dark:bg-red-900/50 text-red-600">
                    <AlertTriangle size={20} />
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Emergency Ready</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300">O+</span>
                  <span className="px-2 py-1 bg-red-50 dark:bg-red-900/30 rounded text-xs font-bold text-red-600 dark:text-red-400">Penicillin Allergy</span>
                </div>
              </PremiumGlassCard>
            </motion.div>

            {/* Floating Card 3: AI Diagnosis */}
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-[10%] left-[15%] z-20">
              <PremiumGlassCard className="p-4 flex items-center gap-4 w-56 rotate-[-2deg]">
                <div className="p-3 rounded-2xl bg-purple-100/80 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                  <Brain size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">AI Diagnosis</p>
                  <p className="text-[11px] font-bold text-slate-500">Analysis complete</p>
                </div>
              </PremiumGlassCard>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-10 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50 dark:divide-slate-800/50">
            {stats.map((s, i) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2 drop-shadow-sm">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Intelligence built into every interaction.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-slate-600 dark:text-slate-400 font-medium">
              We redesigned the healthcare experience from the ground up, utilizing cutting-edge AI to keep you informed, secure, and ready.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <PremiumGlassCard key={f.title} className="p-8 cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                </PremiumGlassCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (ANIMATED TIMELINE) --- */}
      <section id="how-it-works" className="relative z-10 py-32 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-lg border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">Seamless Onboarding</h2>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full" />
            
            {[
              { step: '01', title: 'Create Account', desc: 'Secure, passwordless OTP entry.' },
              { step: '02', title: 'Build Profile', desc: 'Log allergies, vitals, and emergency contacts.' },
              { step: '03', title: 'Upload Reports', desc: 'AI extracts metrics from any PDF lab report.' },
              { step: '04', title: 'Always Ready', desc: 'Instant access via QR code for emergencies.' },
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={cn(
                  "relative flex items-center mb-16 md:mb-24 w-full",
                  i % 2 === 0 ? "md:justify-start" : "md:justify-end"
                )}
              >
                {/* Timeline Node */}
                <div className="absolute left-6 md:left-1/2 w-12 h-12 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/30 z-10 border-4 border-[#F8FAFC] dark:border-[#0B1121]">
                  {item.step}
                </div>
                
                {/* Content Card */}
                <div className={cn(
                  "ml-16 md:ml-0 md:w-[45%]",
                  i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                )}>
                  <PremiumGlassCard className="p-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                  </PremiumGlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DOCTORS SECTION --- */}
      <section id="doctors" className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">Built for Doctors Too.</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed">
              Experience a clinical dashboard that actually saves time. Generate AI prescriptions, instantly review patient histories, and manage feedback analytics with zero friction.
            </p>
            <ul className="space-y-4 mb-10">
              {['Smart Patient Timeline', 'AI Consultation Insights', 'One-Click Prescription Builder'].map(feature => (
                <li key={feature} className="flex items-center gap-3 text-lg font-bold text-slate-700 dark:text-slate-300">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600">
                    <Check size={16} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <Button size="xl" className="rounded-full shadow-lg" onClick={() => setAuthIntent('register')}>
              Join as a Doctor
            </Button>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
            <motion.div 
              initial={{ opacity: 0, x: 100, rotateY: 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative rounded-2xl overflow-hidden border-8 border-slate-900 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 aspect-[4/3] flex flex-col"
            >
              <div className="h-8 bg-slate-900 dark:bg-slate-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 p-6 relative">
                {/* Mock UI Elements */}
                <div className="h-10 bg-slate-100 dark:bg-slate-900 rounded-lg w-1/3 mb-6" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-24 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50" />
                  <div className="h-24 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/50" />
                  <div className="h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50" />
                </div>
                <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800" />
                
                {/* Floating Notification */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-6 right-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={20} /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Prescription Sent</div>
                    <div className="text-xs text-slate-500">To patient's passport</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS CAROUSEL --- */}
      <section className="relative z-10 py-32 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Trusted by Thousands</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <PremiumGlassCard key={i} className="p-8 flex flex-col h-full">
                <Quote size={40} className="text-blue-200 dark:text-blue-900/50 mb-6" />
                <p className="text-lg text-slate-700 dark:text-slate-300 font-medium italic mb-8 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.role}, {t.location}</p>
                  </div>
                </div>
              </PremiumGlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <PremiumGlassCard className="p-16 text-center bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 border-none shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">Ready to take control?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">
                Join the platform that is reshaping modern healthcare. Free for patients, powerful for doctors.
              </p>
              <Button size="xl" className="bg-white text-blue-600 hover:bg-slate-50 rounded-full shadow-2xl px-10 py-7 text-lg font-black" rightIcon={<ArrowRight size={22} />} onClick={() => setAuthIntent('register')}>
                Get Started Now
              </Button>
            </div>
          </PremiumGlassCard>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
              <div className="hidden w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                <HeartPulse size={16} className="text-white" />
              </div>
              <span className="font-black text-2xl text-slate-900 dark:text-white">oneHealth</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
              The AI-powered health passport. Unifying medical records, simplifying diagnosis, and preparing you for any emergency.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3 font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600">Patient Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-600">Doctor Portal</a></li>
              <li><a href="#" className="hover:text-blue-600">Emergency Access</a></li>
              <li><a href="#" className="hover:text-blue-600">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm font-medium text-slate-500">
          <p>© 2026 oneHealth. All rights reserved.</p>
          <p>Designed with premium AI aesthetics.</p>
        </div>
      </footer>
    </div>
  )
}
