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
      <div class="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Modifier le rôle' : 'Créer un nouveau rôle' }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditMode ? 'Modifiez les informations du rôle' : 'Remplissez les informations du nouveau rôle' }}
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X :size="24" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nom -->
          <div>
            <label for="nom" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom du rôle <span class="text-red-500">*</span>
            </label>
            <input
              id="nom"
              v-model="formData.nom"
              type="text"
              required
              placeholder="Ex: Administrateur"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.nom }"
            />
            <p v-if="errors.nom" class="text-sm text-red-600 mt-1">{{ errors.nom }}</p>
          </div>

          <!-- Slug -->
          <div>
            <label for="slug" class="block text-sm font-semibold text-gray-700 mb-2">
              Slug (identifiant) <span class="text-red-500">*</span>
            </label>
            <input
              id="slug"
              v-model="formData.slug"
              type="text"
              required
              placeholder="Ex: administrateur"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              :class="{ 'border-red-500': errors.slug }"
              @input="formatSlug"
            />
            <p class="text-xs text-gray-500 mt-1">
              Format: lettres minuscules, chiffres et tirets uniquement
            </p>
            <p v-if="errors.slug" class="text-sm text-red-600 mt-1">{{ errors.slug }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Description du rôle et de ses responsabilités"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              :class="{ 'border-red-500': errors.description }"
            ></textarea>
            <p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description }}</p>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="close"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="loading" class="animate-spin">⏳</span>
              {{ loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import roleService, { type Role, type CreateRoleData, type UpdateRoleData } from '../../services/roleService'
import { useNotificationStore } from '../../stores/notifications'

interface Props {
  isOpen: boolean
  role?: Role | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', role: Role): void
  (e: 'updated', role: Role): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationStore = useNotificationStore()

const isEditMode = computed(() => !!props.role)

const formData = ref<CreateRoleData>({
  nom: '',
  slug: '',
  description: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

const formatSlug = () => {
  formData.value.slug = formData.value.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.nom.trim()) {
    errors.value.nom = 'Le nom est requis'
  }

  if (!formData.value.slug.trim()) {
    errors.value.slug = 'Le slug est requis'
  } else if (!/^[a-z0-9-]+$/.test(formData.value.slug)) {
    errors.value.slug = 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    if (isEditMode.value && props.role) {
      // Update existing role
      const updateData: UpdateRoleData = {
        nom: formData.value.nom,
        slug: formData.value.slug,
        description: formData.value.description
      }

      const response = await roleService.updateRole(props.role.id, updateData)

      if (response.success && response.data) {
        notificationStore.success('Rôle mis à jour', `Le rôle "${response.data.nom}" a été mis à jour avec succès`)
        emit('updated', response.data)
        close()
      } else {
        notificationStore.error('Erreur', response.message || 'Impossible de mettre à jour le rôle')
      }
    } else {
      // Create new role
      const response = await roleService.createRole(formData.value)

      if (response.success && response.data) {
        notificationStore.success('Rôle créé', `Le rôle "${response.data.nom}" a été créé avec succès`)
        emit('created', response.data)
        close()
      } else {
        notificationStore.error('Erreur', response.message || 'Impossible de créer le rôle')
      }
    }
  } catch (error: any) {
    console.error('Failed to save role:', error)
    const message = error.response?.data?.message || (isEditMode.value ? 'Impossible de mettre à jour le rôle' : 'Impossible de créer le rôle')
    notificationStore.error('Erreur', message)

    // Handle validation errors from backend
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  } finally {
    loading.value = false
  }
}

const close = () => {
  formData.value = {
    nom: '',
    slug: '',
    description: ''
  }
  errors.value = {}
  emit('close')
}

// Watch for modal opening
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.role) {
    // Populate form with role data for editing
    formData.value = {
      nom: props.role.nom,
      slug: props.role.slug,
      description: props.role.description || ''
    }
  } else {
    // Reset form for creating
    formData.value = {
      nom: '',
      slug: '',
      description: ''
    }
  }
  errors.value = {}
})

// Auto-generate slug from nom
watch(() => formData.value.nom, (newNom) => {
  if (!isEditMode.value && newNom && !formData.value.slug) {
    formData.value.slug = newNom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
})
</script>
