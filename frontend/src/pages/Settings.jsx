import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, Bell, Palette, Lock, Heart, UserCheck,
  ChevronRight, Check, AlertTriangle, Phone, Mail,
  Eye, EyeOff, Trash2, Download, LogOut, Stethoscope
} from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { useNotificationStore } from '../store/notificationStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Avatar } from '../components/ui/index'
import { useToast } from '../components/ui/Toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/formatters'

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'account',       label: 'Account',          icon: User },
  { id: 'security',      label: 'Security',          icon: Shield },
  { id: 'notifications', label: 'Notifications',     icon: Bell },
  { id: 'appearance',    label: 'Appearance',        icon: Palette },
  { id: 'privacy',       label: 'Privacy',           icon: Lock },
  { id: 'emergency',     label: 'Emergency Data',    icon: Heart },
  { id: 'consent',       label: 'Doctor Consent',    icon: UserCheck },
]

// ─── Reusable section shell ───────────────────────────────────────────────────
function SettingsSection({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-b border-[var(--color-border)] pb-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
        {description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>}
      </div>
      {children}
    </motion.div>
  )
}

function SettingsRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-[var(--color-border)]/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
        value ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-strong)]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          value ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

// ─── Section: Account ────────────────────────────────────────────────────────
function AccountSection() {
  const profile = useUserStore(s => s.profile)
  const updateProfile = useUserStore(s => s.updateProfile)
  const toast = useToast()
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateProfile(form)
    setSaving(false)
    toast.success('Profile Updated', 'Your account details have been saved.')
  }

  return (
    <SettingsSection title="Account" description="Manage your personal profile and contact information.">
      <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-2)] rounded-xl">
        <Avatar name={form.name || 'User'} size="lg" />
        <div>
          <p className="font-bold text-[var(--color-text-primary)]">{form.name || 'No name set'}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{form.email}</p>
          <button className="text-xs text-[var(--color-primary)] hover:underline mt-1 font-medium">
            Change photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Input id="s-name" label="Full Name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          leftIcon={<User size={15} />} />
        <Input id="s-email" label="Email Address" type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          leftIcon={<Mail size={15} />} />
        <Input id="s-phone" label="Mobile Number" type="tel" value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          leftIcon={<Phone size={15} />} />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving} leftIcon={<Check size={15} />}>
          Save Changes
        </Button>
      </div>
    </SettingsSection>
  )
}

// ─── Section: Security ───────────────────────────────────────────────────────
function SecuritySection() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const handleChange = async () => {
    if (form.next !== form.confirm) {
      toast.error('Password Mismatch', 'New passwords do not match.')
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    setForm({ current: '', next: '', confirm: '' })
    toast.success('Password Changed', 'Your password has been updated successfully.')
  }

  return (
    <SettingsSection title="Security" description="Manage your password and account security settings.">
      <SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security with SMS or authenticator app.">
        <Button size="sm" variant="outline">Enable 2FA</Button>
      </SettingsRow>

      <div className="space-y-4 pt-2">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Change Password</p>
        <Input id="s-cur-pass" label="Current Password" type={show ? 'text' : 'password'}
          value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button onClick={() => setShow(v => !v)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        <Input id="s-new-pass" label="New Password" type={show ? 'text' : 'password'}
          value={form.next} onChange={e => setForm(f => ({ ...f, next: e.target.value }))}
          leftIcon={<Lock size={15} />} hint="At least 8 characters" />
        <Input id="s-confirm-pass" label="Confirm New Password" type={show ? 'text' : 'password'}
          value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
          leftIcon={<Lock size={15} />} />
        <div className="flex justify-end">
          <Button onClick={handleChange} isLoading={saving} variant="outline">
            Update Password
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <SettingsRow
          label="Active Sessions"
          description="You are currently signed in on this device."
        >
          <Button size="sm" variant="danger_outline">Sign Out All</Button>
        </SettingsRow>
      </div>
    </SettingsSection>
  )
}

// ─── Section: Notifications ──────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    medication: true,
    reports: true,
    appointments: true,
    doctor_access: true,
    health_score: false,
    emergency: true,
  })

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  const toast = useToast()

  const rows = [
    { key: 'medication', label: 'Medication Reminders', description: 'Get notified when a dose is due.' },
    { key: 'reports', label: 'Report Analysis Complete', description: 'When AI finishes analysing an uploaded report.' },
    { key: 'appointments', label: 'Appointment Reminders', description: 'Upcoming consultation alerts.' },
    { key: 'doctor_access', label: 'Doctor Access Requests', description: 'When a doctor requests access to your passport.' },
    { key: 'health_score', label: 'Monthly Health Score', description: 'Periodic health score update notifications.' },
    { key: 'emergency', label: 'Emergency Share Activity', description: 'Alerts when your emergency card is accessed.' },
  ]

  return (
    <SettingsSection title="Notifications" description="Control which notifications you receive.">
      {rows.map(row => (
        <SettingsRow key={row.key} label={row.label} description={row.description}>
          <Toggle value={prefs[row.key]} onChange={() => toggle(row.key)} />
        </SettingsRow>
      ))}
      <div className="flex justify-end pt-2">
        <Button onClick={() => toast.success('Saved', 'Notification preferences updated.')}>
          Save Preferences
        </Button>
      </div>
    </SettingsSection>
  )
}

// ─── Section: Appearance ─────────────────────────────────────────────────────
function AppearanceSection() {
  const theme = useUIStore(s => s.theme)
  const setTheme = useUIStore(s => s.setTheme)

  const options = [
    { id: 'light',  label: 'Light', desc: 'Clean white interface' },
    { id: 'dark',   label: 'Dark',  desc: 'Easy on the eyes' },
    { id: 'system', label: 'System', desc: 'Follows OS preference' },
  ]

  return (
    <SettingsSection title="Appearance" description="Customise how oneHealth looks.">
      <div className="grid grid-cols-3 gap-3">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              theme === opt.id
                ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-500/10'
                : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
            )}
          >
            <p className={cn('text-sm font-bold', theme === opt.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]')}>
              {opt.label}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{opt.desc}</p>
            {theme === opt.id && (
              <Check size={14} className="text-[var(--color-primary)] mt-2" />
            )}
          </button>
        ))}
      </div>
    </SettingsSection>
  )
}

// ─── Section: Privacy ────────────────────────────────────────────────────────
function PrivacySection() {
  const toast = useToast()
  return (
    <SettingsSection title="Privacy" description="Control your data and privacy settings.">
      <SettingsRow label="Data Download" description="Download a copy of all your health data in JSON format.">
        <Button size="sm" variant="outline" leftIcon={<Download size={14} />}>
          Export Data
        </Button>
      </SettingsRow>
      <SettingsRow label="Analytics" description="Allow anonymised usage analytics to improve the product.">
        <Toggle value={false} onChange={() => {}} />
      </SettingsRow>
      <SettingsRow label="AI Learning" description="Allow your interactions to improve AI health models (anonymised).">
        <Toggle value={false} onChange={() => {}} />
      </SettingsRow>
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
        <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Danger Zone</p>
        <p className="text-xs text-red-600 dark:text-red-400/80 mb-3">Deleting your account is permanent and cannot be undone. All records will be erased.</p>
        <Button size="sm" variant="destructive" leftIcon={<Trash2 size={14} />}
          onClick={() => toast.error('Not Implemented', 'Account deletion requires additional confirmation. Contact support.')}>
          Delete Account
        </Button>
      </div>
    </SettingsSection>
  )
}

// ─── Section: Emergency Data ─────────────────────────────────────────────────
function EmergencyDataSection() {
  const profile = useUserStore(s => s.profile)
  const p = profile?.profile || profile
  const toast = useToast()

  return (
    <SettingsSection title="Emergency Data" description="This information appears on your Emergency Card for first responders.">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[var(--color-surface-2)] rounded-xl">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">Blood Group</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">{p?.blood_group || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-[var(--color-surface-2)] rounded-xl">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">Allergies</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {p?.allergies?.join(', ') || 'None recorded'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-[var(--color-surface-2)] rounded-xl">
          <div>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">Chronic Conditions</p>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {p?.chronic_diseases?.join(', ') || 'None recorded'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => toast.success('Opening Emergency Card', 'Redirecting...')} variant="outline" leftIcon={<Heart size={14} />}>
          View Emergency Card
        </Button>
        <Button onClick={() => toast.info('Edit', 'Emergency data can be edited via your profile.')} leftIcon={<Check size={14} />}>
          Update Data
        </Button>
      </div>
    </SettingsSection>
  )
}

// ─── Section: Doctor Consent ─────────────────────────────────────────────────
function ConsentSection() {
  const [consents] = useState([
    {
      id: 'con-001',
      doctor: 'Dr. Arjun Nair',
      specialization: 'Pulmonologist',
      hospital: 'City Clinic',
      granted_at: '2026-09-01',
      expires_at: '2026-12-01',
      active: true,
    },
  ])

  const toast = useToast()

  return (
    <SettingsSection title="Doctor Consent" description="Manage which doctors can view your health passport.">
      {consents.length === 0 ? (
        <div className="text-center py-10">
          <Stethoscope size={32} className="text-[var(--color-text-muted)] mx-auto mb-2" />
          <p className="text-sm text-[var(--color-text-secondary)]">No active doctor consents.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {consents.map(c => (
            <div key={c.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Stethoscope size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{c.doctor}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{c.specialization} · {c.hospital}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Access granted: {c.granted_at} · Expires: {c.expires_at}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full">
                  Active
                </span>
                <Button size="sm" variant="danger_outline"
                  onClick={() => toast.success('Consent Revoked', `Access for ${c.doctor} has been revoked.`)}>
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
          ℹ️ Consent is only granted when you explicitly approve a doctor's access request. Revoking access immediately removes their ability to view your data.
        </p>
      </div>
    </SettingsSection>
  )
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function Settings() {
  const [activeSection, setActiveSection] = useState('account')
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SECTION_CONTENT = {
    account:       <AccountSection />,
    security:      <SecuritySection />,
    notifications: <NotificationsSection />,
    appearance:    <AppearanceSection />,
    privacy:       <PrivacySection />,
    emergency:     <EmergencyDataSection />,
    consent:       <ConsentSection />,
  }

  return (
    <div className="page-container py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-2">
            {SECTIONS.map(sec => {
              const Icon = sec.icon
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left',
                    activeSection === sec.id
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {sec.label}
                </button>
              )
            })}

            <div className="my-2 h-px bg-[var(--color-border)]" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150"
            >
              <LogOut size={16} className="flex-shrink-0" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6">
          {SECTION_CONTENT[activeSection]}
        </div>
      </div>
    </div>
  )
}
