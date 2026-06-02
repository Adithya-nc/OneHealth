import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: null,
      healthMetrics: null,
      isProfileLoading: false,

      // Action to fetch real data from the Flask Backend
      fetchProfile: async () => {
        set({ isProfileLoading: true })
        try {
          // This calls the /api/patients/profile endpoint
          const response = await api.get('/patients/profile')
          set({
            profile: response.data.profile,
            healthMetrics: response.data.metrics,
            isProfileLoading: false
          })
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          set({ isProfileLoading: false })
        }
      },

      setProfile: (profile) => set({ profile }),
      setHealthMetrics: (metrics) => set({ healthMetrics: metrics }),
      updateProfile: (partial) => set((s) => ({
        profile: { ...s.profile, ...partial }
      })),
      setProfileLoading: (v) => set({ isProfileLoading: v }),
    }),
    { name: 'onehealth-user', partialize: (s) => ({ profile: s.profile }) }
  )
)
