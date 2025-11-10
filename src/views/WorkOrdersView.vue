<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ordres de mission</h1>
          <p class="text-gray-600 mt-1">Gestion des missions techniques</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Plus :size="20" />
          Nouvel ordre de mission
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl p-6 border border-gray-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div :class="`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`">
              <component :is="stat.icon" :size="24" class="text-white" />
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-1">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <select
            v-model="filterStatus"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="scheduled">Planifié</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
          <select
            v-model="filterType"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            <option value="installation">Installation</option>
            <option value="repair">Réparation</option>
            <option value="maintenance">Maintenance</option>
            <option value="inspection">Inspection</option>
          </select>
        </div>
      </div>

      <!-- Work Orders Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <router-link
          v-for="order in filteredOrders"
          :key="order.id"
          :to="`/work-orders/${order.id}`"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ order.order_number }}</h3>
                <span :class="`inline-block px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[order.priority]}`">
                  {{ priorityLabels[order.priority] }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span :class="`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`">
                  {{ statusLabels[order.status] }}
                </span>
                <span :class="`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeColors[order.type]}`">
                  {{ typeLabels[order.type] }}
                </span>
              </div>
            </div>
            <ClipboardList :size="24" class="text-gray-400" />
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-2">
              <MapPin :size="16" class="text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ order.school }}</p>
                <p class="text-xs text-gray-600">{{ order.school_address }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <User :size="16" class="text-gray-400 flex-shrink-0" />
              <p class="text-sm text-gray-700">{{ order.technician }}</p>
            </div>

            <div class="flex items-center gap-2">
              <Calendar :size="16" class="text-gray-400 flex-shrink-0" />
              <p class="text-sm text-gray-700">{{ formatDate(order.scheduled_date) }}</p>
            </div>

            <div v-if="order.description" class="pt-3 border-t border-gray-100">
              <div class="flex items-start gap-2">
                <AlertCircle :size="16" class="text-gray-400 mt-1 flex-shrink-0" />
                <p class="text-sm text-gray-600">{{ order.description }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-if="filteredOrders.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <ClipboardList :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun ordre de mission</h3>
        <p class="text-gray-600">Aucun ordre de mission ne correspond à vos critères</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { ClipboardList, Plus, Calendar, User, MapPin, AlertCircle, FileText, Clock, CheckCircle } from 'lucide-vue-next'

const filterStatus = ref('all')
const filterType = ref('all')

const workOrders = ref([
  {
    id: '1',
    order_number: 'OM-2024-001',
    type: 'installation',
    priority: 'high',
    status: 'scheduled',
    school: 'École Wemtenga A',
    school_address: 'Secteur 15, Ouagadougou',
    technician: 'Jean Ouédraogo',
    scheduled_date: '2024-01-20',
    description: 'Installation d\'une nouvelle sirène modèle SchoolBell Pro',
  },
  {
    id: '2',
    order_number: 'OM-2024-002',
    type: 'repair',
    priority: 'urgent',
    status: 'in_progress',
    school: 'École Gounghin B',
    school_address: 'Secteur 8, Ouagadougou',
    technician: 'Marie Kaboré',
    scheduled_date: '2024-01-18',
    description: 'Réparation d\'urgence - Sirène ne fonctionne plus',
  },
  {
    id: '3',
    order_number: 'OM-2024-003',
    type: 'maintenance',
    priority: 'normal',
    status: 'pending',
    school: 'École Somgandé',
    school_address: 'Secteur 22, Ouagadougou',
    technician: 'Paul Sawadogo',
    scheduled_date: '2024-01-25',
    description: 'Maintenance préventive trimestrielle',
  },
  {
    id: '4',
    order_number: 'OM-2024-004',
    type: 'inspection',
    priority: 'low',
    status: 'completed',
    school: 'École Patte d\'Oie',
    school_address: 'Secteur 5, Ouagadougou',
    technician: 'Sophie Compaoré',
    scheduled_date: '2024-01-15',
    description: 'Inspection annuelle réglementaire',
  },
])

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

const stats = computed(() => [
  {
    label: 'Total',
    value: workOrders.value.length,
    color: 'from-blue-500 to-blue-600',
    icon: FileText,
  },
  {
    label: 'En attente',
    value: workOrders.value.filter(o => o.status === 'pending').length,
    color: 'from-yellow-500 to-yellow-600',
    icon: Clock,
  },
  {
    label: 'En cours',
    value: workOrders.value.filter(o => o.status === 'in_progress').length,
    color: 'from-cyan-500 to-cyan-600',
    icon: ClipboardList,
  },
  {
    label: 'Terminées',
    value: workOrders.value.filter(o => o.status === 'completed').length,
    color: 'from-green-500 to-green-600',
    icon: CheckCircle,
  },
])

const filteredOrders = computed(() => {
  return workOrders.value.filter(order => {
    const matchesStatus = filterStatus.value === 'all' || order.status === filterStatus.value
    const matchesType = filterType.value === 'all' || order.type === filterType.value
    return matchesStatus && matchesType
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>
