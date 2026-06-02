import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse, Mail, Phone, Lock, User, ArrowRight, Check, Key } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { GlassCard } from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'

const AUTH_PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  width: (i * 9) % 30 + 10,
  height: (i * 9) % 30 + 10,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23) % 100}%`,
  x: [0, (i * 11) % 30 - 15, 0],
  duration: (i * 7) % 10 + 15,
}))

function FloatingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px]" />
      {AUTH_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-500/10 dark:bg-blue-400/5 blur-sm"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -60, 0],
            x: p.x,
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-[var(--color-accent)] z-50" />
      <FloatingBackground />
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 180 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center shadow-lg"
            >
              <HeartPulse size={24} className="text-white" />
            </motion.div>
            <span className="text-2xl font-black text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors">oneHealth</span>
          </Link>
        </motion.div>

        <GlassCard hoverGlow className="p-8 border border-white/20 dark:border-white/5 relative">
          <Link to="/" className="absolute top-4 right-4 text-xs font-semibold text-slate-500 hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors z-20">
            ← Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-2xl font-black text-[var(--color-text-primary)] mb-1">{title}</h1>
            {subtitle && <p className="text-[var(--color-text-secondary)] text-sm mb-6">{subtitle}</p>}
            {children}
          </motion.div>
        </GlassCard>
      </div>
    </div>
  )
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(false)
    // We can simulate an active loading spinner transition
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setUser({ uid: 'mock-uid', email: form.email, name: 'Priya Sharma' }, 'mock-token', 'patient')
    navigate('/dashboard')
  }

  return (
    <AuthLayout title="Welcome back 👋" subtitle="Sign in to access your Health Passport.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="login-email" label="Email or Mobile" required
          placeholder="priya@example.com or +91..."
          leftIcon={<Mail size={16} />}
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <Input
          id="login-password" label="Password" type="password" required
          placeholder="Your password"
          leftIcon={<Lock size={16} />}
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <div className="flex justify-end">
          <Link to="#" className="text-sm text-[var(--color-primary)] hover:underline font-medium">Forgot password?</Link>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" isLoading={loading} className="w-full h-11 mt-2 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" rightIcon={<ArrowRight size={16} />}>
            Sign In
          </Button>
        </motion.div>
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    navigate('/onboarding')
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start your lifelong health journey — free forever.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="reg-name" label="Full Name" required placeholder="Priya Sharma" leftIcon={<User size={16} />} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Input id="reg-email" label="Email Address" type="email" required placeholder="priya@example.com" leftIcon={<Mail size={16} />} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <Input id="reg-phone" label="Mobile Number" type="tel" required placeholder="+91 98765 43210" leftIcon={<Phone size={16} />} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <Input id="reg-password" label="Password" type="password" required placeholder="Min 8 characters" leftIcon={<Lock size={16} />} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} hint="At least 8 characters" />

        <label className="flex items-start gap-3 cursor-pointer mt-2">
          <input type="checkbox" required className="mt-1 accent-[var(--color-primary)] cursor-pointer" />
          <span className="text-xs text-[var(--color-text-muted)]">
            I agree to the <a href="#" className="text-[var(--color-primary)] hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-[var(--color-primary)] hover:underline">Privacy Policy</a>
          </span>
        </label>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" isLoading={loading} className="w-full h-11 mt-2 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300" rightIcon={<ArrowRight size={16} />}>
            Create Account
          </Button>
        </motion.div>
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function OTP() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const navigate = useNavigate()

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 5) {
      const nextEl = document.getElementById(`otp-${idx + 1}`)
      if (nextEl) nextEl.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      const prevEl = document.getElementById(`otp-${idx - 1}`)
      if (prevEl) prevEl.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    navigate('/onboarding')
  }

  return (
    <AuthLayout title="Verify your number" subtitle="We sent a 6-digit code to your mobile. Enter it below.">
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex gap-2 justify-center">
          {code.map((c, i) => (
            <motion.input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={c}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileFocus={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-data shadow-sm"
            />
          ))}
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" isLoading={loading} className="w-full h-11 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all" disabled={code.join('').length < 6}>
            Verify & Continue
          </Button>
        </motion.div>
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Didn't receive a code?{' '}
          <button type="button" className="text-[var(--color-primary)] font-semibold hover:underline">Resend (30s)</button>
        </p>
      </form>
    </AuthLayout>
  )
}
