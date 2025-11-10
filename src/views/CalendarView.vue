<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Calendrier scolaire</h1>
          <p class="text-gray-600 mt-1">Gérer les périodes scolaires et jours fériés</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Plus :size="20" />
          Ajouter une période
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Calendrier 2024-2025</h2>
          <div class="grid grid-cols-7 gap-2 text-center">
            <div
              v-for="day in weekDays"
              :key="day"
              class="font-semibold text-gray-600 py-2"
            >
              {{ day }}
            </div>
            <div
              v-for="i in 35"
              :key="i"
              class="aspect-square flex items-center justify-center rounded-lg hover:bg-blue-50 cursor-pointer border border-gray-100"
            >
              {{ i }}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Jours fériés</h2>
          <div class="space-y-3">
            <div
              v-for="(holiday, i) in holidays"
              :key="i"
              class="p-3 bg-gray-50 rounded-lg"
            >
              <p class="font-semibold text-gray-900">{{ holiday.name }}</p>
              <p class="text-sm text-gray-600">{{ holiday.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Périodes de vacances</h2>
        <div class="space-y-3">
          <div
            v-for="(vacation, i) in vacations"
            :key="i"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ vacation.name }}</p>
              <p class="text-sm text-gray-600">Du {{ vacation.start }} au {{ vacation.end }}</p>
            </div>
            <button class="text-sm text-blue-600 hover:text-blue-700 font-semibold">Modifier</button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Plus } from 'lucide-vue-next'

const weekDays = ref(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'])

const holidays = ref([
  { date: '1 janvier', name: 'Nouvel An' },
  { date: '11 décembre', name: 'Fête Nationale' },
  { date: '25 décembre', name: 'Noël' },
])

const vacations = ref([
  { name: 'Vacances de Noël', start: '20 décembre 2024', end: '5 janvier 2025' },
  { name: 'Vacances de Pâques', start: '15 avril 2025', end: '30 avril 2025' },
  { name: 'Grandes vacances', start: '1 juillet 2025', end: '30 septembre 2025' },
])
</script>
