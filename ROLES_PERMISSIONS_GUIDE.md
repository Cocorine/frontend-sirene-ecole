# Guide du système de Rôles et Permissions

Ce guide explique comment utiliser le système de gestion des rôles et permissions dans l'application.

## 📋 Table des matières

- [Architecture](#architecture)
- [Interface de gestion](#interface-de-gestion)
- [Utilisation dans le code](#utilisation-dans-le-code)
- [API Services](#api-services)
- [Composants](#composants)
- [Exemples](#exemples)

---

## Architecture

### Structure des données

```typescript
interface Permission {
  id: string
  slug: string          // Identifiant unique (ex: "manage_users")
  nom: string          // Nom lisible (ex: "Gérer les utilisateurs")
  description?: string // Description détaillée
}

interface Role {
  id: string
  slug: string          // Identifiant unique (ex: "admin")
  nom: string          // Nom lisible (ex: "Administrateur")
  description?: string // Description du rôle
  permissions: Permission[]  // Liste des permissions attribuées
  users_count?: number      // Nombre d'utilisateurs ayant ce rôle
}
```

### Rôles de base

L'application utilise 4 rôles principaux :

1. **Admin** (`admin`)
   - Accès complet à toutes les fonctionnalités
   - Gestion des pays, écoles, utilisateurs, rôles, techniciens
   - Couleur : Rouge

2. **User** (`user`)
   - Utilisateur de base avec permissions limitées
   - Visualisation uniquement
   - Couleur : Gris

3. **École** (`ecole`)
   - Gestion de sa propre école
   - Signalement de pannes, gestion d'abonnements
   - Couleur : Bleu

4. **Technicien** (`technicien`)
   - Gestion des interventions et ordres de mission
   - Couleur : Vert

---

## Interface de gestion

### Vue Rôles (`/roles`)

#### Fonctionnalités principales

1. **Liste des rôles**
   - Affichage en grille avec cartes colorées
   - Nombre d'utilisateurs par rôle
   - Aperçu des permissions (5 premières + compteur)

2. **Créer un rôle**
   - Bouton "Créer un rôle" (visible uniquement avec permission `manage_roles`)
   - Modal avec formulaire :
     - Nom du rôle (requis)
     - Slug (auto-généré depuis le nom, modifiable)
     - Description (optionnel)

3. **Modifier un rôle**
   - Bouton "Modifier" sur chaque carte
   - Même formulaire que la création

4. **Gérer les permissions**
   - Bouton "Permissions" sur chaque carte
   - Modal avec :
     - Liste de toutes les permissions disponibles
     - Recherche par nom/slug/description
     - Sélection multiple avec checkboxes
     - Bouton "Tout sélectionner/désélectionner"
     - Compteur de permissions sélectionnées

5. **Supprimer un rôle**
   - Bouton icône poubelle
   - Confirmation obligatoire

---

## Utilisation dans le code

### 1. Composable `usePermissions`

```typescript
import { usePermissions } from '@/composables/usePermissions'

const {
  userPermissions,      // Liste des permissions de l'utilisateur
  hasPermission,        // Vérifie une permission
  hasAnyPermission,     // Vérifie au moins une permission
  hasAllPermissions,    // Vérifie toutes les permissions
  hasRole,              // Vérifie un rôle
  hasAnyRole,           // Vérifie au moins un rôle
  isAdmin,              // Computed: utilisateur est admin
  isUser,               // Computed: utilisateur est user
  isEcole,              // Computed: utilisateur est école
  isTechnicien,         // Computed: utilisateur est technicien
} = usePermissions()
```

#### Exemples d'utilisation

```typescript
// Vérifier une permission
if (hasPermission('manage_users')) {
  // Afficher le bouton de gestion des utilisateurs
}

// Vérifier plusieurs permissions (OU logique)
if (hasAnyPermission(['manage_users', 'view_users'])) {
  // L'utilisateur a au moins une de ces permissions
}

// Vérifier plusieurs permissions (ET logique)
if (hasAllPermissions(['manage_users', 'manage_roles'])) {
  // L'utilisateur a toutes ces permissions
}

// Vérifier un rôle
if (hasRole('admin')) {
  // L'utilisateur est admin
}

// Utiliser les computed
if (isAdmin.value) {
  // L'utilisateur est admin
}
```

### 2. Composant `<Can>`

Affiche du contenu conditionnellement selon les permissions.

```vue
<template>
  <!-- Par permission -->
  <Can permission="manage_users">
    <button>Gérer les utilisateurs</button>
  </Can>

  <!-- Par rôle -->
  <Can role="admin">
    <div>Contenu admin uniquement</div>
  </Can>

  <!-- Plusieurs rôles (OU logique) -->
  <Can :roles="['admin', 'ecole']">
    <div>Contenu pour admin ou école</div>
  </Can>

  <!-- Plusieurs permissions (OU logique) -->
  <Can :permissions="['manage_users', 'view_users']">
    <div>Contenu si au moins une permission</div>
  </Can>
</template>

<script setup lang="ts">
import Can from '@/components/permissions/Can.vue'
</script>
```

### 3. Composant `<Cannot>`

Inverse de `<Can>` - affiche si l'utilisateur N'A PAS la permission.

```vue
<template>
  <Cannot permission="manage_users">
    <p>Vous n'avez pas la permission de gérer les utilisateurs</p>
  </Cannot>
</template>

<script setup lang="ts">
import Cannot from '@/components/permissions/Cannot.vue'
</script>
```

---

## API Services

### RoleService

Service pour interagir avec l'API des rôles.

```typescript
import roleService from '@/services/roleService'

// Récupérer tous les rôles
const response = await roleService.getRoles()
// response.data: Role[]

// Récupérer un rôle spécifique
const response = await roleService.getRole(roleId)
// response.data: Role

// Créer un rôle
const response = await roleService.createRole({
  nom: 'Superviseur',
  slug: 'superviseur',
  description: 'Supervise les opérations'
})
// response.data: Role

// Mettre à jour un rôle
const response = await roleService.updateRole(roleId, {
  nom: 'Super Superviseur'
})
// response.data: Role

// Supprimer un rôle
await roleService.deleteRole(roleId)

// Assigner des permissions (ajoute aux existantes)
const response = await roleService.assignPermissions(roleId, [permId1, permId2])
// response.data: Role avec permissions mises à jour

// Retirer des permissions
const response = await roleService.removePermissions(roleId, [permId1, permId2])
// response.data: Role avec permissions mises à jour

// Synchroniser les permissions (remplace toutes les permissions)
const response = await roleService.syncPermissions(roleId, [permId1, permId2, permId3])
// response.data: Role avec permissions mises à jour

// Récupérer toutes les permissions disponibles
const response = await roleService.getPermissions()
// response.data: Permission[]
```

---

## Composants

### RoleFormModal

Modal pour créer ou modifier un rôle.

```vue
<template>
  <RoleFormModal
    :is-open="isOpen"
    :role="roleToEdit"  <!-- null pour création, Role pour édition -->
    @close="handleClose"
    @created="handleRoleCreated"
    @updated="handleRoleUpdated"
  />
</template>

<script setup lang="ts">
import RoleFormModal from '@/components/roles/RoleFormModal.vue'
import type { Role } from '@/services/roleService'

const isOpen = ref(false)
const roleToEdit = ref<Role | null>(null)

const handleRoleCreated = (role: Role) => {
  console.log('Nouveau rôle créé:', role)
  // Actualiser la liste, etc.
}

const handleRoleUpdated = (role: Role) => {
  console.log('Rôle mis à jour:', role)
  // Actualiser la liste, etc.
}
</script>
```

### RolePermissionsModal

Modal pour gérer les permissions d'un rôle.

```vue
<template>
  <RolePermissionsModal
    :is-open="isOpen"
    :role="selectedRole"
    @close="handleClose"
    @updated="handlePermissionsUpdated"
  />
</template>

<script setup lang="ts">
import RolePermissionsModal from '@/components/roles/RolePermissionsModal.vue'
import type { Role } from '@/services/roleService'

const isOpen = ref(false)
const selectedRole = ref<Role | null>(null)

const handlePermissionsUpdated = () => {
  console.log('Permissions mises à jour')
  // Recharger les données
}
</script>
```

---

## Exemples

### Exemple 1: Bouton conditionnel selon permission

```vue
<template>
  <div class="actions">
    <Can permission="manage_users">
      <button @click="createUser">
        Créer un utilisateur
      </button>
    </Can>

    <Cannot permission="manage_users">
      <p class="text-gray-500">
        Vous n'avez pas la permission de créer des utilisateurs
      </p>
    </Cannot>
  </div>
</template>

<script setup lang="ts">
import Can from '@/components/permissions/Can.vue'
import Cannot from '@/components/permissions/Cannot.vue'

const createUser = () => {
  // Logique de création
}
</script>
```

### Exemple 2: Navigation conditionnelle

```vue
<template>
  <nav>
    <router-link to="/dashboard">Dashboard</router-link>

    <Can permission="view_users">
      <router-link to="/users">Utilisateurs</router-link>
    </Can>

    <Can permission="manage_roles">
      <router-link to="/roles">Rôles & Permissions</router-link>
    </Can>

    <Can role="admin">
      <router-link to="/settings">Paramètres</router-link>
    </Can>
  </nav>
</template>
```

### Exemple 3: Vérification programmatique

```vue
<template>
  <div>
    <h1>Mon École</h1>
    <button @click="handleEdit">Modifier</button>
  </div>
</template>

<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'
import { useNotificationStore } from '@/stores/notifications'

const { hasPermission } = usePermissions()
const notificationStore = useNotificationStore()

const handleEdit = () => {
  if (!hasPermission('edit_own_school')) {
    notificationStore.warning(
      'Permission refusée',
      'Vous n\'avez pas la permission de modifier cette école'
    )
    return
  }

  // Logique d'édition
}
</script>
```

### Exemple 4: Différentes actions selon le rôle

```vue
<template>
  <div>
    <h1>Écoles</h1>

    <Can role="admin">
      <button @click="manageAllSchools">
        Gérer toutes les écoles
      </button>
    </Can>

    <Can role="ecole">
      <button @click="manageMySchool">
        Gérer mon école
      </button>
    </Can>

    <Can :roles="['admin', 'user']">
      <button @click="viewSchools">
        Voir les écoles
      </button>
    </Can>
  </div>
</template>

<script setup lang="ts">
const manageAllSchools = () => {
  // Admin peut tout gérer
}

const manageMySchool = () => {
  // École gère seulement la sienne
}

const viewSchools = () => {
  // Admin et User peuvent voir
}
</script>
```

### Exemple 5: Protection de route

```typescript
// router/index.ts
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Vérifier si la route nécessite une permission
  const requiredPermission = to.meta.permission as string | undefined

  if (requiredPermission) {
    const userPermissions = authStore.user?.role?.permissions?.map(p => p.slug) || []

    if (!userPermissions.includes(requiredPermission)) {
      // Rediriger si pas la permission
      return next('/unauthorized')
    }
  }

  next()
})

// Définition de route
{
  path: '/roles',
  name: 'Roles',
  component: () => import('@/views/RolesView.vue'),
  meta: {
    requiresAuth: true,
    permission: 'manage_roles'
  }
}
```

### Exemple 6: Gestion avancée des permissions

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission, hasAnyPermission, isAdmin } = usePermissions()

// Permissions complexes
const canManageUsers = computed(() => {
  return isAdmin.value || hasPermission('manage_users')
})

const canViewReports = computed(() => {
  return hasAnyPermission([
    'view_reports',
    'manage_reports',
    'view_all_reports'
  ])
})

const canEditSchool = computed(() => {
  // Admin peut éditer toutes les écoles
  // École peut éditer seulement la sienne
  return isAdmin.value || hasPermission('edit_own_school')
})

// Utilisation
const handleAction = () => {
  if (canManageUsers.value) {
    // Action pour utilisateurs
  } else if (canViewReports.value) {
    // Action pour rapports
  } else {
    // Action par défaut
  }
}
</script>
```

---

## Bonnes pratiques

### 1. Nommage des permissions

✅ **Bon:**
```typescript
'manage_users'      // Action + ressource
'view_schools'      // Action + ressource
'edit_own_school'   // Action + spécificité + ressource
```

❌ **Mauvais:**
```typescript
'users'             // Pas clair
'can_see_schools'   // Verbeux
'MANAGE_USERS'      // Pas de majuscules dans les slugs
```

### 2. Granularité des permissions

```typescript
// Bonne granularité
'view_users'        // Voir la liste
'create_users'      // Créer
'edit_users'        // Modifier
'delete_users'      // Supprimer
'manage_users'      // Toutes les actions ci-dessus

// Alternative: permissions composites
if (hasAnyPermission(['edit_users', 'manage_users'])) {
  // Peut modifier
}
```

### 3. Vérification côté serveur

⚠️ **IMPORTANT:** Les vérifications frontend sont pour l'UX uniquement. Toujours vérifier les permissions côté backend !

```typescript
// Frontend: Cache les boutons, améliore l'UX
<Can permission="delete_users">
  <button @click="deleteUser">Supprimer</button>
</Can>

// Backend: Sécurité réelle
// Laravel Gate/Policy vérifie à nouveau
```

### 4. Messages d'erreur clairs

```typescript
if (!hasPermission('manage_users')) {
  notificationStore.warning(
    'Accès refusé',
    'Vous n\'avez pas la permission de gérer les utilisateurs. Contactez un administrateur.'
  )
  return
}
```

### 5. Éviter la duplication

```typescript
// ❌ Mauvais: Duplication
const canEdit = hasPermission('manage_schools') || hasPermission('edit_own_school')
const canDelete = hasPermission('manage_schools') || hasPermission('delete_own_school')

// ✅ Bon: Utiliser hasAnyPermission
const canEdit = hasAnyPermission(['manage_schools', 'edit_own_school'])
const canDelete = hasAnyPermission(['manage_schools', 'delete_own_school'])

// ✅ Encore mieux: Computed properties réutilisables
const canManageSchools = computed(() => hasPermission('manage_schools'))
const canEditOwnSchool = computed(() => canManageSchools.value || hasPermission('edit_own_school'))
```

---

## Dépannage

### Les permissions ne s'affichent pas

1. Vérifier que l'utilisateur est authentifié
2. Vérifier que `/api/auth/me` retourne bien `user.role.permissions`
3. Vérifier dans la console: `authStore.user?.role?.permissions`

### Le bouton "Créer un rôle" n'apparaît pas

Vérifier que l'utilisateur a la permission `manage_roles`:
```javascript
console.log(authStore.user?.role?.permissions?.map(p => p.slug))
```

### Erreur lors de la synchronisation des permissions

Vérifier que:
1. Le backend retourne bien un tableau de Permission avec `id`, `slug`, `nom`
2. Les IDs des permissions envoyées existent dans la base de données
3. L'utilisateur a la permission `manage_roles`

---

## Ressources

- **Composable**: `src/composables/usePermissions.ts`
- **Service**: `src/services/roleService.ts`
- **Composants**:
  - `src/components/permissions/Can.vue`
  - `src/components/permissions/Cannot.vue`
  - `src/components/roles/RoleFormModal.vue`
  - `src/components/roles/RolePermissionsModal.vue`
- **Vue**: `src/views/RolesView.vue`
- **Store**: `src/stores/auth.ts` (contient `user.role.permissions`)
