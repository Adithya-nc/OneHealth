import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Sun, Moon, Monitor, AlertTriangle, LogOut,
  Check, Pill, FileText, UserCheck, Settings2, X, BellOff
} from 'lucide-react'
import { useUIStore, applyTheme } from '../../store/uiStore'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore, NOTIFICATION_ICONS } from '../../store/notificationStore'
import { Avatar } from '../ui/index'
import { Button } from '../ui/Button'
import { cn } from '../../utils/formatters'
import { formatRelative } from '../../utils/formatters'

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

const NOTIF_TYPE_ICON = {
  medication:  <Pill size={14} />,
  report:      <FileText size={14} />,
  doctor:      <UserCheck size={14} />,
  consent:     <Settings2 size={14} />,
  emergency:   <AlertTriangle size={14} />,
  system:      <Settings2 size={14} />,
  appointment: <Bell size={14} />,
}

const NOTIF_TYPE_COLOR = {
  medication:  'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  report:      'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  doctor:      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  consent:     'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  emergency:   'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
  system:      'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
  appointment: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
}

function NotificationPanel({ onClose }) {
  const notifications = useNotificationStore(s => s.notifications)
  const markRead = useNotificationStore(s => s.markRead)
  const markAllRead = useNotificationStore(s => s.markAllRead)
  const removeNotification = useNotificationStore(s => s.removeNotification)
  const clearRead = useNotificationStore(s => s.clearRead)
  const unreadCount = useNotificationStore(s => s.getUnreadCount())

  const navigate = useNavigate()

  const handleClick = (notif) => {
    markRead(notif.id)
    if (notif.action?.href) {
      navigate(notif.action.href)
    }
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-[360px] max-h-[520px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/50">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-[var(--color-primary)]" />
          <span className="text-sm font-bold text-[var(--color-text-primary)]">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black bg-[var(--color-danger)] text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-[var(--color-primary)] hover:underline font-semibold px-2 py-1"
            >
              Mark all read
            </button>
          )}
          {notifications.some(n => n.read) && (
            <button
              onClick={clearRead}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] font-medium px-2 py-1"
            >
              Clear read
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <BellOff size={28} className="text-[var(--color-text-muted)] mb-3" />
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">All caught up!</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">No notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]/50">
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 cursor-pointer group transition-colors hover:bg-[var(--color-surface-2)]/70',
                  !notif.read && 'bg-blue-50/40 dark:bg-blue-500/5'
                )}
                onClick={() => handleClick(notif)}
              >
                {/* Icon */}
                <div className={cn('p-2 rounded-xl flex-shrink-0 mt-0.5', NOTIF_TYPE_COLOR[notif.type] || NOTIF_TYPE_COLOR.system)}>
                  {NOTIF_TYPE_ICON[notif.type] || <Bell size={14} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-bold text-[var(--color-text-primary)] truncate',
                    !notif.read && 'font-black'
                  )}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{formatRelative(notif.timestamp)}</p>
                </div>

                {/* Unread dot + remove */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeNotification(notif.id) }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-all"
                    aria-label="Remove notification"
                  >
                    <X size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[var(--color-border)] px-4 py-2 bg-[var(--color-surface-2)]/30">
          <button
            onClick={() => { navigate('/settings'); onClose() }}
            className="text-xs text-[var(--color-primary)] hover:underline font-semibold w-full text-center"
          >
            Notification settings →
          </button>
        </div>
      )}
    </motion.div>
  )
}

export function Header({ title, subtitle }) {
  const profile = useUserStore(s => s.profile)
  const healthMetrics = useUserStore(s => s.healthMetrics)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()
  const score = healthMetrics?.health_score || 0

  const notifications = useNotificationStore(s => s.notifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  // Close notification panel on outside click
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const scoreColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
  const scoreBg   = score >= 70 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                  : score >= 40 ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
                  : 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'

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
        {score > 0 && (
          <div className={cn('hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border', scoreBg)}>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: score >= 70 ? '#0E9F6E' : score >= 40 ? '#d97706' : '#E02424' }}
            />
            <span className={cn('text-xs font-semibold', scoreColor)}>{score} Health Score</span>
          </div>
        )}

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
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-colors"
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Avatar / Profile link */}
        <Link to="/settings" aria-label="Profile settings">
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
