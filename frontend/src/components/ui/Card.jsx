import React, { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../../utils/formatters'

export const Card = React.forwardRef(({ className, hover = false, glass = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-sm)] transition-all duration-200',
      hover && 'hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer',
      glass && 'glass',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export const GlassCard = React.forwardRef(({ className, children, hoverGlow = true, ...props }, ref) => {
  const localRef = useRef(null)
  const activeRef = ref || localRef

  // Mouse hover 3D tilt metrics
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-200, 200], [10, -10])
  const rotateY = useTransform(x, [-200, 200], [-10, 10])

  const handleMouseMove = (e) => {
    if (!activeRef.current) return
    const rect = activeRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={activeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{
        scale: 1.025,
        translateY: -4,
        z: 20,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className={cn(
        'rounded-2xl border border-white/20 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden transition-colors duration-300 hover:border-blue-500/30',
        hoverGlow && 'hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)]',
        className
      )}
      {...props}
    >
      {/* Light follow gradient reflection overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" 
        style={{ transform: 'translateZ(5px)' }}
      />
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" 
        style={{ transform: 'translateZ(-1px)' }}
      />
      <div className="relative z-10" style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </motion.div>
  )
})
GlassCard.displayName = 'GlassCard'

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight text-[var(--color-text-primary)]', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-[var(--color-text-secondary)]', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'
