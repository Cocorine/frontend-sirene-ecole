<template>
  <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
    <div class="flex items-center flex-1 max-w-2xl">
      <div class="relative w-full">
        <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative">
        <button
          @click="showNotifications = !showNotifications"
          class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell :size="24" class="text-gray-600" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
      </div>

      <div class="relative">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
            <User :size="20" class="text-white" />
          </div>
        </button>

        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.nom_utilisateur }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.email || authStore.user?.telephone }}</p>
          </div>
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut :size="16" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { Bell, Search, LogOut, User } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const unreadCount = ref(0)
const showNotifications = ref(false)
const showUserMenu = ref(false)

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  router.push('/login')
}
</script>
