<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestion des écoles</h1>
          <p class="text-gray-600 mt-1">Gérer les établissements scolaires du système</p>
        </div>
        <button
          @click="formModalOpen = true"
          class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02]"
        >
          <Plus :size="20" />
          Nouvelle école
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une école par nom ou ville..."
              v-model="searchTerm"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="filterType"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="maternelle">Maternelle</option>
              <option value="primaire">Primaire</option>
              <option value="secondaire">Secondaire</option>
              <option value="superieur">Supérieur</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Schools Grid -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="school in filteredSchools"
          :key="school.id"
          :to="`/schools/${school.id}`"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Building2 :size="24" class="text-white" />
            </div>
            <div class="flex gap-2">
              <span :class="`text-xs px-2 py-1 rounded-full font-semibold ${typeColors[school.type]}`">
                {{ school.type }}
              </span>
              <span :class="`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[school.status]}`">
                {{ school.status }}
              </span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ school.name }}</h3>

          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <MapPin :size="16" class="text-gray-400" />
              <span>{{ school.city }}, {{ school.region }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone :size="16" class="text-gray-400" />
              <span>{{ school.phone }}</span>
            </div>
            <div v-if="school.email" class="flex items-center gap-2">
              <Mail :size="16" class="text-gray-400" />
              <span class="truncate">{{ school.email }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">
              Créée le {{ formatDate(school.created_at) }}
            </p>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredSchools.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Building2 :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune école trouvée</h3>
        <p class="text-gray-600">
          {{ searchTerm || filterType !== 'all'
            ? 'Essayez de modifier vos filtres de recherche'
            : 'Commencez par ajouter votre première école' }}
        </p>
      </div>

      <!-- Modal placeholder (will show alert for now) -->
      <div v-if="formModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="formModalOpen = false">
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Nouvelle école</h2>
          <p class="text-gray-600 mb-4">Formulaire de création d'école (à implémenter)</p>
          <button
            @click="formModalOpen = false"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Building2, Plus, Search, MapPin, Phone, Mail } from 'lucide-vue-next'

interface School {
  id: string
  name: string
  type: string
  phone: string
  email: string | null
  address: string
  city: string
  region: string
  status: string
  created_at: string
}

const schools = ref<School[]>([])
const loading = ref(true)
const searchTerm = ref('')
const filterType = ref('all')
const formModalOpen = ref(false)

const typeColors: Record<string, string> = {
  maternelle: 'bg-pink-100 text-pink-700',
  primaire: 'bg-blue-100 text-blue-700',
  secondaire: 'bg-purple-100 text-purple-700',
  superieur: 'bg-indigo-100 text-indigo-700',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
}

const filteredSchools = computed(() => {
  return schools.value.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesType = filterType.value === 'all' || school.type === filterType.value
    return matchesSearch && matchesType
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const fetchSchools = async () => {
  setTimeout(() => {
    schools.value = [
      {
        id: '1',
        name: 'École Primaire Wemtenga',
        type: 'primaire',
        phone: '+22670123456',
        email: 'contact@wemtenga.bf',
        address: '123 Avenue Kwame Nkrumah',
        city: 'Ouagadougou',
        region: 'Centre',
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        name: 'Lycée Municipal de Ouaga',
        type: 'secondaire',
        phone: '+22670234567',
        email: 'contact@lycee-muni.bf',
        address: '456 Boulevard de la Révolution',
        city: 'Ouagadougou',
        region: 'Centre',
        status: 'active',
        created_at: '2024-02-10T10:00:00Z',
      },
      {
        id: '3',
        name: 'Collège Sainte Marie',
        type: 'secondaire',
        phone: '+22670345678',
        email: 'info@saintemarie.bf',
        address: '789 Rue de la Paix',
        city: 'Bobo-Dioulasso',
        region: 'Hauts-Bassins',
        status: 'active',
        created_at: '2024-03-05T10:00:00Z',
      },
      {
        id: '4',
        name: 'École Maternelle Les Papillons',
        type: 'maternelle',
        phone: '+22670456789',
        email: 'papillons@école.bf',
        address: '12 Avenue de l\'Indépendance',
        city: 'Koudougou',
        region: 'Centre-Ouest',
        status: 'active',
        created_at: '2024-04-12T10:00:00Z',
      },
      {
        id: '5',
        name: 'Lycée Technique de Ouahigouya',
        type: 'secondaire',
        phone: '+22670567890',
        email: 'technique@ouahigouya.bf',
        address: '34 Route Nationale',
        city: 'Ouahigouya',
        region: 'Nord',
        status: 'active',
        created_at: '2024-05-20T10:00:00Z',
      },
    ]
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchSchools()
})
</script>
