import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get todos for a specific date - returns a function for reactivity
  function getTodosByDate(date) {
    return todos.value.filter(todo => todo.date === date)
  }

  // Fetch all todos
  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      todos.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  // Create a new todo
  async function createTodo(todoData) {
    loading.value = true
    error.value = null
    try {
      const { data, error: createError } = await supabase
        .from('todos')
        .insert([todoData])
        .select()
      
      if (createError) throw createError
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase')
      }
      
      todos.value.unshift(data[0])
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error creating todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a todo
  async function updateTodo(id, updates) {
    loading.value = true
    error.value = null
    try {
      const { data, error: updateError } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (updateError) throw updateError
      
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = data[0]
      }
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error updating todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a todo
  async function deleteTodo(id) {
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting todo:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Toggle todo completed status
  async function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      await updateTodo(id, { completed: !todo.completed })
    }
  }

  return {
    todos,
    loading,
    error,
    getTodosByDate,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  }
})
