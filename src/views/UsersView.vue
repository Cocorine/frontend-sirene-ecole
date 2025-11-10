<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p class="text-gray-600 mt-1">Gérer les comptes utilisateurs</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
          <Plus :size="20" />
          Nouvel utilisateur
        </button>
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

      <!-- Search and Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              v-model="searchTerm"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            v-model="filterRole"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="country_admin">Admin Pays</option>
            <option value="school_admin">Admin École</option>
            <option value="technician">Technicien</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date création</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">
                      {{ user.full_name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ user.full_name }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900">{{ user.email }}</p>
                <p class="text-sm text-gray-600">{{ user.phone }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user.role]}`">
                  {{ roleLabels[user.role] }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Actif
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Modifier
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Users :size="64" class="text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
        <p class="text-gray-600">Aucun utilisateur ne correspond à vos critères</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Users, Plus, Search } from 'lucide-vue-next'

const searchTerm = ref('')
const filterRole = ref('all')

const users = ref([
  {
    id: '1',
    full_name: 'Admin Principal',
    email: 'admin@demo.com',
    phone: '+22670000001',
    role: 'super_admin',
    status: 'active',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    full_name: 'Admin Burkina Faso',
    email: 'admin.bf@demo.com',
    phone: '+22670000002',
    role: 'country_admin',
    status: 'active',
    created_at: '2024-02-10',
  },
  {
    id: '3',
    full_name: 'Directeur École Wemtenga',
    email: 'dir.wemtenga@demo.com',
    phone: '+22670000003',
    role: 'school_admin',
    status: 'active',
    created_at: '2024-03-05',
  },
  {
    id: '4',
    full_name: 'Jean Ouédraogo',
    email: 'jean.tech@demo.com',
    phone: '+22670000004',
    role: 'technician',
    status: 'active',
    created_at: '2024-04-12',
  },
])

const roleColors: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  country_admin: 'bg-orange-100 text-orange-700',
  school_admin: 'bg-blue-100 text-blue-700',
  technician: 'bg-green-100 text-green-700',
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  country_admin: 'Admin Pays',
  school_admin: 'Admin École',
  technician: 'Technicien',
}

const stats = computed(() => [
  { label: 'Total', count: users.value.length, color: 'from-blue-500 to-blue-600' },
  { label: 'Admins', count: users.value.filter(u => u.role.includes('admin')).length, color: 'from-orange-500 to-orange-600' },
  { label: 'Techniciens', count: users.value.filter(u => u.role === 'technician').length, color: 'from-green-500 to-green-600' },
  { label: 'Actifs', count: users.value.filter(u => u.status === 'active').length, color: 'from-cyan-500 to-cyan-600' },
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesRole = filterRole.value === 'all' || user.role === filterRole.value
    return matchesSearch && matchesRole
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>
