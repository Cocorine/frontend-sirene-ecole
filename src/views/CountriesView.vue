<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Pays</h1>
          <p class="text-gray-600 mt-1">Configuration multi-pays</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Plus :size="20" />
          Ajouter un pays
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="country in countries"
          :key="country.id"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Globe :size="24" class="text-white" />
            </div>
            <span :class="`text-xs px-2 py-1 rounded-full font-semibold ${
              country.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`">
              {{ country.status === 'active' ? 'Actif' : 'Inactif' }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ country.name }}</h3>
          <p class="text-sm text-gray-600 mb-4">Code ISO: {{ country.iso_code }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Indicatif</span>
              <span class="font-semibold">{{ country.phone_code }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Devise</span>
              <span class="font-semibold">{{ country.currency }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Fuseau horaire</span>
              <span class="font-semibold text-xs">{{ country.timezone }}</span>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-600">Écoles</span>
              <span class="text-2xl font-bold text-blue-600">{{ country.schools_count }}</span>
            </div>
            <button class="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Configurer
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
import { Globe, Plus } from 'lucide-vue-next'

const countries = ref([
  {
    id: '1',
    name: 'Burkina Faso',
    iso_code: 'BF',
    phone_code: '+226',
    currency: 'XOF',
    timezone: 'Africa/Ouagadougou',
    schools_count: 47,
    status: 'active',
  },
  {
    id: '2',
    name: 'Côte d\'Ivoire',
    iso_code: 'CI',
    phone_code: '+225',
    currency: 'XOF',
    timezone: 'Africa/Abidjan',
    schools_count: 0,
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Sénégal',
    iso_code: 'SN',
    phone_code: '+221',
    currency: 'XOF',
    timezone: 'Africa/Dakar',
    schools_count: 0,
    status: 'inactive',
  },
])
</script>
