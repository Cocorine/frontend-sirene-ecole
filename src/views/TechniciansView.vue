<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Techniciens</h1>
          <p class="text-gray-600 mt-1">Gérer l'équipe de maintenance</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl p-6 border border-gray-200"
        >
          <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900">{{ stat.count }}</p>
          <div :class="`mt-3 h-1 rounded-full bg-gradient-to-r ${stat.color}`"></div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Technicians Grid -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tech in technicians"
          :key="tech.id"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wrench :size="24" class="text-white" />
            </div>
            <span :class="`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[tech.availability_status]}`">
              {{ statusLabels[tech.availability_status] }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ tech.users.full_name }}</h3>
          <p v-if="tech.specialization" class="text-sm text-gray-600 mb-3">{{ tech.specialization }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Phone :size="16" class="text-gray-400" />
              <span>{{ tech.users.phone }}</span>
            </div>
            <div v-if="tech.cities_covered.length > 0" class="flex items-center gap-2 text-sm text-gray-600">
              <MapPin :size="16" class="text-gray-400" />
              <span>{{ tech.cities_covered.join(', ') }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex items-center gap-1">
              <Star :size="16" class="text-yellow-500 fill-yellow-500" />
              <span class="text-sm font-semibold text-gray-900">
                {{ tech.rating.toFixed(1) }}
              </span>
            </div>
            <span class="text-sm text-gray-600">
              {{ tech.total_interventions }} interventions
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && technicians.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Wrench :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun technicien</h3>
        <p class="text-gray-600">Ajoutez votre premier technicien</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Wrench, Star, MapPin, Phone } from 'lucide-vue-next'

interface Technician {
  id: string
  specialization: string | null
  cities_covered: string[]
  availability_status: string
  rating: number
  total_interventions: number
  users: {
    full_name: string
    phone: string
    email: string | null
  }
}

const technicians = ref<Technician[]>([])
const loading = ref(true)

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  busy: 'bg-orange-100 text-orange-700',
  off_duty: 'bg-gray-100 text-gray-700',
  unavailable: 'bg-gray-100 text-gray-700',
}

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  busy: 'Occupé',
  off_duty: 'Hors service',
  unavailable: 'Indisponible',
}

const stats = computed(() => [
  { label: 'Total', count: technicians.value.length, color: 'from-blue-500 to-blue-600' },
  { label: 'Disponibles', count: technicians.value.filter(t => t.availability_status === 'available').length, color: 'from-green-500 to-green-600' },
  { label: 'En intervention', count: technicians.value.filter(t => t.availability_status === 'busy').length, color: 'from-orange-500 to-orange-600' },
])

const fetchTechnicians = async () => {
  setTimeout(() => {
    technicians.value = [
      {
        id: '1',
        specialization: 'Électronique',
        cities_covered: ['Ouagadougou', 'Koudougou'],
        availability_status: 'available',
        rating: 4.8,
        total_interventions: 145,
        users: {
          full_name: 'Jean Ouédraogo',
          phone: '+22670111111',
          email: 'jean.ouedraogo@tech.bf',
        },
      },
      {
        id: '2',
        specialization: 'Systèmes audio',
        cities_covered: ['Ouagadougou', 'Bobo-Dioulasso'],
        availability_status: 'busy',
        rating: 4.9,
        total_interventions: 198,
        users: {
          full_name: 'Marie Kaboré',
          phone: '+22670222222',
          email: 'marie.kabore@tech.bf',
        },
      },
      {
        id: '3',
        specialization: 'Électricité générale',
        cities_covered: ['Bobo-Dioulasso', 'Ouahigouya'],
        availability_status: 'available',
        rating: 4.7,
        total_interventions: 132,
        users: {
          full_name: 'Paul Sawadogo',
          phone: '+22670333333',
          email: 'paul.sawadogo@tech.bf',
        },
      },
      {
        id: '4',
        specialization: 'Réseaux et câblage',
        cities_covered: ['Koudougou', 'Dédougou'],
        availability_status: 'available',
        rating: 4.6,
        total_interventions: 89,
        users: {
          full_name: 'Sophie Traoré',
          phone: '+22670444444',
          email: 'sophie.traore@tech.bf',
        },
      },
      {
        id: '5',
        specialization: 'Électronique',
        cities_covered: ['Ouahigouya', 'Fada N\'Gourma'],
        availability_status: 'unavailable',
        rating: 4.5,
        total_interventions: 76,
        users: {
          full_name: 'Ibrahim Compaoré',
          phone: '+22670555555',
          email: 'ibrahim.compaore@tech.bf',
        },
      },
    ]
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchTechnicians()
})
</script>
