<template>
  <div class="card">
    <!-- Header with Toggle -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl md:text-2xl font-bold text-tech-accent flex items-center gap-2">
        <CalendarDaysIcon class="w-6 h-6" />
        <span>ปฏิทิน</span>
      </h2>
      <button
        @click="isExpanded = !isExpanded"
        class="p-2 hover:bg-tech-green-900/30 rounded-lg transition-colors"
        :title="isExpanded ? 'ซ่อนปฏิทิน' : 'แสดงปฏิทิน'"
      >
        <ChevronUpIcon 
          class="w-5 h-5 text-tech-green-400 transition-transform duration-300" 
          :class="{ 'rotate-180': !isExpanded }"
        />
      </button>
    </div>

    <!-- Collapsed View - Show Selected Date -->
    <div v-if="!isExpanded" class="text-center py-6">
      <div class="text-tech-green-400 text-sm mb-2">วันที่เลือก</div>
      <div class="text-2xl md:text-3xl font-bold text-tech-accent mb-1">
        {{ formatSelectedDate }}
      </div>
      <div class="text-tech-green-500 text-sm">
        {{ formatSelectedDateFull }}
      </div>
    </div>

    <!-- Expanded View - Full Calendar -->
    <div v-else>
      <!-- Month/Year Selectors -->
      <div class="flex items-center justify-between gap-2 mb-4">
        <button 
          @click="previousMonth"
          class="p-2 hover:bg-tech-green-900/30 rounded-lg transition-colors flex-shrink-0"
          title="เดือนก่อนหน้า"
        >
          <ChevronLeftIcon class="w-5 h-5 text-tech-green-400" />
        </button>
        
        <!-- Month Selector -->
        <select 
          v-model="selectedMonth"
          @change="updateMonth"
          class="input-field text-sm py-1 px-2 flex-1 cursor-pointer"
        >
          <option v-for="(month, index) in thaiMonths" :key="index" :value="index">
            {{ month }}
          </option>
        </select>

        <!-- Year Selector -->
        <select 
          v-model="selectedYear"
          @change="updateYear"
          class="input-field text-sm py-1 px-2 w-24 cursor-pointer"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year + 543 }}
          </option>
        </select>
        
        <button 
          @click="nextMonth"
          class="p-2 hover:bg-tech-green-900/30 rounded-lg transition-colors flex-shrink-0"
          title="เดือนถัดไป"
        >
          <ChevronRightIcon class="w-5 h-5 text-tech-green-400" />
        </button>
      </div>

      <!-- Quick Jump to Today -->
      <div class="flex justify-center mb-4">
        <button
          @click="jumpToToday"
          class="text-xs text-tech-green-400 hover:text-tech-accent transition-colors px-3 py-1 rounded-full border border-tech-green-800 hover:border-tech-accent flex items-center gap-1"
        >
          <MapPinIcon class="w-3 h-3" />
          <span>กลับวันนี้</span>
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
              'bg-tech-darker text-tech-green-700 cursor-not-allowed': !day.isCurrentMonth,
              'hover:bg-tech-green-900/30 text-tech-green-200': day.isCurrentMonth && !day.isSelected && !day.isToday,
              'bg-tech-green-600 text-white shadow-glow': day.isSelected,
              'border-2 border-tech-accent': day.isToday && !day.isSelected,
              'relative': day.hasTodos
            }
          ]"
        >
          <span class="block">{{ day.day }}</span>
          <span v-if="day.hasTodos" class="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <CheckCircleIcon class="w-2 h-2 text-tech-accent" />
          </span>
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
          <CheckCircleIcon class="w-3 h-3 text-tech-accent" />
          <span>มี Todo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  CalendarDaysIcon, 
  ChevronUpIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MapPinIcon,
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'
import { useTodoStore } from '../stores/todoStore'
import { getTodayThailand, parseThailandDate, formatThaiDate } from '../utils/thailandTime'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['date-selected'])

const todoStore = useTodoStore()
const currentDate = ref(parseThailandDate(props.selectedDate))
const isExpanded = ref(false) // Toggle state - default ย่อ
const selectedMonth = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

const dayHeaders = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

// Generate year range (5 years before and after current year)
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i)
  }
  return years
})

// Format selected date for collapsed view
const formatSelectedDate = computed(() => {
  const formatted = formatThaiDate(props.selectedDate)
  return formatted.day
})

const formatSelectedDateFull = computed(() => {
  const formatted = formatThaiDate(props.selectedDate)
  return `${formatted.dayName}ที่ ${formatted.day} ${formatted.month} ${formatted.thaiYear}`
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
  // สร้าง date string โดยไม่ใช้ toISOString() เพื่อหลีกเลี่ยง timezone shift
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`
  
  const today = getTodayThailand()
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
    1,
    12,
    0,
    0
  )
  selectedMonth.value = currentDate.value.getMonth()
  selectedYear.value = currentDate.value.getFullYear()
}

function nextMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
    12,
    0,
    0
  )
  selectedMonth.value = currentDate.value.getMonth()
  selectedYear.value = currentDate.value.getFullYear()
}

function updateMonth() {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1, 12, 0, 0)
}

function updateYear() {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1, 12, 0, 0)
}

function jumpToToday() {
  const todayStr = getTodayThailand()
  const today = parseThailandDate(todayStr)
  currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1, 12, 0, 0)
  selectedMonth.value = today.getMonth()
  selectedYear.value = today.getFullYear()
  emit('date-selected', todayStr)
}

watch(() => props.selectedDate, (newDate) => {
  const date = parseThailandDate(newDate)
  currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0)
  selectedMonth.value = date.getMonth()
  selectedYear.value = date.getFullYear()
})

// Sync selectors when currentDate changes
watch(currentDate, (newDate) => {
  selectedMonth.value = newDate.getMonth()
  selectedYear.value = newDate.getFullYear()
})
</script>
