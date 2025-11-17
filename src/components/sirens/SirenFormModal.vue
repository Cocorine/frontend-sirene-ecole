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
              {{ isEditMode ? 'Modifier la sirène' : 'Ajouter une nouvelle sirène' }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditMode ? 'Modifiez les informations de la sirène' : 'Remplissez les informations de la nouvelle sirène' }}
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
          <!-- Modèle de sirène -->
          <div>
            <label for="modele_id" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Modèle de sirène
              <Loader2 v-if="loadingModels" :size="16" class="animate-spin text-blue-600" aria-label="Chargement des modèles" />
            </label>
            <select
              id="modele_id"
              v-model="formData.modele_id"
              :disabled="loadingModels"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.modele_id, 'opacity-50 cursor-not-allowed': loadingModels }"
              :aria-invalid="!!errors.modele_id"
              :aria-describedby="errors.modele_id ? 'modele-error' : undefined"
            >
              <option value="">{{ loadingModels ? 'Chargement des modèles...' : 'Sélectionnez un modèle (optionnel)' }}</option>
              <option
                v-for="model in availableModels"
                :key="model.id"
                :value="model.id"
              >
                {{ model.nom }} ({{ model.reference }})
              </option>
            </select>
            <p v-if="errors.modele_id" id="modele-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.modele_id[0] }}</p>
          </div>

          <!-- Date de fabrication -->
          <div>
            <label for="date_fabrication" class="block text-sm font-semibold text-gray-700 mb-2">
              Date de fabrication <span class="text-red-500">*</span>
            </label>
            <input
              id="date_fabrication"
              v-model="formData.date_fabrication"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.date_fabrication }"
              :aria-invalid="!!errors.date_fabrication"
              :aria-describedby="errors.date_fabrication ? 'date-error' : undefined"
            />
            <p v-if="errors.date_fabrication" id="date-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.date_fabrication[0] }}</p>
          </div>

          <!-- Statut -->
          <div>
            <label for="status" class="block text-sm font-semibold text-gray-700 mb-2">
              Statut <span class="text-red-500">*</span>
            </label>
            <select
              id="status"
              v-model="formData.status"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.status }"
              :aria-invalid="!!errors.status"
              :aria-describedby="errors.status ? 'status-error' : undefined"
            >
              <option value="en_stock">En stock</option>
              <option value="reserve">Réservée</option>
              <option value="installe">Installée</option>
              <option value="en_panne">En panne</option>
              <option value="hors_service">Hors service</option>
            </select>
            <p v-if="errors.status" id="status-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.status[0] }}</p>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-semibold text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              v-model="formData.notes"
              rows="4"
              placeholder="Ajoutez des notes ou commentaires (optionnel)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              :class="{ 'border-red-500': errors.notes }"
              :aria-invalid="!!errors.notes"
              :aria-describedby="errors.notes ? 'notes-error' : undefined"
            />
            <p v-if="errors.notes" id="notes-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.notes[0] }}</p>
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
import { useSirens } from '@/composables/useSirens'
import type {
  ApiSiren,
  ApiSirenModel,
  CreateSirenRequest,
  UpdateSirenRequest,
} from '@/types/api'
import type { ApiAxiosError } from '@/types/api'
import { useNotificationStore } from '@/stores/notifications'
import { convertDMYToYMD, convertYMDToDMY, isValidDateFormat } from '@/utils/dateFormatter'

interface Props {
  isOpen: boolean
  siren?: ApiSiren | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', siren: ApiSiren): void
  (e: 'updated', siren: ApiSiren): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationStore = useNotificationStore()
const { createSiren, updateSiren, loadSirenModels, sirenModels } = useSirens()

const isEditMode = computed(() => !!props.siren)

const formData = ref<CreateSirenRequest & UpdateSirenRequest>({
  modele_id: '',
  date_fabrication: '',
  status: 'en_stock',
  notes: ''
})

const errors = ref<Record<string, string[]>>({})
const loading = ref(false)
const loadingModels = ref(false)
const availableModels = ref<ApiSirenModel[]>([])

const loadModels = async () => {
  loadingModels.value = true
  try {
    await loadSirenModels()
    availableModels.value = sirenModels.value
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to load siren models:', axiosError)
    notificationStore.error('Erreur', 'Impossible de charger les modèles de sirènes')
  } finally {
    loadingModels.value = false
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.date_fabrication?.trim()) {
    errors.value.date_fabrication = ['La date de fabrication est requise']
  } else if (!isValidDateFormat(convertYMDToDMY(formData.value.date_fabrication))) {
    errors.value.date_fabrication = ['Le format de la date de fabrication doit être JJ/MM/AAAA']
  }

  if (!formData.value.status?.trim()) {
    errors.value.status = ['Le statut est requis']
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const dataPayload = {
      date_fabrication: convertYMDToDMY(formData.value.date_fabrication),
      status: formData.value.status,
      notes: formData.value.notes || null,
      modele_id: formData.value.modele_id || undefined,
    }

    if (isEditMode.value && props.siren) {
      const response = await updateSiren(props.siren.id, dataPayload)
      if (response?.success && response.data) {
        emit('updated', response.data)
        close()
      }
    } else {
      const response = await createSiren(dataPayload)
      if (response?.success && response.data) {
        emit('created', response.data)
        close()
      }
    }
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to save siren:', axiosError)

    if (axiosError.response?.data?.errors) {
      errors.value = axiosError.response.data.errors as Record<string, string[]>
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
    await loadModels()

    if (props.siren) {
      // Robustly parse the incoming date and format it to YYYY-MM-DD for the input
      let formattedDate = ''
      if (props.siren.date_fabrication) {
        const date = new Date(props.siren.date_fabrication)
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear()
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const day = date.getDate().toString().padStart(2, '0')
          formattedDate = `${year}-${month}-${day}`
        } else {
          console.error('Could not parse date from backend:', props.siren.date_fabrication)
        }
      }

      formData.value = {
        modele_id: props.siren.modele_id || '',
        date_fabrication: formattedDate,
        status: props.siren.status || 'en_stock',
        notes: props.siren.notes || ''
      }
    } else {
      formData.value = {
        modele_id: '',
        date_fabrication: '',
        status: 'en_stock',
        notes: ''
      }
    }
    errors.value = {}
  } else {
    formData.value = {
      modele_id: '',
      date_fabrication: '',
      status: 'en_stock',
      notes: ''
    }
    errors.value = {}
    loading.value = false
    loadingModels.value = false
  }
})
</script>