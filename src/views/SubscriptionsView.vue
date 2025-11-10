<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Abonnements</h1>
          <p class="text-gray-600 mt-1">Gérer les abonnements des écoles</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <!-- Filter -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="expired">Expiré</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-96">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>

      <!-- Subscriptions Table -->
      <div v-if="!loading" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">École</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dates</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jours restants</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="sub in filteredSubscriptions"
                :key="sub.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div>
                    <p class="font-semibold text-gray-900">{{ sub.schools.name }}</p>
                    <p class="text-sm text-gray-600">{{ sub.schools.city }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ sub.subscription_plans.plan_name }}
                </td>
                <td class="px-6 py-4">
                  <span class="font-semibold text-gray-900">
                    {{ sub.subscription_plans.price.toLocaleString() }} XOF
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <div class="flex items-center gap-2 mb-1">
                    <Calendar :size="16" class="text-gray-400" />
                    <span>Du {{ formatDate(sub.start_date) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Calendar :size="16" class="text-gray-400" />
                    <span>Au {{ formatDate(sub.end_date) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="sub.status === 'active'"
                    :class="`text-sm font-semibold ${
                      getDaysRemaining(sub.end_date) < 30 ? 'text-red-600' : 'text-gray-900'
                    }`"
                  >
                    {{ getDaysRemaining(sub.end_date) }} jours
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[sub.status]?.bg} ${statusColors[sub.status]?.text}`">
                    <component :is="getStatusIcon(sub.status)" :size="12" />
                    {{ sub.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button class="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    Détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredSubscriptions.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <CreditCard :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun abonnement trouvé</h3>
        <p class="text-gray-600">Aucun abonnement ne correspond à vos critères</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { CreditCard, Clock, CheckCircle, XCircle, Calendar } from 'lucide-vue-next'

interface Subscription {
  id: string
  school_id: string
  start_date: string
  end_date: string
  status: string
  schools: {
    name: string
    city: string
  }
  subscription_plans: {
    plan_name: string
    price: number
  }
}

const subscriptions = ref<Subscription[]>([])
const loading = ref(true)
const filterStatus = ref('all')

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  expired: { bg: 'bg-red-100', text: 'text-red-700' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
}

const stats = computed(() => [
  { label: 'Total', count: subscriptions.value.length, color: 'from-blue-500 to-blue-600' },
  { label: 'Actifs', count: subscriptions.value.filter(s => s.status === 'active').length, color: 'from-green-500 to-green-600' },
  { label: 'En attente', count: subscriptions.value.filter(s => s.status === 'pending').length, color: 'from-yellow-500 to-yellow-600' },
  { label: 'Expirés', count: subscriptions.value.filter(s => s.status === 'expired').length, color: 'from-red-500 to-red-600' },
])

const filteredSubscriptions = computed(() => {
  return subscriptions.value.filter(sub =>
    filterStatus.value === 'all' || sub.status === filterStatus.value
  )
})

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    active: CheckCircle,
    pending: Clock,
    expired: XCircle,
    cancelled: XCircle,
  }
  return icons[status] || Clock
}

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate)
  const now = new Date()
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const fetchSubscriptions = async () => {
  setTimeout(() => {
    subscriptions.value = [
      {
        id: '1',
        school_id: '1',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'active',
        schools: {
          name: 'École Primaire Wemtenga',
          city: 'Ouagadougou',
        },
        subscription_plans: {
          plan_name: 'Plan Annuel',
          price: 120000,
        },
      },
      {
        id: '2',
        school_id: '2',
        start_date: '2024-02-01',
        end_date: '2025-01-31',
        status: 'active',
        schools: {
          name: 'Lycée Municipal de Ouaga',
          city: 'Ouagadougou',
        },
        subscription_plans: {
          plan_name: 'Plan Annuel',
          price: 120000,
        },
      },
      {
        id: '3',
        school_id: '3',
        start_date: '2024-03-01',
        end_date: '2024-08-31',
        status: 'active',
        schools: {
          name: 'Collège Sainte Marie',
          city: 'Bobo-Dioulasso',
        },
        subscription_plans: {
          plan_name: 'Plan Semestriel',
          price: 65000,
        },
      },
      {
        id: '4',
        school_id: '4',
        start_date: '2023-09-01',
        end_date: '2024-08-31',
        status: 'expired',
        schools: {
          name: 'École Maternelle Les Papillons',
          city: 'Koudougou',
        },
        subscription_plans: {
          plan_name: 'Plan Annuel',
          price: 120000,
        },
      },
    ]
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchSubscriptions()
})
</script>
