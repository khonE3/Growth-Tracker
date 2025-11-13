<template>
  <div class="min-h-screen bg-tech-dark relative overflow-hidden">
    
    <!-- Intro Animation -->
    <Transition name="intro">
      <div v-if="showIntro" class="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-tech-dark via-purple-900 to-blue-900 pointer-events-none">
        <div class="intro-container relative">
          <!-- Spinning Spirit Icons -->
          <div class="spirits-container">
            <div class="spirit spirit-1">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
            </div>
            <div class="spirit spirit-2">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-violet-400" />
            </div>
            <div class="spirit spirit-3">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            </div>
            <div class="spirit spirit-4">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-purple-300" />
            </div>
            <div class="spirit spirit-5">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-indigo-400" />
            </div>
            <div class="spirit spirit-6">
              <ChartBarIcon class="w-8 h-8 sm:w-12 sm:h-12 text-blue-300" />
            </div>
          </div>
          
          <!-- Main Text -->
          <div class="intro-text text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
            Growth Tracker
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Auth Modal -->
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />

    <!-- User Menu Button -->
    <button
      v-if="showContent"
      @click="toggleUserMenu"
      class="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-full p-2 sm:p-3 hover:scale-110 transition-all duration-300 group shadow-lg hover:shadow-purple-500/50"
    >
      <UserCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 group-hover:text-purple-100 transition-colors" />
    </button>

    <!-- User Menu Dropdown -->
    <Transition name="slide-fade">
      <div v-if="showUserMenu && showContent" class="fixed top-16 left-4 sm:top-20 sm:left-6 z-50 bg-gradient-to-br from-tech-dark via-purple-900/90 to-blue-900/90 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-4 min-w-[250px]">
        <!-- User Info -->
        <div class="mb-4 pb-4 border-b border-purple-500/20">
          <p class="text-sm text-purple-300/70 mb-1">{{ authStore.isGuest ? 'Guest Mode' : 'Signed in as' }}</p>
          <p class="text-white font-semibold">{{ authStore.userName }}</p>
          <p v-if="!authStore.isGuest" class="text-xs text-purple-300/50">{{ authStore.userEmail }}</p>
        </div>

        <!-- Menu Items -->
        <div class="space-y-2">
          <button
            v-if="authStore.isGuest"
            @click="openAuthModal"
            class="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-purple-300 hover:text-white transition-all"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In / Sign Up
            </span>
          </button>

          <button
            v-else
            @click="handleSignOut"
            class="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </span>
          </button>
        </div>

        <!-- Mode Indicator -->
        <div class="mt-4 pt-4 border-t border-purple-500/20">
          <p class="text-xs text-center text-purple-300/50">
            {{ authStore.isGuest ? '🌐 Shared Data Mode' : '🔒 Personal Data Mode' }}
          </p>
        </div>
      </div>
    </Transition>
    
    <!-- Background Toggle Button -->
    <button
      @click="toggleContent"
      class="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-full p-2 sm:p-3 hover:scale-110 transition-all duration-300 group shadow-lg hover:shadow-purple-500/50"
      :class="{ 'ring-2 ring-purple-500/50': !showContent }"
      :title="showContent ? 'ดู Background แบบเต็ม' : 'แสดง Content'"
    >
      <PhotoIcon 
        v-if="!showContent"
        class="w-5 h-5 sm:w-6 sm:h-6 text-purple-300 group-hover:text-purple-100 transition-colors" 
      />
      <RectangleStackIcon 
        v-else
        class="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:text-purple-200 transition-colors" 
      />
    </button>

    <!-- Animated Background -->
    <div class="fixed inset-0 pointer-events-none">
      <!-- Purple Gradient Orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl animate-float-slower"></div>
      <div class="absolute top-2/3 left-1/3 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-float"></div>
      
      <!-- Electric Waves Background -->
      <div class="wave-container">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
        <div class="wave wave-4"></div>
      </div>
      
      <!-- Energy Ripples -->
      <div class="ripple-container">
        <div class="ripple ripple-1"></div>
        <div class="ripple ripple-2"></div>
        <div class="ripple ripple-3"></div>
      </div>
      
      <!-- Lightning Effects -->
      <div class="lightning-container">
        <div class="lightning lightning-1"></div>
        <div class="lightning lightning-2"></div>
        <div class="lightning lightning-3"></div>
      </div>
      
      <!-- Particle Container -->
      <div class="particles">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
        <div class="particle particle-6"></div>
        <div class="particle particle-7"></div>
        <div class="particle particle-8"></div>
        <div class="particle particle-9"></div>
        <div class="particle particle-10"></div>
        <div class="particle particle-11"></div>
        <div class="particle particle-12"></div>
        <div class="particle particle-13"></div>
        <div class="particle particle-14"></div>
        <div class="particle particle-15"></div>
      </div>
      
      <!-- Animated SVG Energy Lines -->
      <svg class="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <linearGradient id="purpleBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1">
              <animate attributeName="stop-color" values="#8b5cf6;#6366f1;#8b5cf6" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" style="stop-color:#6366f1;stop-opacity:0.7">
              <animate attributeName="stop-color" values="#6366f1;#3b82f6;#6366f1" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0">
              <animate attributeName="stop-color" values="#3b82f6;#8b5cf6;#3b82f6" dur="3s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
          
          <!-- Filter for glow effect -->
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Animated Energy Lines -->
        <path d="M 0 30 Q 250 10, 500 30 T 1000 30" stroke="url(#purpleBlue)" stroke-width="2" fill="none" filter="url(#glow)" opacity="0.8">
          <animate attributeName="d" 
            values="M 0 30 Q 250 10, 500 30 T 1000 30;
                    M 0 30 Q 250 50, 500 30 T 1000 30;
                    M 0 30 Q 250 10, 500 30 T 1000 30" 
            dur="4s" repeatCount="indefinite"/>
        </path>
        
        <path d="M 0 150 Q 250 130, 500 150 T 1000 150" stroke="url(#purpleBlue)" stroke-width="2" fill="none" filter="url(#glow)" opacity="0.6">
          <animate attributeName="d" 
            values="M 0 150 Q 250 130, 500 150 T 1000 150;
                    M 0 150 Q 250 170, 500 150 T 1000 150;
                    M 0 150 Q 250 130, 500 150 T 1000 150" 
            dur="5s" repeatCount="indefinite"/>
        </path>
        
        <path d="M 0 300 Q 250 280, 500 300 T 1000 300" stroke="url(#purpleBlue)" stroke-width="2" fill="none" filter="url(#glow)" opacity="0.5">
          <animate attributeName="d" 
            values="M 0 300 Q 250 280, 500 300 T 1000 300;
                    M 0 300 Q 250 320, 500 300 T 1000 300;
                    M 0 300 Q 250 280, 500 300 T 1000 300" 
            dur="6s" repeatCount="indefinite"/>
        </path>
        
        <circle cx="50" cy="50" r="3" fill="#8b5cf6" filter="url(#glow)">
          <animate attributeName="cx" values="50;800;50" dur="8s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="50;400;50" dur="8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;1;0" dur="8s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="700" cy="100" r="3" fill="#6366f1" filter="url(#glow)">
          <animate attributeName="cx" values="700;100;700" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="cy" values="100;500;100" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;1;0" dur="10s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>

    <!-- Content with z-index -->
    <div class="relative z-10 transition-opacity duration-500" v-show="showContent">
      <!-- Header -->
      <header class="mb-6 sm:mb-8 px-4 md:px-8 pt-4 md:pt-8">
        <div class="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <ChartBarIcon class="w-8 h-8 sm:w-10 sm:h-10 text-tech-accent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-bold glow-text-purple">
            Growth Tracker
          </h1>
        </div>
        <p class="text-tech-green-400 text-center text-xs sm:text-sm md:text-base">
          มาเข้าดันเจียนฟาร์มเลเวลกันเถอะ!
        </p>
      </header>

      <!-- Main Content Grid -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-4 md:px-8">
        <!-- Calendar Section (Left/Top) -->
        <div class="lg:col-span-1">
          <CalendarView 
            :selected-date="selectedDate"
            @date-selected="handleDateSelected"
          />
        </div>

        <!-- Todo List Section (Right/Bottom) -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <!-- Daily Tasks (แสดงก่อน) -->
          <DailyTasks />
          
          <!-- Regular Todo List -->
          <TodoList :selected-date="selectedDate" />
        </div>
      </div>

      <!-- Footer - Full Width, No Rounded Corners -->
      <footer class="mt-8 sm:mt-12 md:mt-16 relative w-full">
        <!-- Footer Background Effects -->
        <div class="footer-bg">
          <!-- Smoke Effects -->
          <div class="smoke smoke-1"></div>
          <div class="smoke smoke-2"></div>
          <div class="smoke smoke-3"></div>
          <div class="smoke smoke-4"></div>
          
          <!-- Floating Particles -->
          <div class="footer-particles">
            <div class="footer-particle fp-1"></div>
            <div class="footer-particle fp-2"></div>
            <div class="footer-particle fp-3"></div>
            <div class="footer-particle fp-4"></div>
            <div class="footer-particle fp-5"></div>
            <div class="footer-particle fp-6"></div>
          </div>
        </div>

        <!-- Footer Content -->
        <div class="footer-content relative z-10 max-w-7xl mx-auto py-8 px-4">
          <div class="flex flex-col items-center gap-6">
            <!-- Divider Line -->
            <div class="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            <!-- Social Links -->
            <div class="flex items-center gap-4 sm:gap-6 md:gap-8">
              <a 
                href="https://github.com/khonE3" 
                target="_blank"
                rel="noopener noreferrer"
                class="social-link group"
                title="GitHub - khonE3"
              >
                <div class="social-icon-wrapper">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    class="social-icon"
                  />
                  <div class="icon-glow"></div>
                </div>
                <span class="social-text text-xs sm:text-sm">GitHub</span>
              </a>

              <div class="w-px h-8 sm:h-10 md:h-12 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>

              <a 
                href="https://www.instagram.com/gotjitag/" 
                target="_blank"
                rel="noopener noreferrer"
                class="social-link group"
                title="Instagram - @gotjitag"
              >
                <div class="social-icon-wrapper">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/1216/1216878.png"
                    alt="Instagram"
                    class="social-icon"
                  />
                  <div class="icon-glow ig-glow"></div>
                </div>
                <span class="social-text text-xs sm:text-sm">Instagram</span>
              </a>
            </div>

            <!-- Copyright Text -->
            <div class="text-center space-y-2">
              <p class="text-xs sm:text-sm text-purple-300/70 font-medium tracking-wide">
                Created by
                <span class="text-purple-400 font-bold glow-text-footer">Gotjitag</span>
              </p>
              <p class="text-[10px] sm:text-xs text-blue-400/50">
                © 2025 Growth Tracker • Level Up Your Life
              </p>
            </div>

            <!-- Decorative Bottom Line -->
            <div class="w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import { PhotoIcon, RectangleStackIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/authStore'
import { useTodoStore } from '../stores/todoStore'
import { useDailyTaskStore } from '../stores/dailyTaskStore'
import AuthModal from '../components/AuthModal.vue'
import CalendarView from '../components/CalendarView.vue'
import TodoList from '../components/TodoList.vue'
import DailyTasks from '../components/DailyTasks.vue'
import { getTodayThailand } from '../utils/thailandTime'

const authStore = useAuthStore()
const todoStore = useTodoStore()
const dailyTaskStore = useDailyTaskStore()
const selectedDate = ref(getTodayThailand())
const showContent = ref(true)
const showIntro = ref(true)
const showAuthModal = ref(false)
const showUserMenu = ref(false)

// Toggle content visibility
const toggleContent = () => {
  showContent.value = !showContent.value
  if (!showContent.value) {
    showUserMenu.value = false
  }
}

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Open auth modal
const openAuthModal = () => {
  showAuthModal.value = true
  showUserMenu.value = false
}

// Handle sign out
const handleSignOut = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    showUserMenu.value = false
    // Reload data as guest
    await Promise.all([
      todoStore.fetchTodos(),
      dailyTaskStore.fetchDailyTasks()
    ])
  }
}

onMounted(async () => {
  // Hide intro after 2.5 seconds
  setTimeout(() => {
    showIntro.value = false
  }, 2500)

  // Initialize auth
  await authStore.initialize()

  // Load data based on auth state
  await Promise.all([
    todoStore.fetchTodos(),
    dailyTaskStore.fetchDailyTasks()
  ])

  // Show auth modal if guest (optional - you can remove this if you want)
  // setTimeout(() => {
  //   if (authStore.isGuest) {
  //     showAuthModal.value = true
  //   }
  // }, 3000)
})

function handleDateSelected(date) {
  selectedDate.value = date
}
</script>

<style scoped>
/* User Menu Animation */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Intro Animation */
.intro-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-text {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: introFloat 2.95s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.9))
          drop-shadow(0 0 60px rgba(139, 92, 246, 0.6))
          drop-shadow(0 0 90px rgba(99, 102, 241, 0.4));
  letter-spacing: 0.05em;
}

@keyframes introFloat {
  0% {
    opacity: 0;
    transform: translateY(80px) scale(0.85);
    filter: blur(8px) drop-shadow(0 0 30px rgba(139, 92, 246, 0.9));
  }
  15% {
    opacity: 0.5;
    transform: translateY(40px) scale(0.92);
    filter: blur(4px) drop-shadow(0 0 40px rgba(139, 92, 246, 0.95));
  }
  35% {
    opacity: 0.95;
    transform: translateY(0) scale(1);
    filter: blur(0) drop-shadow(0 0 50px rgba(139, 92, 246, 1));
  }
  65% {
    opacity: 1;
    transform: translateY(-10px) scale(1.02);
    filter: blur(0) drop-shadow(0 0 60px rgba(99, 102, 241, 1));
  }
  80% {
    opacity: 0.8;
    transform: translateY(-30px) scale(1.05);
    filter: blur(2px) drop-shadow(0 0 50px rgba(139, 92, 246, 0.8));
  }
  100% {
    opacity: 0;
    transform: translateY(-70px) scale(1.15);
    filter: blur(12px) drop-shadow(0 0 40px rgba(139, 92, 246, 0.4));
  }
}

/* Spirit Icons Animation */
.spirits-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.spirit {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: spiritOrbit 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

@keyframes spiritOrbit {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(0deg) translateX(0) rotate(0deg) scale(0);
    filter: blur(4px);
  }
  15% {
    opacity: 0.6;
    filter: blur(2px);
  }
  35% {
    opacity: 0.9;
    filter: blur(0);
  }
  65% {
    opacity: 0.95;
    filter: blur(0);
  }
  80% {
    opacity: 0.7;
    filter: blur(1px);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg) scale(1.2);
    filter: blur(4px);
  }
}

.spirit-1 {
  --orbit-radius: 150px;
  animation-delay: 0s;
}

.spirit-2 {
  --orbit-radius: 150px;
  animation-delay: 0.1s;
}

.spirit-3 {
  --orbit-radius: 150px;
  animation-delay: 0.2s;
}

.spirit-4 {
  --orbit-radius: 180px;
  animation-delay: 0.15s;
}

.spirit-5 {
  --orbit-radius: 180px;
  animation-delay: 0.25s;
}

.spirit-6 {
  --orbit-radius: 180px;
  animation-delay: 0.05s;
}

/* Responsive orbit radius */
@media (max-width: 640px) {
  .spirit-1, .spirit-2, .spirit-3 {
    --orbit-radius: 100px;
  }
  .spirit-4, .spirit-5, .spirit-6 {
    --orbit-radius: 120px;
  }
}

.intro-enter-active {
  transition: opacity 0.3s ease;
}

.intro-leave-active {
  transition: opacity 0.6s ease-out;
}

.intro-enter-from,
.intro-leave-to {
  opacity: 0;
}

/* Solo Leveling Style Animations */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
  }
  50% {
    transform: translate(-15px, 15px) scale(0.9);
  }
  75% {
    transform: translate(15px, 10px) scale(1.05);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.2);
  }
}

@keyframes float-slower {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-25px, 25px) scale(1.15);
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 15s ease-in-out infinite;
}

/* Electric Wave Effects */
.wave-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(139, 92, 246, 0.1) 25%,
    rgba(99, 102, 241, 0.2) 50%,
    rgba(59, 130, 246, 0.1) 75%,
    transparent 100%
  );
  animation: waveMove 15s linear infinite;
}

@keyframes waveMove {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.wave-1 {
  animation-duration: 12s;
  opacity: 0.3;
}

.wave-2 {
  animation-duration: 18s;
  animation-direction: reverse;
  opacity: 0.2;
}

.wave-3 {
  animation-duration: 20s;
  opacity: 0.25;
}

.wave-4 {
  animation-duration: 25s;
  animation-direction: reverse;
  opacity: 0.15;
}

/* Energy Ripples */
.ripple-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  animation: ripple 4s ease-out infinite;
}

@keyframes ripple {
  0% {
    width: 100px;
    height: 100px;
    opacity: 1;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
                0 0 40px rgba(99, 102, 241, 0.6),
                inset 0 0 20px rgba(139, 92, 246, 0.4);
  }
  100% {
    width: 800px;
    height: 800px;
    opacity: 0;
    box-shadow: 0 0 50px rgba(139, 92, 246, 0),
                0 0 80px rgba(99, 102, 241, 0),
                inset 0 0 40px rgba(139, 92, 246, 0);
  }
}

.ripple-1 {
  animation-delay: 0s;
}

.ripple-2 {
  animation-delay: 1.3s;
  border-color: rgba(99, 102, 241, 0.6);
}

.ripple-3 {
  animation-delay: 2.6s;
  border-color: rgba(59, 130, 246, 0.6);
}

/* Lightning Effects */
.lightning-container {
  position: absolute;
  inset: 0;
}

.lightning {
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(139, 92, 246, 0.8) 10%,
    rgba(99, 102, 241, 1) 50%,
    rgba(139, 92, 246, 0.8) 90%,
    transparent 100%
  );
  box-shadow: 0 0 10px rgba(139, 92, 246, 1),
              0 0 20px rgba(99, 102, 241, 0.8),
              0 0 30px rgba(59, 130, 246, 0.6);
  animation: lightning 3s ease-in-out infinite;
  opacity: 0;
}

@keyframes lightning {
  0%, 100% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
  5% {
    opacity: 1;
    transform: scaleY(1) translateX(0);
  }
  10% {
    opacity: 0;
    transform: scaleY(1) translateX(5px);
  }
  15% {
    opacity: 1;
    transform: scaleY(1) translateX(-5px);
  }
  20% {
    opacity: 0;
    transform: scaleY(0) translateX(0);
  }
}

.lightning-1 {
  left: 20%;
  animation-delay: 0s;
  animation-duration: 6s;
}

.lightning-2 {
  left: 50%;
  animation-delay: 2s;
  animation-duration: 7s;
}

.lightning-3 {
  left: 80%;
  animation-delay: 4s;
  animation-duration: 8s;
}

/* Particle Effects */
.particles {
  position: relative;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #a855f7, #3b82f6);
  border-radius: 50%;
  box-shadow: 0 0 15px #a855f7, 
              0 0 30px #8b5cf6,
              0 0 45px #6366f1,
              0 0 60px #3b82f6;
  animation: particleFloat 20s linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(50px) scale(1) rotate(180deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) scale(0.5) rotate(360deg);
    opacity: 0;
  }
}

.particle-1 { left: 5%; animation-delay: 0s; animation-duration: 12s; }
.particle-2 { left: 15%; animation-delay: 1s; animation-duration: 14s; }
.particle-3 { left: 25%; animation-delay: 2s; animation-duration: 16s; }
.particle-4 { left: 35%; animation-delay: 0.5s; animation-duration: 13s; }
.particle-5 { left: 45%; animation-delay: 1.5s; animation-duration: 15s; }
.particle-6 { left: 55%; animation-delay: 2.5s; animation-duration: 14s; }
.particle-7 { left: 65%; animation-delay: 1.2s; animation-duration: 17s; }
.particle-8 { left: 75%; animation-delay: 2.2s; animation-duration: 12s; }
.particle-9 { left: 85%; animation-delay: 0.8s; animation-duration: 15s; }
.particle-10 { left: 95%; animation-delay: 1.8s; animation-duration: 13s; }
.particle-11 { left: 10%; animation-delay: 3s; animation-duration: 16s; }
.particle-12 { left: 30%; animation-delay: 3.5s; animation-duration: 14s; }
.particle-13 { left: 50%; animation-delay: 4s; animation-duration: 15s; }
.particle-14 { left: 70%; animation-delay: 4.5s; animation-duration: 13s; }
.particle-15 { left: 90%; animation-delay: 5s; animation-duration: 17s; }

/* Purple Glow Text */
.glow-text-purple {
  text-shadow: 
    0 0 10px rgba(168, 85, 247, 0.8),
    0 0 20px rgba(168, 85, 247, 0.6),
    0 0 30px rgba(168, 85, 247, 0.4),
    0 0 40px rgba(139, 92, 246, 0.3),
    0 0 70px rgba(99, 102, 241, 0.2),
    0 0 100px rgba(59, 130, 246, 0.1);
  color: #00ff94;
  animation: textPulse 3s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% {
    text-shadow: 
      0 0 10px rgba(168, 85, 247, 0.8),
      0 0 20px rgba(168, 85, 247, 0.6),
      0 0 30px rgba(168, 85, 247, 0.4),
      0 0 40px rgba(139, 92, 246, 0.3),
      0 0 70px rgba(99, 102, 241, 0.2);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(168, 85, 247, 1),
      0 0 30px rgba(168, 85, 247, 0.8),
      0 0 40px rgba(168, 85, 247, 0.6),
      0 0 50px rgba(139, 92, 246, 0.5),
      0 0 80px rgba(99, 102, 241, 0.4),
      0 0 120px rgba(59, 130, 246, 0.3);
  }
}

/* Footer Styles */
.footer-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 0; /* No rounded corners */
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(88, 28, 135, 0.1) 30%,
    rgba(67, 56, 202, 0.15) 70%,
    rgba(30, 58, 138, 0.2) 100%
  );
}

/* Smoke Effects */
.smoke {
  position: absolute;
  bottom: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(99, 102, 241, 0.2) 30%,
    rgba(59, 130, 246, 0.1) 60%,
    transparent 100%
  );
  border-radius: 50%;
  filter: blur(40px);
  animation: smokeRise 20s ease-in-out infinite;
}

@keyframes smokeRise {
  0% {
    transform: translateY(0) scale(1) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-400px) scale(1.5) translateX(100px);
    opacity: 0;
  }
}

.smoke-1 {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 18s;
}

.smoke-2 {
  left: 40%;
  animation-delay: 4s;
  animation-duration: 22s;
}

.smoke-3 {
  left: 70%;
  animation-delay: 8s;
  animation-duration: 20s;
}

.smoke-4 {
  left: 25%;
  animation-delay: 12s;
  animation-duration: 24s;
}

/* Footer Particles */
.footer-particles {
  position: absolute;
  inset: 0;
}

.footer-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, rgba(168, 85, 247, 1), rgba(99, 102, 241, 0.5));
  border-radius: 50%;
  box-shadow: 
    0 0 10px rgba(168, 85, 247, 0.8),
    0 0 20px rgba(99, 102, 241, 0.6),
    0 0 30px rgba(59, 130, 246, 0.4);
  animation: footerFloat 15s ease-in-out infinite;
}

@keyframes footerFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translate(50px, -100px) scale(1.2);
    opacity: 0.8;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translate(-30px, -200px) scale(0.8);
    opacity: 0;
  }
}

.fp-1 { left: 15%; bottom: 0; animation-delay: 0s; animation-duration: 12s; }
.fp-2 { left: 35%; bottom: 0; animation-delay: 2s; animation-duration: 14s; }
.fp-3 { left: 55%; bottom: 0; animation-delay: 4s; animation-duration: 13s; }
.fp-4 { left: 75%; bottom: 0; animation-delay: 1s; animation-duration: 15s; }
.fp-5 { left: 25%; bottom: 0; animation-delay: 3s; animation-duration: 16s; }
.fp-6 { left: 65%; bottom: 0; animation-delay: 5s; animation-duration: 14s; }

/* Footer Content */
.footer-content {
  backdrop-filter: blur(10px);
  background: linear-gradient(
    180deg,
    rgba(17, 24, 39, 0.3) 0%,
    rgba(30, 27, 75, 0.4) 50%,
    rgba(17, 24, 39, 0.5) 100%
  );
  border-radius: 0; /* No rounded corners */
  border: none;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.1),
    0 0 60px rgba(99, 102, 241, 0.05),
    inset 0 0 30px rgba(168, 85, 247, 0.05);
}

/* Social Links */
.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  transform: translateY(-5px);
  background: rgba(139, 92, 246, 0.1);
}

.social-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.social-link:hover .social-icon {
  filter: brightness(0) invert(1);
  transform: scale(1.1) rotate(5deg);
}

.icon-glow {
  position: absolute;
  inset: -4px;
  background: radial-gradient(
    circle,
    rgba(139, 92, 246, 0.4) 0%,
    rgba(99, 102, 241, 0.2) 50%,
    transparent 100%
  );
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: iconPulse 2s ease-in-out infinite;
}

.ig-glow {
  background: radial-gradient(
    circle,
    rgba(219, 39, 119, 0.4) 0%,
    rgba(168, 85, 247, 0.3) 50%,
    rgba(99, 102, 241, 0.2) 70%,
    transparent 100%
  );
}

.social-link:hover .icon-glow {
  opacity: 1;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.social-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(196, 181, 253, 0.8);
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.social-link:hover .social-text {
  color: rgba(196, 181, 253, 1);
  text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

/* Glow Text Footer */
.glow-text-footer {
  animation: footerTextGlow 2s ease-in-out infinite;
}

@keyframes footerTextGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  }
  50% {
    text-shadow: 
      0 0 15px rgba(168, 85, 247, 0.8),
      0 0 25px rgba(139, 92, 246, 0.6);
  }
}
</style>
