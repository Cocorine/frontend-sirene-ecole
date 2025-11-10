<template>
  <Teleport to="body">
    <div
      class="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none"
      style="max-width: 100vw"
    >
      <TransitionGroup
        enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
        move-class="transition-all duration-300"
      >
        <ToastNotification
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :notification="notification"
          @close="notificationStore.removeNotification"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../../stores/notifications'
import ToastNotification from './ToastNotification.vue'

const notificationStore = useNotificationStore()
</script>
