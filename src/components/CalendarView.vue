<template>
  <div class="card">
    <h2 class="text-xl md:text-2xl font-bold text-tech-accent mb-4 flex items-center gap-2">
      <span>📅</span>
      <span>ปฏิทิน</span>
    </h2>

    <!-- Month/Year Header -->
    <div class="flex items-center justify-between mb-4">
      <button 
        @click="previousMonth"
        class="p-2 hover:bg-tech-green-900/30 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 text-tech-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <h3 class="text-lg font-semibold text-tech-green-200">
        {{ currentMonthYear }}
      </h3>
      
      <button 
        @click="nextMonth"
        class="p-2 hover:bg-tech-green-900/30 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5 text-tech-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div 
        v-for="day in dayHeaders" 
        :key="day"
        class="text-center text-xs md:text-sm font-semibold text-tech-green-500 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in calendarDays"
        :key="day.date"
        @click="selectDate(day)"
        :disabled="!day.isCurrentMonth"
        :class="[
          'aspect-square p-1 md:p-2 rounded-lg text-xs md:text-sm transition-all duration-200',
          {
            'bg-tech-darker text-tech-green-700': !day.isCurrentMonth,
            'hover:bg-tech-green-900/30 text-tech-green-200': day.isCurrentMonth && !day.isSelected && !day.isToday,
            'bg-tech-green-600 text-white shadow-glow': day.isSelected,
            'border-2 border-tech-accent': day.isToday && !day.isSelected,
            'relative': day.hasTodos
          }
        ]"
      >
        <span class="block">{{ day.day }}</span>
        <span v-if="day.hasTodos" class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-tech-accent rounded-full"></span>
      </button>
    </div>

    <!-- Legend -->
    <div class="mt-4 pt-4 border-t border-tech-green-900 space-y-2 text-xs text-tech-green-400">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 border-2 border-tech-accent rounded"></div>
        <span>วันนี้</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-tech-green-600 rounded"></div>
        <span>วันที่เลือก</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 bg-tech-accent rounded-full"></div>
        <span>มี Todo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['date-selected'])

const todoStore = useTodoStore()
const currentDate = ref(new Date(props.selectedDate))

const dayHeaders = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

const currentMonthYear = computed(() => {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  const year = currentDate.value.getFullYear() + 543 // Thai Buddhist year
  const month = months[currentDate.value.getMonth()]
  return `${month} ${year}`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    days.push(createDayObject(date, false))
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push(createDayObject(date, true))
  }
  
  // Next month days to fill the grid
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push(createDayObject(date, false))
  }
  
  return days
})

function createDayObject(date, isCurrentMonth) {
  const dateStr = date.toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]
  const todosForDate = todoStore.getTodosByDate(dateStr)
  
  return {
    date: dateStr,
    day: date.getDate(),
    isCurrentMonth,
    isToday: dateStr === today,
    isSelected: dateStr === props.selectedDate,
    hasTodos: todosForDate.length > 0
  }
}

function selectDate(day) {
  if (day.isCurrentMonth) {
    emit('date-selected', day.date)
  }
}

function previousMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

watch(() => props.selectedDate, (newDate) => {
  currentDate.value = new Date(newDate)
})
</script>
