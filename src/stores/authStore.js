import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const isGuest = ref(true)

  // Computed
  const isAuthenticated = computed(() => !!user.value && !isGuest.value)
  const currentUserId = computed(() => user.value?.id || null)
  const userEmail = computed(() => user.value?.email || profile.value?.email || '')
  const userName = computed(() => profile.value?.full_name || user.value?.email?.split('@')[0] || 'Guest')

  // Initialize auth state
  async function initialize() {
    loading.value = true
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        user.value = session.user
        isGuest.value = false
        await fetchProfile()
      } else {
        user.value = null
        isGuest.value = true
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          user.value = session.user
          isGuest.value = false
          await fetchProfile()
        } else {
          user.value = null
          profile.value = null
          isGuest.value = true
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch user profile
  async function fetchProfile() {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) throw error
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Sign up with email
  async function signUp(email, password, fullName = '') {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) throw error

      if (data.user) {
        user.value = data.user
        isGuest.value = false
        return { success: true, message: 'Sign up successful! Please check your email to verify your account.' }
      }

      return { success: false, message: 'Sign up failed' }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // Sign in with email
  async function signIn(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        user.value = data.user
        isGuest.value = false
        await fetchProfile()
        return { success: true, message: 'Sign in successful!' }
      }

      return { success: false, message: 'Sign in failed' }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  async function signOut() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      profile.value = null
      isGuest.value = true
      
      return { success: true, message: 'Signed out successfully' }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  // Continue as guest
  function continueAsGuest() {
    user.value = null
    profile.value = null
    isGuest.value = true
  }

  // Update profile
  async function updateProfile(updates) {
    if (!user.value) return { success: false, message: 'Not authenticated' }

    loading.value = true
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.value.id)

      if (error) throw error

      await fetchProfile()
      return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, message: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    profile,
    loading,
    isGuest,
    
    // Computed
    isAuthenticated,
    currentUserId,
    userEmail,
    userName,
    
    // Actions
    initialize,
    fetchProfile,
    signUp,
    signIn,
    signOut,
    continueAsGuest,
    updateProfile
  }
})
