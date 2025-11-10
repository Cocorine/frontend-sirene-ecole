<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Rapports</h1>
          <p class="text-gray-600 mt-1">Analyses et statistiques détaillées</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Download :size="20" />
          Exporter
        </button>
      </div>

      <!-- Date Range Filter -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 flex items-center gap-2">
            <Calendar :size="20" class="text-gray-400" />
            <input
              v-model="dateRange.from"
              type="date"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="text-gray-600">à</span>
            <input
              v-model="dateRange.to"
              type="date"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter :size="20" />
            Filtrer
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="(stat, i) in stats"
          :key="i"
          class="bg-white rounded-xl p-6 border border-gray-200"
        >
          <p class="text-sm text-gray-600 mb-2">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900 mb-2">{{ stat.value }}</p>
          <p :class="`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`">
            {{ stat.change }} vs période précédente
          </p>
          <div :class="`mt-3 h-1 rounded-full bg-gradient-to-r ${stat.color}`"></div>
        </div>
      </div>

      <!-- Monthly Evolution Chart -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Évolution mensuelle</h2>
        <div class="h-96">
          <!-- Simple Bar Chart Visualization -->
          <div class="flex items-end justify-around h-full gap-4 px-4">
            <div
              v-for="(month, i) in chartData"
              :key="i"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <div class="w-full flex gap-1 items-end justify-center" :style="{ height: '280px' }">
                <div class="relative group flex-1">
                  <div
                    class="bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
                    :style="{ height: `${(month.installations / maxValue) * 100}%` }"
                  ></div>
                  <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ month.installations }} installations
                  </div>
                </div>
                <div class="relative group flex-1">
                  <div
                    class="bg-orange-500 rounded-t-lg hover:bg-orange-600 transition-colors"
                    :style="{ height: `${(month.pannes / maxValue) * 100}%` }"
                  ></div>
                  <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ month.pannes }} pannes
                  </div>
                </div>
              </div>
              <span class="text-sm text-gray-600 font-medium">{{ month.month }}</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-blue-500 rounded"></div>
              <span class="text-sm text-gray-600">Installations</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-orange-500 rounded"></div>
              <span class="text-sm text-gray-600">Pannes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Schools and Technicians -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top 5 Schools -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Top 5 écoles</h2>
          <div class="space-y-3">
            <div
              v-for="(school, i) in topSchools"
              :key="i"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-700">{{ school.name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-600 rounded-full transition-all"
                    :style="{ width: `${school.value}%` }"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-gray-900 w-10 text-right">{{ school.value }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Technicians -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Top techniciens</h2>
          <div class="space-y-3">
            <div
              v-for="(tech, i) in topTechnicians"
              :key="i"
              class="flex items-center justify-between"
            >
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ tech.name }}</p>
                <p class="text-xs text-gray-600">{{ tech.interventions }} interventions</p>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-yellow-500">★</span>
                <span class="text-sm font-semibold">{{ tech.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Download, Calendar, Filter } from 'lucide-vue-next'

const dateRange = ref({
  from: '',
  to: '',
})

const stats = ref([
  { label: 'Installations', value: '121', change: '+12%', color: 'from-blue-500 to-blue-600' },
  { label: 'Pannes résolues', value: '27', change: '-8%', color: 'from-green-500 to-green-600' },
  { label: 'Revenus', value: '4.34M XOF', change: '+15%', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Nouveaux abonnés', value: '34', change: '+23%', color: 'from-cyan-500 to-cyan-600' },
])

const chartData = ref([
  { month: 'Jan', installations: 12, pannes: 3, revenus: 450000 },
  { month: 'Fév', installations: 19, pannes: 5, revenus: 680000 },
  { month: 'Mar', installations: 15, pannes: 2, revenus: 550000 },
  { month: 'Avr', installations: 22, pannes: 7, revenus: 820000 },
  { month: 'Mai', installations: 28, pannes: 4, revenus: 950000 },
  { month: 'Jun', installations: 25, pannes: 6, revenus: 890000 },
])

const maxValue = computed(() => {
  const allValues = chartData.value.flatMap(d => [d.installations, d.pannes])
  return Math.max(...allValues)
})

const topSchools = ref([
  { name: 'École Primaire Wemtenga', value: 98 },
  { name: 'Lycée Municipal', value: 95 },
  { name: 'Collège Sainte Marie', value: 92 },
  { name: 'École Les Papillons', value: 88 },
  { name: 'Lycée Technique', value: 85 },
])

const topTechnicians = ref([
  { name: 'Marie Kaboré', interventions: 45, rating: 4.9 },
  { name: 'Jean Ouédraogo', interventions: 42, rating: 4.8 },
  { name: 'Paul Sawadogo', interventions: 38, rating: 4.7 },
  { name: 'Sophie Traoré', interventions: 35, rating: 4.6 },
  { name: 'Ibrahim Compaoré', interventions: 32, rating: 4.5 },
])
</script>
