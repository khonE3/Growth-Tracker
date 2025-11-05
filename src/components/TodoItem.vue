<template>
  <div 
    class="bg-tech-darker border rounded-lg p-4 transition-all duration-200 hover:border-tech-green-700"
    :class="[
      todo.completed ? 'border-tech-green-900/50' : 'border-tech-green-800'
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <button
        @click="$emit('toggle', todo.id)"
        class="flex-shrink-0 mt-1"
      >
        <div 
          class="w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-all duration-200"
          :class="[
            todo.completed 
              ? 'bg-tech-green-600 border-tech-green-600' 
              : 'border-tech-green-700 hover:border-tech-green-500'
          ]"
        >
          <svg 
            v-if="todo.completed" 
            class="w-3 h-3 md:w-4 md:h-4 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div v-if="!isEditing" class="group">
          <p 
            class="text-sm md:text-base transition-all duration-200"
            :class="[
              todo.completed 
                ? 'line-through text-tech-green-700' 
                : 'text-tech-green-200'
            ]"
          >
            {{ todo.title }}
          </p>
          <p class="text-xs text-tech-green-600 mt-1">
            {{ formatTime(todo.created_at) }}
          </p>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveEdit" class="space-y-2">
          <input
            ref="editInput"
            v-model="editTitle"
            type="text"
            class="input-field w-full text-sm"
            @keydown.esc="cancelEdit"
          />
          <div class="flex gap-2">
            <button type="submit" class="btn-primary text-xs py-1 px-3">
              บันทึก
            </button>
            <button 
              type="button" 
              @click="cancelEdit"
              class="btn-secondary text-xs py-1 px-3"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>

      <!-- Actions -->
      <div v-if="!isEditing" class="flex gap-1 md:gap-2 flex-shrink-0">
        <button
          @click="startEdit"
          class="p-1.5 md:p-2 hover:bg-tech-green-900/30 rounded transition-colors"
          title="แก้ไข"
        >
          <svg class="w-4 h-4 text-tech-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="confirmDelete"
          class="p-1.5 md:p-2 hover:bg-red-900/30 rounded transition-colors"
          title="ลบ"
        >
          <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { formatThaiTime } from '../utils/thailandTime'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const isEditing = ref(false)
const editTitle = ref('')
const editInput = ref(null)

function formatTime(timestamp) {
  return formatThaiTime(timestamp)
}

async function startEdit() {
  isEditing.value = true
  editTitle.value = props.todo.title
  await nextTick()
  editInput.value?.focus()
}

function cancelEdit() {
  isEditing.value = false
  editTitle.value = ''
}

function saveEdit() {
  if (editTitle.value.trim() && editTitle.value !== props.todo.title) {
    emit('edit', props.todo.id, editTitle.value.trim())
  }
  isEditing.value = false
}

function confirmDelete() {
  if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
    emit('delete', props.todo.id)
  }
}
</script>
