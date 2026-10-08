import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'medication',
    title: 'Medication Reminder',
    message: 'Amlodipine 5mg is due at 09:00 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    read: false,
    action: { label: 'View Medications', href: '/medications' },
  },
  {
    id: 'notif-002',
    type: 'report',
    title: 'AI Analysis Complete',
    message: 'Your CBC report has been analyzed. Review the insights.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    action: { label: 'View Report', href: '/passport' },
  },
  {
    id: 'notif-003',
    type: 'doctor',
    title: 'Doctor Access Request',
    message: 'Dr. Arjun Nair has requested access to your health passport.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    action: { label: 'Review Request', href: '/settings' },
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Health Score Updated',
    message: 'Your monthly health score has been recalculated: 88/100 (+4 points)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    action: { label: 'View Dashboard', href: '/dashboard' },
  },
]

const NOTIFICATION_ICONS = {
  medication: '💊',
  report: '📋',
  doctor: '👨‍⚕️',
  consent: '🔑',
  emergency: '🚨',
  system: '⚙️',
  appointment: '📅',
}

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: INITIAL_NOTIFICATIONS,

      // Computed: unread count
      getUnreadCount: () => get().notifications.filter(n => !n.read).length,

      // Mark a single notification read
      markRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      // Mark all as read
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),

      // Add a notification (called by other parts of the app)
      addNotification: (notif) => set((s) => ({
        notifications: [
          {
            id: `notif-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notif,
          },
          ...s.notifications,
        ].slice(0, 50), // cap at 50
      })),

      // Remove a specific notification
      removeNotification: (id) => set((s) => ({
        notifications: s.notifications.filter(n => n.id !== id)
      })),

      // Clear all read notifications
      clearRead: () => set((s) => ({
        notifications: s.notifications.filter(n => !n.read)
      })),
    }),
    {
      name: 'onehealth-notifications',
      partialize: (s) => ({ notifications: s.notifications }),
    }
  )
)

export { NOTIFICATION_ICONS }
