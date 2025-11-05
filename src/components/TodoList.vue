<template>
  <div class="card">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <h2 class="text-xl md:text-2xl font-bold text-tech-accent flex items-center gap-2">
        <span>✅</span>
        <span>รายการ Todo</span>
      </h2>
      <p class="text-sm text-tech-green-400">
        {{ formatDateThai(selectedDate) }}
      </p>
    </div>

    <!-- Add Todo Form -->
    <form @submit.prevent="handleAddTodo" class="mb-6">
      <div class="flex gap-2">
        <input
          v-model="newTodoTitle"
          type="text"
          placeholder="เพิ่มรายการใหม่..."
          class="input-field flex-1"
          :disabled="todoStore.loading"
        />
        <button 
          type="submit"
          class="btn-primary whitespace-nowrap"
          :disabled="!newTodoTitle.trim() || todoStore.loading"
        >
          <span class="hidden md:inline">เพิ่มรายการ</span>
          <span class="md:hidden">+</span>
        </button>
      </div>
      
      <!-- Show error below form -->
      <div v-if="todoStore.error" class="mt-2 bg-red-900/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
        ❌ {{ todoStore.error }}
      </div>
    </form>

    <!-- Todo Stats -->
    <div class="grid grid-cols-3 gap-2 mb-6">
      <div class="bg-tech-darker/50 rounded-lg p-3 text-center border border-tech-green-900">
        <p class="text-2xl font-bold text-tech-green-400">{{ todosForSelectedDate.length }}</p>
        <p class="text-xs text-tech-green-600">ทั้งหมด</p>
      </div>
      <div class="bg-tech-darker/50 rounded-lg p-3 text-center border border-tech-green-900">
        <p class="text-2xl font-bold text-tech-accent">{{ completedCount }}</p>
        <p class="text-xs text-tech-green-600">เสร็จแล้ว</p>
      </div>
      <div class="bg-tech-darker/50 rounded-lg p-3 text-center border border-tech-green-900">
        <p class="text-2xl font-bold text-yellow-400">{{ pendingCount }}</p>
        <p class="text-xs text-tech-green-600">รอดำเนินการ</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="todoStore.loading && !todosForSelectedDate.length" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-tech-green-500 border-t-transparent"></div>
      <p class="text-tech-green-400 mt-2">กำลังโหลด...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="todoStore.error" class="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
      <p>เกิดข้อผิดพลาด: {{ todoStore.error }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!todosForSelectedDate.length" class="text-center py-12">
      <div class="text-6xl mb-4">📝</div>
      <p class="text-tech-green-400">ยังไม่มีรายการในวันนี้</p>
      <p class="text-tech-green-600 text-sm mt-2">เริ่มต้นเพิ่มรายการเพื่อติดตามความคืบหน้าของคุณ</p>
    </div>

    <!-- Todo List -->
    <div v-else class="space-y-3">
      <TransitionGroup name="todo-list">
        <TodoItem
          v-for="todo in sortedTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="handleToggle"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import TodoItem from './TodoItem.vue'
import { toThailandISO, formatThaiDate } from '../utils/thailandTime'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const todoStore = useTodoStore()
const newTodoTitle = ref('')

const todosForSelectedDate = computed(() => {
  return todoStore.getTodosByDate(props.selectedDate)
})

const sortedTodos = computed(() => {
  return [...todosForSelectedDate.value].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.created_at) - new Date(a.created_at)
    }
    return a.completed ? 1 : -1
  })
})

const completedCount = computed(() => {
  return todosForSelectedDate.value.filter(t => t.completed).length
})

const pendingCount = computed(() => {
  return todosForSelectedDate.value.filter(t => !t.completed).length
})

function formatDateThai(dateStr) {
  const date = new Date(dateStr)
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  
  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear() + 543
  
  return `${dayName}ที่ ${day} ${month} ${year}`
}

async function handleAddTodo() {
  if (!newTodoTitle.value.trim()) return
  
  try {
    const newTodo = {
      title: newTodoTitle.value.trim(),
      date: props.selectedDate,  // ใช้วันที่ที่เลือก (YYYY-MM-DD)
      completed: false,
      created_at: toThailandISO()  // ใช้เวลาไทยสำหรับ timestamp
    }
    
    await todoStore.createTodo(newTodo)
    newTodoTitle.value = ''
    
    // Refresh to ensure UI updates
    await todoStore.fetchTodos()
    
  } catch (err) {
    console.error('❌ Failed to add todo:', err)
    alert('เกิดข้อผิดพลาด: ' + err.message)
  }
}

async function handleToggle(id) {
  try {
    await todoStore.toggleTodo(id)
  } catch (err) {
    console.error('Failed to toggle todo:', err)
    alert('ไม่สามารถอัพเดทสถานะได้')
  }
}

async function handleEdit(id, newTitle) {
  try {
    await todoStore.updateTodo(id, { title: newTitle })
  } catch (err) {
    console.error('Failed to update todo:', err)
    alert('ไม่สามารถแก้ไขได้')
  }
}

async function handleDelete(id) {
  try {
    await todoStore.deleteTodo(id)
  } catch (err) {
    console.error('Failed to delete todo:', err)
    alert('ไม่สามารถลบได้')
  }
}
</script>

<style scoped>
.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
