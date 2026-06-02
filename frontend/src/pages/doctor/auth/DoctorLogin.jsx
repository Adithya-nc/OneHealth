import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { Button, Input, GlassCard } from '../../../components/ui'

export function DoctorLogin() {
  const navigate = useNavigate()
  const { setUser, setLoading, isLoading } = useAuthStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setUser({ name: 'Sarah Smith', email, role: 'doctor' }, 'mock-token', 'doctor')
      setLoading(false)
      navigate('/doctor/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Branding / Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex flex-col justify-between relative overflow-hidden rounded-3xl md:rounded-r-none md:rounded-l-3xl shadow-xl"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-bold text-2xl mb-12">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="p-2 bg-white/20 rounded-xl"
              >
                <Stethoscope className="w-6 h-6 text-white" />
              </motion.div>
              oneHealth Pro
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold leading-tight mb-8"
            >
              The advanced portal for modern healthcare professionals.
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 text-blue-100/90 text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>AI-powered consultation summaries</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Comprehensive patient health passports</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>Real-time sentiment and feedback analytics</span>
              </div>
            </motion.div>
          </div>
          
          <div className="relative z-10 text-xs text-blue-200/70">
            © 2026 oneHealth Inc. All rights reserved.
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:w-1/2"
        >
          <GlassCard className="h-full rounded-3xl md:rounded-l-none md:rounded-r-3xl flex flex-col justify-center p-8 md:p-12 relative z-10 border-l-0 dark:border-white/5">
            <Link to="/" className="absolute top-6 right-6 text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors z-20">
              ← Home
            </Link>
            {/* Mobile Header */}
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600 mb-8 md:hidden">
              <Stethoscope className="w-6 h-6" />
              oneHealth Pro
            </div>

            <div className="max-w-md w-full mx-auto">
              <div>
                <h2 className="text-3xl font-black text-[var(--color-text-primary)] mb-2">Welcome back, Doctor</h2>
                <p className="text-[var(--color-text-secondary)] text-sm mb-8">Sign in to access your dashboard and patient records.</p>
                
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-1.5">Professional Email</label>
                    <Input 
                      type="email" 
                      placeholder="doctor@hospital.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Password</label>
                      <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
                    </div>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                      isLoading={isLoading}
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                  
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--color-border)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[var(--color-surface)]/80 backdrop-blur-md rounded-full text-[var(--color-text-muted)]">Or continue with</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    type="button" 
                    whileHover={{ y: -2 }}
                    className="w-full h-12 flex items-center justify-center gap-3 border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-[var(--color-text-primary)] font-semibold rounded-xl transition-all duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google Workspace
                  </motion.button>
                </form>
                
                <p className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
                  New to oneHealth?{' '}
                  <Link to="/doctor/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                    Register your practice
                  </Link>
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
