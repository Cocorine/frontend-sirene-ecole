<template>
  <slot v-if="!hasAccess" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '../../composables/usePermissions'

interface Props {
  permission?: string
  permissions?: string[]
  role?: string
  roles?: string[]
  requireAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
})

const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole } = usePermissions()

/**
 * Vérifier si l'utilisateur n'a PAS accès (inverse de Can)
 */
const hasAccess = computed<boolean>(() => {
  if (props.permission) {
    return hasPermission(props.permission)
  }

  if (props.permissions && props.permissions.length > 0) {
    return props.requireAll
      ? hasAllPermissions(props.permissions)
      : hasAnyPermission(props.permissions)
  }

  if (props.role) {
    return hasRole(props.role)
  }

  if (props.roles && props.roles.length > 0) {
    return hasAnyRole(props.roles)
  }

  return false
})
</script>
