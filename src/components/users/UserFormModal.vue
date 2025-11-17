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
              {{ isEditMode ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur' }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditMode ? 'Modifiez les informations de l\'utilisateur' : 'Remplissez les informations du nouvel utilisateur' }}
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            aria-label="Fermer le modal"
          >
            <X :size="24" aria-hidden="true" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Prénom -->
          <div>
            <label for="prenom" class="block text-sm font-semibold text-gray-700 mb-2">
              Prénom <span class="text-red-500">*</span>
            </label>
            <input
              id="prenom"
              v-model="formData.userInfoData.prenom"
              type="text"
              required
              placeholder="Ex: Jean"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.prenom }"
              :aria-invalid="!!errors.prenom"
              :aria-describedby="errors.prenom ? 'prenom-error' : undefined"
            />
            <p v-if="errors.prenom" id="prenom-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.prenom }}</p>
          </div>

          <!-- Nom -->
          <div>
            <label for="nom" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              id="nom"
              v-model="formData.userInfoData.nom"
              type="text"
              required
              placeholder="Ex: Ouédraogo"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.nom }"
              :aria-invalid="!!errors.nom"
              :aria-describedby="errors.nom ? 'nom-error' : undefined"
            />
            <p v-if="errors.nom" id="nom-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.nom }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="formData.userInfoData.email"
              type="email"
              required
              placeholder="Ex: jean.ouedraogo@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.email }"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'email-error' : undefined"
            />
            <p v-if="errors.email" id="email-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.email }}</p>
          </div>

          <!-- Téléphone -->
          <div>
            <label for="telephone" class="block text-sm font-semibold text-gray-700 mb-2">
              Téléphone <span class="text-red-500">*</span>
            </label>
            <input
              id="telephone"
              v-model="formData.userInfoData.telephone"
              type="tel"
              required
              placeholder="+22670000000"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.telephone }"
              :aria-invalid="!!errors.telephone"
              :aria-describedby="errors.telephone ? 'telephone-error' : undefined"
            />
            <p v-if="errors.telephone" id="telephone-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.telephone }}</p>
          </div>

          <!-- Ville -->
          <div>
            <label for="ville_id" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Ville
              <Loader2 v-if="loadingCities" :size="16" class="animate-spin text-blue-600" aria-label="Chargement des villes" />
            </label>
            <select
              id="ville_id"
              v-model="formData.userInfoData.ville_id"
              :disabled="loadingCities"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.ville_id, 'opacity-50 cursor-not-allowed': loadingCities }"
              :aria-invalid="!!errors.ville_id"
              :aria-describedby="errors.ville_id ? 'ville-error' : undefined"
            >
              <option :value="null">{{ loadingCities ? 'Chargement des villes...' : 'Sélectionner une ville' }}</option>
              <option
                v-for="city in availableCities"
                :key="city.id"
                :value="city.id"
              >
                {{ city.nom }}
              </option>
            </select>
            <p v-if="errors.ville_id" id="ville-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.ville_id }}</p>
          </div>

          <!-- Adresse -->
          <div>
            <label for="adresse" class="block text-sm font-semibold text-gray-700 mb-2">
              Adresse
            </label>
            <textarea
              id="adresse"
              v-model="formData.userInfoData.adresse"
              rows="3"
              placeholder="Ex: 123 Rue de l\'Indépendance"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.adresse }"
              :aria-invalid="!!errors.adresse"
              :aria-describedby="errors.adresse ? 'adresse-error' : undefined"
            ></textarea>
            <p v-if="errors.adresse" id="adresse-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.adresse }}</p>
          </div>

          <!-- Rôle -->
          <div>
            <label for="role_id" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Rôle
              <Loader2 v-if="loadingRoles" :size="16" class="animate-spin text-blue-600" aria-label="Chargement des rôles" />
            </label>
            <select
              id="role_id"
              v-model="formData.role_id"
              :disabled="loadingRoles"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.role_id, 'opacity-50 cursor-not-allowed': loadingRoles }"
              :aria-invalid="!!errors.role_id"
              :aria-describedby="errors.role_id ? 'role-error' : undefined"
            >
              <option value="">{{ loadingRoles ? 'Chargement des rôles...' : 'Aucun rôle' }}</option>
              <option
                v-for="role in availableRoles"
                :key="role.id"
                :value="role.id"
              >
                {{ role.nom }}
              </option>
            </select>
            <p v-if="errors.role_id" id="role-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.role_id }}</p>
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
import { X, Loader2 } from 'lucide-vue-next'
import { useUsers } from '@/composables/useUsers'
import roleService, { type Role } from '@/services/roleService'
import cityService from '@/services/cityService'
import type { ApiUserData, CreateUserRequest, UpdateUserRequest, ApiVille } from '@/types/api'
import type { ApiAxiosError } from '@/types/api'
import { useNotificationStore } from '@/stores/notifications'

interface Props {
  isOpen: boolean
  user?: ApiUserData | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', user: ApiUserData): void
  (e: 'updated', user: ApiUserData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationStore = useNotificationStore()
const { createUser, updateUser } = useUsers()

const isEditMode = computed(() => !!props.user)

interface FormData {
  role_id?: string
  userInfoData: {
    nom: string
    prenom: string
    telephone: string
    email: string // New field
    ville_id: string | null // New field
    adresse: string // New field
  }
}

const formData = ref<FormData>({
  role_id: '',
  userInfoData: {
    nom: '',
    prenom: '',
    telephone: '',
    email: '', // New field
    ville_id: null, // New field
    adresse: '' // New field
  }
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const loadingRoles = ref(false)
const availableRoles = ref<Role[]>([])
const availableCities = ref<ApiVille[]>([])
const loadingCities = ref(false)

const loadRoles = async () => {
  loadingRoles.value = true
  try {
    const response = await roleService.getAllRoles()
    if (response.success && response.data) {
      availableRoles.value = response.data
    }
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to load roles:', axiosError)
    notificationStore.error('Erreur', 'Impossible de charger les rôles')
  } finally {
    loadingRoles.value = false
  }
}

const loadCities = async () => {
  loadingCities.value = true
  try {
    const response = await cityService.getAllCities()
    if (response.success && response.data) {
      availableCities.value = response.data.data
    }
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to load cities:', axiosError)
    notificationStore.error('Erreur', 'Impossible de charger les villes')
  } finally {
    loadingCities.value = false
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.userInfoData.prenom?.trim()) {
    errors.value.prenom = 'Le prénom est requis'
  }

  if (!formData.value.userInfoData.nom?.trim()) {
    errors.value.nom = 'Le nom est requis'
  }

  if (!formData.value.userInfoData.email?.trim()) {
    errors.value.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.userInfoData.email)) {
    errors.value.email = 'L\'email n\'est pas valide'
  }

  if (!formData.value.userInfoData.telephone?.trim()) {
    errors.value.telephone = 'Le téléphone est requis'
  }

  // ville_id and adresse are optional, no required validation for now

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    if (isEditMode.value && props.user) {
      // Update existing user - envoyer le format avec userInfoData
      const updateData: UpdateUserRequest = {
        role_id: formData.value.role_id || undefined,
        userInfoData: {
          nom: formData.value.userInfoData.nom,
          prenom: formData.value.userInfoData.prenom,
          telephone: formData.value.userInfoData.telephone,
          email: formData.value.userInfoData.email, // New field
          ville_id: formData.value.userInfoData.ville_id, // New field
          adresse: formData.value.userInfoData.adresse // New field
        }
      }

      const response = await updateUser(props.user.id, updateData)

      if (response?.success && response.data) {
        emit('updated', response.data)
        close()
      }
    } else {
      // Create new user - envoyer le format avec userInfoData
      const createData: CreateUserRequest = {
        role_id: formData.value.role_id || undefined,
        userInfoData: {
          nom: formData.value.userInfoData.nom,
          prenom: formData.value.userInfoData.prenom,
          telephone: formData.value.userInfoData.telephone,
          email: formData.value.userInfoData.email, // New field
          ville_id: formData.value.userInfoData.ville_id, // New field
          adresse: formData.value.userInfoData.adresse // New field
        }
      }

      const response = await createUser(createData)

      if (response?.success && response.data) {
        emit('created', response.data)
        close()
      }
    }
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to save user:', axiosError)

    // Handle validation errors from backend
    if (axiosError.response?.data?.errors) {
      errors.value = axiosError.response.data.errors as Record<string, string>
    }
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

// Watch for modal opening/closing
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    // Load roles and cities when modal opens
    await Promise.all([loadRoles(), loadCities()])

    if (props.user) {
      // Populate form with user data for editing
      const prenom = props.user.user_info?.prenom || '';
      const nom = props.user.user_info?.nom || '';

      formData.value = {
        role_id: props.user.role?.id || '',
        userInfoData: {
          prenom: prenom,
          nom: nom,
          telephone: props.user.user_info?.telephone || props.user.telephone || '',
          email: props.user.user_info?.email || props.user.email || '', // New field
          ville_id: props.user.user_info?.ville_id || null, // New field
          adresse: props.user.user_info?.adresse || '' // New field
        }
      }
    } else {
      // Reset form for creating
      formData.value = {
        role_id: '',
        userInfoData: {
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          ville_id: null,
          adresse: ''
        }
      }
    }
    errors.value = {}
  } else {
    // Reset all form states when modal closes
    formData.value = {
      role_id: '',
      userInfoData: {
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        ville_id: null,
        adresse: ''
      }
    }
    errors.value = {}
    loading.value = false
    loadingRoles.value = false
    loadingCities.value = false // Reset loadingCities
  }
})
</script>