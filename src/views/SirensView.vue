<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Sirènes</h1>
          <p class="text-gray-600 mt-1">Inventaire des sirènes</p>
        </div>
        <Can permission="manage_sirens">
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"
          >
            <Plus :size="20" />
            Ajouter une sirène
          </button>
        </Can>
      </div>

      <!-- Statistics Cards -->
      <!-- The stats cards were removed as they were based on client-side filtering. -->
      <!-- A separate API endpoint would be needed to get accurate stats from the backend. -->

      <!-- Filter -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_stock">En stock</option>
          <option value="reserve">Réservée</option>
          <option value="installe">Installée</option>
          <option value="en_panne">En panne</option>
          <option value="hors_service">Hors service</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Sirens Grid -->
      <div v-if="!loading && sirens.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="siren in sirens"
          :key="siren.id"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Bell :size="24" class="text-white" />
            </div>
            <span :class="`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[siren.status]}`">
              {{ statusLabels[siren.status] }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">
            {{ siren.serial_number || 'N/A' }}
          </h3>
          <p class="text-sm text-gray-600 mb-4">{{ siren.siren_models?.nom || 'Modèle inconnu' }}</p>

          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-600">
              <Package :size="16" class="text-gray-400" />
              <span>Modèle: {{ siren.siren_models?.reference || 'N/A' }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <Calendar :size="16" class="text-gray-400" />
              <span>Fabriquée le {{ formatDate(siren.date_fabrication) }}</span>
            </div>
            <!-- School and Site Information -->
            <div v-if="siren.ecole" class="space-y-1 mt-2">
              <div class="flex items-center gap-2 text-gray-600">
                <School :size="16" class="text-gray-400" />
                <span>École: {{ siren.ecole.nom_complet || siren.ecole.nom }}</span>
              </div>
              <div v-if="siren.site" class="flex items-center gap-2 text-gray-600">
                <MapPin :size="16" class="text-gray-400" />
                <span>Site: {{ siren.site.nom }}</span>
              </div>
            </div>
            <!-- Specifications -->
            <div v-if="siren.siren_models?.specifications && Object.keys(siren.siren_models.specifications).length > 0" class="space-y-1 mt-2">
              <div v-for="(value, key) in siren.siren_models.specifications" :key="key" class="flex items-center gap-2 text-gray-600">
                <ClipboardList :size="16" class="text-gray-400" />
                <span class="font-semibold">{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </div>
          </div>

          <div v-if="siren.notes" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-gray-600">{{ siren.notes }}</p>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
            <Can permission="manage_sirens">
              <button
                @click="openEditModal(siren)"
                class="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <Edit :size="14" />
                Modifier
              </button>
            </Can>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="lastPage > 1" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Page {{ currentPage }} sur {{ lastPage }} - Total: {{ totalSirens }} sirènes
        </p>
        <div class="flex gap-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && sirens.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Bell :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune sirène trouvée</h3>
        <p class="text-gray-600">Aucune sirène ne correspond à vos critères</p>
      </div>
    </div>

    <!-- Siren Form Modal -->
    <SirenFormModal
      :is-open="isModalOpen"
      :siren="selectedSiren"
      @close="closeModal"
      @created="handleSirenCreated"
      @updated="handleSirenUpdated"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import SirenFormModal from '../components/sirens/SirenFormModal.vue'
import { Bell, Package, Calendar, Plus, Edit, ClipboardList, School, MapPin } from 'lucide-vue-next'
import { Can } from '@/components/permissions'
import { useSirens } from '@/composables/useSirens'
import type { ApiSiren } from '@/types/api'

const { sirens, loading, loadSirens, totalSirens, currentPage, lastPage } = useSirens()
const filterStatus = ref('all')
const isModalOpen = ref(false)
const selectedSiren = ref<ApiSiren | null>(null)

const statusColors: Record<string, string> = {
  en_stock: 'bg-blue-100 text-blue-700',
  reserve: 'bg-purple-100 text-purple-700',
  installe: 'bg-green-100 text-green-700',
  en_panne: 'bg-red-100 text-red-700',
  hors_service: 'bg-gray-100 text-gray-700',
}

const statusLabels: Record<string, string> = {
  en_stock: 'En stock',
  reserve: 'Réservée',
  installe: 'Installée',
  en_panne: 'En panne',
  hors_service: 'Hors service',
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const openCreateModal = () => {
  selectedSiren.value = null
  isModalOpen.value = true
}

const openEditModal = (siren: ApiSiren) => {
  selectedSiren.value = siren
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedSiren.value = null
}

const handleSirenCreated = async () => {
  closeModal()
  await loadSirens({ status: filterStatus.value === 'all' ? undefined : filterStatus.value })
}

const handleSirenUpdated = async () => {
  closeModal()
  await loadSirens({
    page: currentPage.value,
    status: filterStatus.value === 'all' ? undefined : filterStatus.value,
  })
}

const handlePageChange = (page: number) => {
  if (page > 0 && page <= lastPage.value) {
    loadSirens({
      page,
      status: filterStatus.value === 'all' ? undefined : filterStatus.value,
    })
  }
}

watch(filterStatus, (newStatus) => {
  loadSirens({
    page: 1,
    status: newStatus === 'all' ? undefined : newStatus,
  })
})

onMounted(async () => {
  await loadSirens({ status: filterStatus.value === 'all' ? undefined : filterStatus.value })
})
</script>