<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Modèles de sirènes</h1>
          <p class="text-gray-600 mt-1">Catalogue des modèles disponibles</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Plus :size="20" />
          Ajouter un modèle
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="model in models"
          :key="model.id"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Bell :size="24" class="text-white" />
            </div>
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {{ model.model_code }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ model.model_name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ model.manufacturer }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Puissance</span>
              <span class="font-semibold">{{ model.power }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Portée</span>
              <span class="font-semibold">{{ model.range }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-600 mb-2">Caractéristiques:</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(feature, i) in model.features"
                :key="i"
                class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
              >
                {{ feature }}
              </span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <button class="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Voir les détails
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Bell, Plus } from 'lucide-vue-next'

const models = ref([
  {
    id: '1',
    model_name: 'SchoolBell Pro',
    model_code: 'SBP-100',
    manufacturer: 'EduTech Solutions',
    power: '50W',
    range: '500m',
    features: ['Programmation horaire', 'Volume ajustable', 'Alimentation solaire'],
  },
  {
    id: '2',
    model_name: 'EduAlert Max',
    model_code: 'EAM-200',
    manufacturer: 'Smart School Systems',
    power: '100W',
    range: '1000m',
    features: ['Connectivité IoT', 'Gestion à distance', 'Batterie de secours', 'Multi-tonalités'],
  },
  {
    id: '3',
    model_name: 'ClassicBell Standard',
    model_code: 'CBS-50',
    manufacturer: 'Traditional Bell Co.',
    power: '30W',
    range: '300m',
    features: ['Simple et fiable', 'Faible consommation'],
  },
])
</script>
