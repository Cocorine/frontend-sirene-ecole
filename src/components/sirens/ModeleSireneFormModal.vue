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
              {{ isEditMode ? 'Modifier le modèle de sirène' : 'Ajouter un nouveau modèle' }}
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditMode ? 'Modifiez les informations du modèle' : 'Remplissez les informations du nouveau modèle' }}
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
          <!-- Nom du modèle -->
          <div>
            <label for="nom" class="block text-sm font-semibold text-gray-700 mb-2">
              Nom du modèle <span class="text-red-500">*</span>
            </label>
            <input
              id="nom"
              v-model="formData.nom"
              type="text"
              required
              placeholder="Ex: SchoolBell Pro"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.nom }"
              :aria-invalid="!!errors.nom"
              :aria-describedby="errors.nom ? 'nom-error' : undefined"
            />
            <p v-if="errors.nom" id="nom-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.nom }}</p>
          </div>

          <!-- Référence -->
          <div>
            <label for="reference" class="block text-sm font-semibold text-gray-700 mb-2">
              Référence <span class="text-red-500">*</span>
            </label>
            <input
              id="reference"
              v-model="formData.reference"
              type="text"
              required
              placeholder="Ex: REF-SB-001"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.reference }"
              :aria-invalid="!!errors.reference"
              :aria-describedby="errors.reference ? 'reference-error' : undefined"
            />
            <p v-if="errors.reference" id="reference-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.reference }}</p>
          </div>

          <!-- Version Firmware -->
          <div>
            <label for="version_firmware" class="block text-sm font-semibold text-gray-700 mb-2">
              Version Firmware
            </label>
            <input
              id="version_firmware"
              v-model="formData.version_firmware"
              type="text"
              placeholder="Ex: 1.0.0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.version_firmware }"
              :aria-invalid="!!errors.version_firmware"
              :aria-describedby="errors.version_firmware ? 'version-firmware-error' : undefined"
            />
            <p v-if="errors.version_firmware" id="version-firmware-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.version_firmware }}</p>
          </div>

          <!-- Prix Unitaire -->
          <div>
            <label for="prix_unitaire" class="block text-sm font-semibold text-gray-700 mb-2">
              Prix Unitaire <span class="text-red-500">*</span>
            </label>
            <input
              id="prix_unitaire"
              v-model.number="formData.prix_unitaire"
              type="number"
              step="0.01"
              required
              min="0"
              placeholder="Ex: 150.00"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600"
              :class="{ 'border-red-500': errors.prix_unitaire }"
              :aria-invalid="!!errors.prix_unitaire"
              :aria-describedby="errors.prix_unitaire ? 'prix-unitaire-error' : undefined"
            />
            <p v-if="errors.prix_unitaire" id="prix-unitaire-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.prix_unitaire }}</p>
          </div>

          <!-- Spécifications -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Spécifications
            </label>
            <div v-for="(spec, index) in formData.specifications" :key="index" class="flex items-center gap-2 mb-2">
              <div class="flex-1">
                <input
                  v-model="spec.key"
                  type="text"
                  placeholder="Clé (ex: Poids)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  :class="{ 'border-red-500': errors[`spec_key_${index}`] }"
                />
                <p v-if="errors[`spec_key_${index}`]" class="text-sm text-red-600 mt-1">{{ errors[`spec_key_${index}`] }}</p>
              </div>
              <div class="flex-1">
                <input
                  v-model="spec.value"
                  type="text"
                  placeholder="Valeur (ex: 2kg)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                type="button"
                @click="removeSpecification(index)"
                class="p-2 text-red-500 hover:bg-red-100 rounded-full"
                aria-label="Supprimer la spécification"
              >
                <Trash2 :size="16" />
              </button>
            </div>
            <button
              type="button"
              @click="addSpecification"
              class="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <PlusCircle :size="16" />
              Ajouter une spécification
            </button>
          </div>

          <!-- Actif -->
          <div class="flex items-center">
            <input
              id="actif"
              v-model="formData.actif"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="actif" class="ml-2 block text-sm font-semibold text-gray-700">
              Actif
            </label>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Ajoutez une description du modèle (optionnel)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus-visible:ring-2 focus-visible:ring-blue-600 resize-none"
              :class="{ 'border-red-500': errors.description }"
              :aria-invalid="!!errors.description"
              :aria-describedby="errors.description ? 'description-error' : undefined"
            />
            <p v-if="errors.description" id="description-error" class="text-sm text-red-600 mt-1" role="alert">{{ errors.description }}</p>
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
import { X, Trash2, PlusCircle } from 'lucide-vue-next'
import sirenService from '@/services/sirenService'
import type {
  ApiSirenModel,
  CreateSirenModelRequest,
  UpdateSirenModelRequest,
} from '@/types/api'
import type { ApiAxiosError } from '@/types/api'
import { useNotificationStore } from '@/stores/notifications'

interface Props {
  isOpen: boolean
  model?: ApiSirenModel | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', model: ApiSirenModel): void
  (e: 'updated', model: ApiSirenModel): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const notificationStore = useNotificationStore()

const isEditMode = computed(() => !!props.model)

interface Specification {
  key: string
  value: string
}

const formData = ref<{
  nom: string
  reference: string
  description: string
  specifications: Specification[]
  version_firmware: string
  prix_unitaire: number
  actif: boolean
}>({
  nom: '',
  reference: '',
  description: '',
  specifications: [],
  version_firmware: '',
  prix_unitaire: 0,
  actif: true,
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// --- Specifications ---
const addSpecification = () => {
  formData.value.specifications.push({ key: '', value: '' })
}

const removeSpecification = (index: number) => {
  formData.value.specifications.splice(index, 1)
}
// --------------------

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.nom?.trim()) {
    errors.value.nom = 'Le nom du modèle est requis'
  }

  if (!formData.value.reference?.trim()) {
    errors.value.reference = 'La référence est requise'
  }

  if (formData.value.prix_unitaire === undefined || formData.value.prix_unitaire < 0) {
    errors.value.prix_unitaire = 'Le prix unitaire est requis et doit être positif'
  }

  // Validate specifications: keys should not be empty
  formData.value.specifications.forEach((spec, index) => {
    if (!spec.key.trim()) {
      errors.value[`spec_key_${index}`] = 'La clé de la spécification ne peut pas être vide'
    }
  })

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  // Transform specifications from array of objects to a single object
  const specificationsObject = formData.value.specifications.reduce((obj, item) => {
    if (item.key.trim()) { // Only add if key is not empty
      obj[item.key] = item.value
    }
    return obj
  }, {} as Record<string, string>)

  try {
    const commonData = {
      nom: formData.value.nom,
      reference: formData.value.reference,
      description: formData.value.description || null,
      specifications: specificationsObject, // Use the transformed object
      version_firmware: formData.value.version_firmware || null,
      prix_unitaire: formData.value.prix_unitaire,
      actif: formData.value.actif,
    }

    if (isEditMode.value && props.model) {
      const response = await sirenService.updateSirenModel(props.model.id, commonData)
      if (response?.success && response.data) {
        notificationStore.success('Modèle modifié', 'Le modèle de sirène a été modifié avec succès')
        emit('updated', response.data)
        close()
      }
    } else {
      const response = await sirenService.createSirenModel(commonData)
      if (response?.success && response.data) {
        notificationStore.success('Modèle créé', 'Le modèle de sirène a été créé avec succès')
        emit('created', response.data)
        close()
      }
    }
  } catch (error) {
    const axiosError = error as ApiAxiosError
    console.error('Failed to save siren model:', axiosError)

    if (axiosError.response?.data?.errors) {
      const backendErrors = axiosError.response.data.errors as Record<string, string[]>
      const formattedErrors: Record<string, string> = {}
      for (const field in backendErrors) {
        if (backendErrors[field] && backendErrors[field].length > 0) {
          formattedErrors[field] = backendErrors[field][0]
        }
      }
      errors.value = formattedErrors
    } else {
      notificationStore.error('Erreur', isEditMode.value ? 'Impossible de modifier le modèle' : 'Impossible de créer le modèle')
    }
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

// Watch for modal opening/closing
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.model) {
      // Populate form with model data for editing
      const specs = props.model.specifications || {}
      const specificationsArray = Object.keys(specs).map(key => ({ key, value: specs[key] }))

      formData.value = {
        nom: props.model.nom,
        reference: props.model.reference,
        description: props.model.description || '',
        specifications: specificationsArray,
        version_firmware: props.model.version_firmware || '',
        prix_unitaire: props.model.prix_unitaire,
        actif: props.model.actif,
      }
    } else {
      // Reset form for creating
      formData.value = {
        nom: '',
        reference: '',
        description: '',
        specifications: [],
        version_firmware: '',
        prix_unitaire: 0,
        actif: true,
      }
    }
    errors.value = {}
  } else {
    // Reset all form states when modal closes
    formData.value = {
      nom: '',
      reference: '',
      description: '',
      specifications: [],
      version_firmware: '',
      prix_unitaire: 0,
      actif: true,
    }
    errors.value = {}
    loading.value = false
  }
})
</script>
