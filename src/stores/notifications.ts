import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  timestamp: number
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  let notificationId = 0

  /**
   * Ajouter une notification
   */
  const addNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    duration: number = 5000
  ): string => {
    const id = `notification-${++notificationId}-${Date.now()}`

    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now()
    }

    notifications.value.push(notification)

    // Auto-remove après la durée spécifiée
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  /**
   * Retirer une notification
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Méthodes raccourcies pour chaque type
   */
  const success = (title: string, message?: string, duration?: number) => {
    return addNotification('success', title, message, duration)
  }

  const error = (title: string, message?: string, duration?: number) => {
    return addNotification('error', title, message, duration || 7000) // Erreurs restent plus longtemps
  }

  const warning = (title: string, message?: string, duration?: number) => {
    return addNotification('warning', title, message, duration)
  }

  const info = (title: string, message?: string, duration?: number) => {
    return addNotification('info', title, message, duration)
  }

  /**
   * Nettoyer toutes les notifications
   */
  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  }
})
