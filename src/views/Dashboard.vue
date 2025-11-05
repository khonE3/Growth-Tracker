<template>
  <div class="min-h-screen bg-tech-dark p-4 md:p-8">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl md:text-5xl font-bold glow-text text-center mb-2">
        📊 Growth Tracker
      </h1>
      <p class="text-tech-green-400 text-center text-sm md:text-base">
        ติดตามการเติบโตของคุณทุกวัน
      </p>
    </header>

    <!-- Main Content Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendar Section (Left/Top) -->
      <div class="lg:col-span-1">
        <CalendarView 
          :selected-date="selectedDate"
          @date-selected="handleDateSelected"
        />
      </div>

      <!-- Todo List Section (Right/Bottom) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Daily Tasks (แสดงก่อน) -->
        <DailyTasks />
        
        <!-- Regular Todo List -->
        <TodoList :selected-date="selectedDate" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { useDailyTaskStore } from '../stores/dailyTaskStore'
import CalendarView from '../components/CalendarView.vue'
import TodoList from '../components/TodoList.vue'
import DailyTasks from '../components/DailyTasks.vue'
import { getTodayThailand } from '../utils/thailandTime'

const todoStore = useTodoStore()
const dailyTaskStore = useDailyTaskStore()
const selectedDate = ref(getTodayThailand())

onMounted(async () => {
  // Load both regular todos and daily tasks
  await Promise.all([
    todoStore.fetchTodos(),
    dailyTaskStore.fetchDailyTasks()
  ])
})

function handleDateSelected(date) {
  selectedDate.value = date
}
</script>
