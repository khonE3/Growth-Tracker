<template>
  <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="auth-modal bg-gradient-to-br from-tech-dark via-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 p-6 sm:p-8 w-full max-w-md mx-4 relative overflow-hidden">
      
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
        title="Close"
      >
        <svg class="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Background Effects -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10">
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            {{ mode === 'signin' ? 'Welcome Back!' : 'Create Account' }}
          </h2>
          <p class="text-purple-300/70 text-sm">
            {{ mode === 'signin' ? 'Sign in to access your data' : 'Join Growth Tracker today' }}
          </p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button
            @click="mode = 'signin'"
            class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
            :class="mode === 'signin' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
              : 'text-purple-300 hover:text-white'"
          >
            Sign In
          </button>
          <button
            @click="mode = 'signup'"
            class="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
            :class="mode === 'signup' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
              : 'text-purple-300 hover:text-white'"
          >
            Sign Up
          </button>
        </div>

        <!-- Error/Success Message -->
        <div v-if="message" class="mb-4 p-3 rounded-lg text-sm" :class="messageType === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'">
          {{ message }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Full Name (Sign Up only) -->
          <div v-if="mode === 'signup'">
            <label class="block text-sm font-medium text-purple-300 mb-2">
              Full Name (Optional)
            </label>
            <input
              v-model="fullName"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-purple-300 mb-2">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-purple-300 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              :placeholder="mode === 'signup' ? 'Min 6 characters' : 'Your password'"
              class="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ mode === 'signin' ? 'Sign In' : 'Create Account' }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <span class="text-purple-300/50 text-sm">or</span>
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        <!-- Guest Mode Button -->
        <button
          @click="handleGuestMode"
          class="w-full py-3 px-6 bg-white/5 hover:bg-white/10 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-white font-semibold rounded-xl transition-all"
        >
          Continue as Guest
        </button>

        <!-- Footer Note -->
        <p class="text-center text-purple-300/50 text-xs mt-4">
          Guest mode uses shared data. Sign up to save your personal data.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const emit = defineEmits(['close'])

const authStore = useAuthStore()
const mode = ref('signin')
const email = ref('')
const password = ref('')
const fullName = ref('')
const message = ref('')
const messageType = ref('') // 'error' or 'success'
const loading = ref(false)

async function handleSubmit() {
  message.value = ''
  loading.value = true

  try {
    let result
    if (mode.value === 'signin') {
      result = await authStore.signIn(email.value, password.value)
    } else {
      result = await authStore.signUp(email.value, password.value, fullName.value)
    }

    if (result.success) {
      messageType.value = 'success'
      message.value = result.message
      
      if (mode.value === 'signin') {
        setTimeout(() => {
          emit('close')
        }, 1000)
      }
    } else {
      messageType.value = 'error'
      message.value = result.message
    }
  } catch (error) {
    messageType.value = 'error'
    message.value = error.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

function handleGuestMode() {
  authStore.continueAsGuest()
  emit('close')
}
</script>

<style scoped>
.auth-modal {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
