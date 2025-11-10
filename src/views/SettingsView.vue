<template>
  <DashboardLayout>
    <div class="p-6 space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p class="text-gray-600 mt-1">Configuration du système</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-left transition-colors"
          >
            <component :is="item.icon" :size="20" class="text-gray-600" />
            <span class="font-semibold text-gray-900">{{ item.label }}</span>
          </button>
        </div>

        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Paramètres généraux</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Nom de l'application
              </label>
              <input
                type="text"
                value="Sirène d'École"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Email de contact
              </label>
              <input
                type="email"
                value="contact@sirenedecole.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Fuseau horaire par défaut
              </label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="Africa/Ouagadougou">Africa/Ouagadougou</option>
                <option value="Africa/Abidjan">Africa/Abidjan</option>
                <option value="Africa/Dakar">Africa/Dakar</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                Langue par défaut
              </label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <div class="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p class="font-semibold text-gray-900">Mode maintenance</p>
                <p class="text-sm text-gray-600">Désactiver temporairement l'application</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div class="pt-4">
              <button class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import { Settings, Bell, Mail, Phone, DollarSign, Database } from 'lucide-vue-next'

const menuItems = ref([
  { id: 'general', label: 'Général', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'sms', label: 'SMS', icon: Phone },
  { id: 'payment', label: 'Paiements', icon: DollarSign },
  { id: 'database', label: 'Base de données', icon: Database },
])
</script>
