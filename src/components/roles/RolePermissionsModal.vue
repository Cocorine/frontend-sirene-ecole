<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="close"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">
              Gérer les permissions
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ role?.nom }} - Sélectionnez les permissions à attribuer
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X :size="24" />
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Permissions grid -->
        <div v-else class="space-y-6">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une permission..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Select All -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span class="text-sm font-semibold text-gray-700">
              {{ selectedPermissions.length }} / {{ filteredPermissions.length }} permissions sélectionnées
            </span>
            <button
              @click="toggleSelectAll"
              class="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {{ isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner' }}
            </button>
          </div>

          <!-- Permissions list -->
          <div class="max-h-96 overflow-y-auto space-y-2">
            <label
              v-for="permission in filteredPermissions"
              :key="permission.id"
              class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50 border-blue-300': selectedPermissions.includes(permission.id) }"
            >
              <input
                type="checkbox"
                :value="permission.id"
                v-model="selectedPermissions"
                class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <Shield :size="16" class="text-blue-600" />
                  <span class="font-semibold text-gray-900">{{ permission.nom }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1" v-if="permission.description">
                  {{ permission.description }}
                </p>
                <span class="inline-block mt-2 px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded">
                  {{ permission.slug }}
                </span>
              </div>
            </label>

            <div v-if="filteredPermissions.length === 0" class="text-center py-12">
              <Search :size="48" class="mx-auto text-gray-300 mb-4" />
              <p class="text-gray-600">Aucune permission trouvée</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            @click="close"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="savePermissions"
            :disabled="saving"
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="saving" class="animate-spin">⏳</span>
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Search, Shield } from 'lucide-vue-next'
import roleService, { type Role, type Permission } from '../../services/roleService'
import { useNotificationStore } from '../../stores/notifications'

interface Props {
  isOpen: boolean
  role: Role | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationStore = useNotificationStore()

const loading = ref(false)
const saving = ref(false)
const allPermissions = ref<Permission[]>([])
const selectedPermissions = ref<string[]>([])
const searchQuery = ref('')

const filteredPermissions = computed(() => {
  if (!searchQuery.value) {
    return allPermissions.value
  }

  const query = searchQuery.value.toLowerCase()
  return allPermissions.value.filter(permission =>
    permission.nom.toLowerCase().includes(query) ||
    permission.slug.toLowerCase().includes(query) ||
    permission.description?.toLowerCase().includes(query)
  )
})

const isAllSelected = computed(() => {
  return filteredPermissions.value.length > 0 &&
    filteredPermissions.value.every(p => selectedPermissions.value.includes(p.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all filtered permissions
    const filteredIds = filteredPermissions.value.map(p => p.id)
    selectedPermissions.value = selectedPermissions.value.filter(id => !filteredIds.includes(id))
  } else {
    // Select all filtered permissions
    const filteredIds = filteredPermissions.value.map(p => p.id)
    const newSelections = filteredIds.filter(id => !selectedPermissions.value.includes(id))
    selectedPermissions.value = [...selectedPermissions.value, ...newSelections]
  }
}

const loadPermissions = async () => {
  loading.value = true
  try {
    const response = await roleService.getPermissions()
    if (response.success && response.data) {
      allPermissions.value = response.data
    }
  } catch (error: any) {
    console.error('Failed to load permissions:', error)
    notificationStore.error('Erreur', 'Impossible de charger les permissions')
  } finally {
    loading.value = false
  }
}

const savePermissions = async () => {
  if (!props.role) return

  saving.value = true
  try {
    const response = await roleService.syncPermissions(props.role.id, selectedPermissions.value)

    if (response.success) {
      notificationStore.success('Permissions mises à jour', `Les permissions du rôle "${props.role.nom}" ont été mises à jour`)
      emit('updated')
      close()
    } else {
      notificationStore.error('Erreur', response.message || 'Impossible de mettre à jour les permissions')
    }
  } catch (error: any) {
    console.error('Failed to save permissions:', error)
    notificationStore.error('Erreur', error.response?.data?.message || 'Impossible de mettre à jour les permissions')
  } finally {
    saving.value = false
  }
}

const close = () => {
  emit('close')
}

// Watch for modal opening
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    await loadPermissions()

    // Set selected permissions from role
    if (props.role?.permissions) {
      selectedPermissions.value = props.role.permissions.map(p => p.id)
    } else {
      selectedPermissions.value = []
    }
  }
})
</script>
