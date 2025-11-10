<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center gap-4 mb-6">
        <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft :size="24" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Détail de l'école</h1>
          <p class="text-gray-600 mt-1">Informations complètes de l'établissement</p>
        </div>
      </div>

      <div class="bg-white rounded-xl p-8 border border-gray-200">
        <div class="flex items-center gap-6 mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Building2 :size="40" class="text-white" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">École Primaire Wemtenga</h2>
            <span class="inline-block text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold mt-2">
              Primaire
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Informations générales</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <MapPin :size="20" class="text-gray-400" />
                <span class="text-gray-700">123 Avenue Kwame Nkrumah, Ouagadougou</span>
              </div>
              <div class="flex items-center gap-3">
                <Phone :size="20" class="text-gray-400" />
                <span class="text-gray-700">+226 70 12 34 56</span>
              </div>
              <div class="flex items-center gap-3">
                <Mail :size="20" class="text-gray-400" />
                <span class="text-gray-700">contact@wemtenga.bf</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-sm text-gray-600">Sirènes</p>
                <p class="text-2xl font-bold text-blue-600">3</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <p class="text-sm text-gray-600">Sites</p>
                <p class="text-2xl font-bold text-green-600">2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Building2, MapPin, Phone, Mail, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.push('/schools')
}
</script>
