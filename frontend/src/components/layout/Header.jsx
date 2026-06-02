import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Sun, Moon, Monitor, Search, AlertTriangle, LogOut } from 'lucide-react'
import { useUIStore, applyTheme } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { Avatar } from '../ui/index'
import { Button } from '../ui/Button'
import { cn } from '../../utils/formatters'

function ThemeToggle() {
  const theme = useUIStore(s => s.theme)
  const setTheme = useUIStore(s => s.setTheme)
  const themes = [
    { id: 'light',  icon: <Sun size={14} /> },
    { id: 'dark',   icon: <Moon size={14} /> },
    { id: 'system', icon: <Monitor size={14} /> },
  ]
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.id}
          className={cn(
            'p-1.5 rounded-md transition-all',
            theme === t.id
              ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          )}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}

export function Header({ title, subtitle }) {
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)
  const notificationCount = useUIStore(s => s.notificationCount)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const score = healthMetrics?.health_score || 0

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const scoreColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
  const scoreBg   = score >= 70 ? 'bg-emerald-50'    : score >= 40 ? 'bg-amber-50'    : 'bg-red-50'

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-4">
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <div>
            <h1 className="text-base font-semibold text-[var(--color-text-primary)] truncate">{title}</h1>
            {subtitle && <p className="text-xs text-[var(--color-text-muted)] truncate">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Health Score Pill */}
        <div className={cn('hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border', scoreBg)}>
          <div className="w-2 h-2 rounded-full bg-current" style={{ color: score >= 70 ? '#0E9F6E' : score >= 40 ? '#d97706' : '#E02424' }} />
          <span className={cn('text-xs font-semibold', scoreColor)}>{score} Health Score</span>
        </div>

        {/* Emergency button */}
        <Link to="/emergency">
          <Button variant="destructive" size="sm" className="hidden sm:flex gap-1.5">
            <AlertTriangle size={14} />
            Emergency
          </Button>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-colors" aria-label="Notifications">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <Link to="/settings">
          <Avatar name={profile?.name || 'User'} src={profile?.profile?.photo_url} size="sm" />
        </Link>

        {/* Sign Out (Mobile) */}
        <button 
          onClick={handleLogout}
          className="md:hidden relative p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600 transition-colors" 
          aria-label="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
