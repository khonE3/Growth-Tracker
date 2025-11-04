<template>
  <div class="card mb-6 border-2 border-tech-accent/30">
    <!-- Header with Badge -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl md:text-2xl font-bold text-tech-accent flex items-center gap-2">
        <span>🔄</span>
        <span>รายการประจำวัน</span>
        <span class="text-xs bg-tech-accent/20 text-tech-accent px-2 py-1 rounded-full">
          ทุกวัน
        </span>
      </h2>
      <button
        v-if="dailyTaskStore.dailyTasks.length > 0"
        @click="resetAll"
        class="text-xs text-tech-green-400 hover:text-tech-accent transition-colors"
        title="รีเซ็ตทั้งหมด"
      >
        รีเซ็ต
      </button>
    </div>

    <!-- Add Daily Task Form -->
    <form @submit.prevent="handleAddTask" class="mb-4">
      <div class="flex gap-2">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="เพิ่มรายการประจำวันใหม่..."
          class="input-field flex-1 text-sm"
          :disabled="dailyTaskStore.loading"
        />
        <button 
          type="submit"
          class="btn-primary text-sm whitespace-nowrap"
          :disabled="!newTaskTitle.trim() || dailyTaskStore.loading"
        >
          + เพิ่ม
        </button>
      </div>
    </form>

    <!-- Daily Tasks List -->
    <div v-if="dailyTaskStore.dailyTasks.length > 0" class="space-y-2">
      <TransitionGroup name="task-list">
        <div
          v-for="task in dailyTaskStore.dailyTasks"
          :key="task.id"
          class="flex items-center gap-3 bg-tech-darker/50 rounded-lg p-3 hover:bg-tech-darker transition-all"
        >
          <!-- Checkbox -->
          <button
            @click="handleToggle(task.id)"
            class="flex-shrink-0"
          >
            <div 
              class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
              :class="[
                task.completed 
                  ? 'bg-tech-accent border-tech-accent' 
                  : 'border-tech-green-600 hover:border-tech-accent'
              ]"
            >
              <svg 
                v-if="task.completed" 
                class="w-3 h-3 text-tech-dark" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>

          <!-- Title (Editable) -->
          <div v-if="editingId !== task.id" class="flex-1 min-w-0">
            <p 
              class="text-sm transition-all"
              :class="[
                task.completed 
                  ? 'line-through text-tech-green-700' 
                  : 'text-tech-green-200'
              ]"
            >
              {{ task.title }}
            </p>
          </div>

          <!-- Edit Mode -->
          <input
            v-else
            ref="editInput"
            v-model="editTitle"
            @blur="saveEdit(task.id)"
            @keydown.enter="saveEdit(task.id)"
            @keydown.esc="cancelEdit"
            class="flex-1 input-field text-sm py-1"
          />

          <!-- Actions -->
          <div class="flex gap-1 flex-shrink-0">
            <button
              v-if="editingId !== task.id"
              @click="startEdit(task)"
              class="p-1.5 hover:bg-tech-green-900/30 rounded transition-colors"
              title="แก้ไข"
            >
              <svg class="w-4 h-4 text-tech-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="handleDelete(task.id)"
              class="p-1.5 hover:bg-red-900/30 rounded transition-colors"
              title="ลบ"
            >
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-6">
      <div class="text-4xl mb-2">🔄</div>
      <p class="text-tech-green-500 text-sm">ยังไม่มีรายการประจำวัน</p>
      <p class="text-tech-green-700 text-xs mt-1">เพิ่มกิจกรรมที่ต้องทำทุกวัน</p>
    </div>

    <!-- Stats -->
    <div v-if="dailyTaskStore.dailyTasks.length > 0" class="mt-4 pt-4 border-t border-tech-green-900">
      <div class="flex justify-between text-xs text-tech-green-500">
        <span>ความคืบหน้า</span>
        <span>{{ completedCount }}/{{ dailyTaskStore.dailyTasks.length }}</span>
      </div>
      <div class="mt-2 bg-tech-darker rounded-full h-2 overflow-hidden">
        <div 
          class="bg-tech-accent h-full transition-all duration-300"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useDailyTaskStore } from '../stores/dailyTaskStore'

const dailyTaskStore = useDailyTaskStore()
const newTaskTitle = ref('')
const editingId = ref(null)
const editTitle = ref('')
const editInput = ref(null)

const completedCount = computed(() => {
  return dailyTaskStore.dailyTasks.filter(t => t.completed).length
})

const progressPercent = computed(() => {
  if (dailyTaskStore.dailyTasks.length === 0) return 0
  return Math.round((completedCount.value / dailyTaskStore.dailyTasks.length) * 100)
})

async function handleAddTask() {
  if (!newTaskTitle.value.trim()) return
  
  try {
    const maxOrder = dailyTaskStore.dailyTasks.length > 0
      ? Math.max(...dailyTaskStore.dailyTasks.map(t => t.display_order || 0))
      : 0
    
    await dailyTaskStore.createDailyTask({
      title: newTaskTitle.value.trim(),
      completed: false,
      display_order: maxOrder + 1,
      created_at: new Date().toISOString()
    })
    
    newTaskTitle.value = ''
  } catch (err) {
    console.error('Failed to add daily task:', err)
    alert('เกิดข้อผิดพลาด: ' + err.message)
  }
}

async function handleToggle(id) {
  try {
    await dailyTaskStore.toggleDailyTask(id)
  } catch (err) {
    console.error('Failed to toggle task:', err)
  }
}

async function startEdit(task) {
  editingId.value = task.id
  editTitle.value = task.title
  await nextTick()
  editInput.value?.focus()
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
}

async function saveEdit(id) {
  if (!editTitle.value.trim() || editTitle.value === dailyTaskStore.dailyTasks.find(t => t.id === id)?.title) {
    cancelEdit()
    return
  }
  
  try {
    await dailyTaskStore.updateDailyTask(id, { title: editTitle.value.trim() })
    cancelEdit()
  } catch (err) {
    console.error('Failed to update task:', err)
    alert('ไม่สามารถแก้ไขได้')
  }
}

async function handleDelete(id) {
  if (confirm('คุณต้องการลบรายการประจำวันนี้ใช่หรือไม่?')) {
    try {
      await dailyTaskStore.deleteDailyTask(id)
    } catch (err) {
      console.error('Failed to delete task:', err)
      alert('ไม่สามารถลบได้')
    }
  }
}

async function resetAll() {
  if (confirm('รีเซ็ตรายการทั้งหมดเป็นยังไม่เสร็จใช่หรือไม่?')) {
    try {
      await dailyTaskStore.resetAllTasks()
    } catch (err) {
      console.error('Failed to reset tasks:', err)
      alert('ไม่สามารถรีเซ็ตได้')
    }
  }
}
</script>

<style scoped>
.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
