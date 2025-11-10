<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p class="text-gray-600 mt-1">Gérer vos informations personnelles</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <div class="text-center">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-3xl">
                {{ userProfile.full_name.split(' ').map((n: string) => n[0]).join('') }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-1">{{ userProfile.full_name }}</h2>
            <p class="text-sm text-gray-600 mb-4">{{ userProfile.email }}</p>
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {{ roleLabel }}
            </span>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <Phone :size="16" class="text-gray-400" />
              <span class="text-gray-700">{{ userProfile.phone }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Calendar :size="16" class="text-gray-400" />
              <span class="text-gray-700">Membre depuis {{ formatMemberSince(userProfile.created_at) }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <Shield :size="16" class="text-gray-400" />
              <span class="text-green-700 font-semibold">Compte actif</span>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Nom complet
                </label>
                <input
                  v-model="formData.full_name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Téléphone
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Changer le mot de passe</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    v-model="passwordData.current"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    v-model="passwordData.new"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    v-model="passwordData.confirm"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                @click="handleSave"
                class="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                Enregistrer les modifications
              </button>
              <button
                @click="handleCancel"
                class="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
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
import { Phone, Calendar, Shield } from 'lucide-vue-next'

// Mock user data - In production, this would come from auth store
const userProfile = ref({
  id: '1',
  full_name: 'Admin Principal',
  email: 'admin@demo.com',
  phone: '+22670000001',
  role: 'super_admin',
  status: 'active',
  created_at: '2024-01-15',
})

const formData = ref({
  full_name: userProfile.value.full_name,
  email: userProfile.value.email,
  phone: userProfile.value.phone,
})

const passwordData = ref({
  current: '',
  new: '',
  confirm: '',
})

const roleLabel = computed(() => {
  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    country_admin: 'Admin Pays',
    school_admin: 'Admin École',
    technician: 'Technicien',
  }
  return roleLabels[userProfile.value.role] || userProfile.value.role
})

const formatMemberSince = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
}

const handleSave = () => {
  // In production, this would call the API to update profile
  console.log('Saving profile:', formData.value)
  console.log('Password change:', passwordData.value)
  alert('Modifications enregistrées avec succès!')
}

const handleCancel = () => {
  // Reset form to original values
  formData.value = {
    full_name: userProfile.value.full_name,
    email: userProfile.value.email,
    phone: userProfile.value.phone,
  }
  passwordData.value = {
    current: '',
    new: '',
    confirm: '',
  }
}
</script>
