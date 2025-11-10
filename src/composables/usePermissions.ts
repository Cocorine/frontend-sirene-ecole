import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

/**
 * Mapping des rôles vers leurs permissions
 * Chaque rôle a un ensemble de permissions définies
 *
 * Rôles disponibles :
 * - admin : Super administrateur avec toutes les permissions
 * - user : Utilisateur de base avec permissions limitées
 * - ecole : École avec gestion de ses propres données
 * - technicien : Technicien avec gestion de ses missions
 */
const rolePermissions: Record<string, string[]> = {
  admin: [
    // Toutes les permissions - Super Admin
    'view_dashboard',
    'manage_countries',
    'manage_schools',
    'view_schools',
    'manage_users',
    'view_users',
    'manage_roles',
    'view_roles',
    'manage_permissions',
    'manage_technicians',
    'view_technicians',
    'manage_siren_models',
    'manage_sirens',
    'view_sirens',
    'manage_breakdowns',
    'view_breakdowns',
    'manage_work_orders',
    'view_work_orders',
    'manage_subscriptions',
    'view_subscriptions',
    'manage_calendar',
    'view_calendar',
    'view_reports',
    'manage_settings',
    'manage_payments',
    'view_payments',
  ],
  user: [
    // Permissions utilisateur de base
    'view_dashboard',
    'view_schools',
    'view_sirens',
    'view_breakdowns',
    'view_subscriptions',
    'view_calendar',
  ],
  ecole: [
    // Permissions école
    'view_dashboard',
    'view_schools',
    'edit_own_school',
    'view_sirens',
    'manage_breakdowns',
    'view_breakdowns',
    'view_subscriptions',
    'manage_subscriptions',
    'view_calendar',
    'manage_calendar',
    'view_payments',
    'view_users',
    'manage_users',
  ],
  technicien: [
    // Permissions technicien
    'view_dashboard',
    'view_work_orders',
    'manage_own_missions',
    'view_breakdowns',
    'manage_interventions',
    'view_sirens',
  ],
}

/**
 * Composable pour gérer les permissions utilisateur
 */
export function usePermissions() {
  const authStore = useAuthStore()

  /**
   * Liste des permissions de l'utilisateur actuel
   * Les permissions sont chargées depuis l'API via /api/auth/me
   * Elles sont disponibles dans user.role.permissions
   */
  const userPermissions = computed<string[]>(() => {
    if (!authStore.user) {
      return []
    }

    // Utiliser les permissions de l'API si disponibles (user.role.permissions)
    if (authStore.user.role?.permissions && authStore.user.role.permissions.length > 0) {
      // Extraire les slugs des permissions
      return authStore.user.role.permissions.map(p => p.slug)
    }

    // Fallback sur le mapping statique si pas de permissions de l'API
    const roleSlug = authStore.user.roleSlug || authStore.user.role?.slug
    if (roleSlug) {
      return rolePermissions[roleSlug] || []
    }

    return []
  })

  /**
   * Vérifier si l'utilisateur a une permission spécifique
   */
  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }

  /**
   * Vérifier si l'utilisateur a au moins une des permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  /**
   * Vérifier si l'utilisateur a toutes les permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  const hasRole = (role: string): boolean => {
    return authStore.user?.roleSlug === role || authStore.user?.role?.slug === role
  }

  /**
   * Vérifier si l'utilisateur a au moins un des rôles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = computed<boolean>(() => {
    const roleSlug = authStore.user?.roleSlug || authStore.user?.role?.slug
    return roleSlug === 'admin'
  })

  /**
   * Vérifier si l'utilisateur de base
   */
  const isUser = computed<boolean>(() => {
    const roleSlug = authStore.user?.roleSlug || authStore.user?.role?.slug
    return roleSlug === 'user'
  })

  /**
   * Vérifier si l'utilisateur est école
   */
  const isEcole = computed<boolean>(() => {
    const roleSlug = authStore.user?.roleSlug || authStore.user?.role?.slug
    return roleSlug === 'ecole'
  })

  /**
   * Vérifier si l'utilisateur est technicien
   */
  const isTechnicien = computed<boolean>(() => {
    const roleSlug = authStore.user?.roleSlug || authStore.user?.role?.slug
    return roleSlug === 'technicien'
  })

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    isEcole,
    isTechnicien,
  }
}
