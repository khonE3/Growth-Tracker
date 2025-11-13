import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'

export const useDailyTaskStore = defineStore('dailyTask', () => {
  const dailyTasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch all daily tasks (Guest or User based on auth state)
  async function fetchDailyTasks() {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      let query = supabase
        .from('daily_tasks')
        .select('*')
        .order('display_order', { ascending: true })

      // Filter based on auth state
      if (authStore.isGuest) {
        query = query.eq('is_guest', true)
      } else {
        query = query.eq('is_guest', false).eq('user_id', authStore.currentUserId)
      }
      
      const { data, error: fetchError } = await query
      
      if (fetchError) throw fetchError
      dailyTasks.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching daily tasks:', err)
    } finally {
      loading.value = false
    }
  }

  // Create a new daily task
  async function createDailyTask(taskData) {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      
      // Add auth fields
      const newTask = {
        ...taskData,
        is_guest: authStore.isGuest,
        user_id: authStore.isGuest ? null : authStore.currentUserId
      }

      const { data, error: createError } = await supabase
        .from('daily_tasks')
        .insert([newTask])
        .select()
      
      if (createError) throw createError
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase')
      }
      
      dailyTasks.value.push(data[0])
      // Re-sort by display_order
      dailyTasks.value.sort((a, b) => a.display_order - b.display_order)
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error creating daily task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a daily task
  async function updateDailyTask(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('daily_tasks')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (updateError) throw updateError
      
      const index = dailyTasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        dailyTasks.value[index] = data[0]
      }
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error updating daily task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a daily task
  async function deleteDailyTask(id) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      dailyTasks.value = dailyTasks.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting daily task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Toggle daily task completed status
  async function toggleDailyTask(id) {
    const task = dailyTasks.value.find(t => t.id === id)
    if (task) {
      await updateDailyTask(id, { completed: !task.completed })
    }
  }

  // Reset all tasks (set completed to false) - useful for new day
  async function resetAllTasks() {
    loading.value = true
    error.value = null
    try {
      const { error: updateError } = await supabase
        .from('daily_tasks')
        .update({ completed: false })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Update all
      
      if (updateError) throw updateError
      
      // Update local state
      dailyTasks.value.forEach(task => {
        task.completed = false
      })
    } catch (err) {
      error.value = err.message
      console.error('Error resetting tasks:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    dailyTasks,
    loading,
    error,
    fetchDailyTasks,
    createDailyTask,
    updateDailyTask,
    deleteDailyTask,
    toggleDailyTask,
    resetAllTasks
  }
})
