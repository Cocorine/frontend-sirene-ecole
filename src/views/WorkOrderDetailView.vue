<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Content -->
      <template v-else>
        <div class="flex items-center gap-4">
          <router-link to="/work-orders" class="text-gray-600 hover:text-gray-900">
            <ArrowLeft :size="24" />
          </router-link>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ orderData.order_number }}</h1>
            <p class="text-gray-600 mt-1">Détails de l'ordre de mission</p>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Type</p>
              <span :class="`inline-block px-3 py-1 rounded-full text-sm font-semibold ${typeColors[orderData.type]}`">
                {{ typeLabels[orderData.type] }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Priorité</p>
              <span :class="`inline-block px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[orderData.priority]}`">
                {{ priorityLabels[orderData.priority] }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">École</p>
              <p class="font-semibold text-gray-900">{{ orderData.school }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Technicien</p>
              <p class="font-semibold text-gray-900">{{ orderData.technician }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Date prévue</p>
              <p class="font-semibold text-gray-900">{{ formatDate(orderData.scheduled_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Statut</p>
              <span :class="`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[orderData.status]}`">
                {{ statusLabels[orderData.status] }}
              </span>
            </div>
          </div>

          <div v-if="orderData.description" class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-2">Description</p>
            <p class="text-gray-900">{{ orderData.description }}</p>
          </div>
        </div>

        <!-- School Location -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Localisation</h2>
          <div class="flex items-start gap-3">
            <MapPin :size="20" class="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <p class="font-semibold text-gray-900">{{ orderData.school }}</p>
              <p class="text-sm text-gray-600">{{ orderData.school_address }}</p>
            </div>
          </div>
        </div>

        <!-- Technician Info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Technicien assigné</h2>
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <User :size="24" class="text-white" />
            </div>
            <div>
              <p class="font-semibold text-gray-900">{{ orderData.technician }}</p>
              <p class="text-sm text-gray-600">Technicien certifié</p>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Historique</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle :size="16" class="text-blue-600" />
                </div>
                <div class="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div class="pb-8">
                <p class="font-semibold text-gray-900">Ordre créé</p>
                <p class="text-sm text-gray-600">{{ formatDate(orderData.created_at) }}</p>
              </div>
            </div>

            <div v-if="orderData.status !== 'pending'" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle :size="16" class="text-green-600" />
                </div>
                <div v-if="orderData.status === 'in_progress' || orderData.status === 'completed'" class="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div class="pb-8">
                <p class="font-semibold text-gray-900">Technicien assigné</p>
                <p class="text-sm text-gray-600">{{ orderData.technician }}</p>
              </div>
            </div>

            <div v-if="orderData.status === 'in_progress' || orderData.status === 'completed'" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <CheckCircle :size="16" class="text-cyan-600" />
                </div>
                <div v-if="orderData.status === 'completed'" class="w-0.5 h-full bg-gray-200 mt-2"></div>
              </div>
              <div class="pb-8">
                <p class="font-semibold text-gray-900">Intervention en cours</p>
                <p class="text-sm text-gray-600">Travaux démarrés</p>
              </div>
            </div>

            <div v-if="orderData.status === 'completed'" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle :size="16" class="text-green-600" />
                </div>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Intervention terminée</p>
                <p class="text-sm text-gray-600">Mission accomplie avec succès</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4">
          <button class="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
            Modifier l'ordre
          </button>
          <button class="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            Annuler
          </button>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { ArrowLeft, MapPin, User, CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const loading = ref(true)

// Mock data - In production, this would be fetched based on route.params.id
const orderData = ref({
  id: route.params.id,
  order_number: 'OM-2024-001',
  type: 'installation',
  priority: 'high',
  status: 'scheduled',
  school: 'École Primaire Wemtenga',
  school_address: 'Secteur 15, Ouagadougou, Burkina Faso',
  technician: 'Jean Ouédraogo',
  scheduled_date: '2024-06-10T09:00:00',
  created_at: '2024-06-01T10:30:00',
  description: 'Installation d\'une nouvelle sirène modèle SchoolBell Pro avec configuration du système de programmation horaire.',
})

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-cyan-100 text-cyan-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  scheduled: 'Planifié',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
}

const typeColors: Record<string, string> = {
  installation: 'bg-purple-100 text-purple-700',
  repair: 'bg-red-100 text-red-700',
  maintenance: 'bg-blue-100 text-blue-700',
  inspection: 'bg-green-100 text-green-700',
}

const typeLabels: Record<string, string> = {
  installation: 'Installation',
  repair: 'Réparation',
  maintenance: 'Maintenance',
  inspection: 'Inspection',
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

const priorityLabels: Record<string, string> = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
  urgent: 'Urgente',
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>
