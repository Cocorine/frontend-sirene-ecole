# Guide d'utilisation des Notifications Toast

Ce guide explique comment utiliser le système de notifications toast dans l'application.

## 📋 Table des matières

- [Installation](#installation)
- [Utilisation de base](#utilisation-de-base)
- [Types de notifications](#types-de-notifications)
- [Options avancées](#options-avancées)
- [Exemples](#exemples)

---

## Installation

Le système de notifications est déjà intégré dans l'application via le composant `ToastContainer` dans `App.vue`.

## Utilisation de base

### Import

```typescript
import { useNotificationStore } from '@/stores/notifications'
```

### Dans un composant Vue

```vue
<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const handleSuccess = () => {
  notificationStore.success('Opération réussie', 'Les données ont été enregistrées')
}
</script>
```

---

## Types de notifications

Le système supporte 4 types de notifications :

### 1. Success (Succès) ✅

Pour les opérations réussies.

```typescript
notificationStore.success(
  'Titre',                    // Titre (obligatoire)
  'Message de description',   // Message (optionnel)
  5000                        // Durée en ms (optionnel, défaut: 5000)
)
```

**Exemple:**
```typescript
notificationStore.success('Utilisateur créé', 'Le nouvel utilisateur a été ajouté avec succès')
```

### 2. Error (Erreur) ❌

Pour les erreurs et les échecs.

```typescript
notificationStore.error(
  'Titre',
  'Message',
  7000  // Les erreurs restent 7 secondes par défaut
)
```

**Exemple:**
```typescript
notificationStore.error('Erreur de connexion', 'Impossible de se connecter au serveur')
```

### 3. Warning (Avertissement) ⚠️

Pour les avertissements.

```typescript
notificationStore.warning('Titre', 'Message', 5000)
```

**Exemple:**
```typescript
notificationStore.warning('Session expirée', 'Vous allez être déconnecté dans 2 minutes')
```

### 4. Info (Information) ℹ️

Pour les messages informatifs.

```typescript
notificationStore.info('Titre', 'Message', 5000)
```

**Exemple:**
```typescript
notificationStore.info('Mise à jour disponible', 'Une nouvelle version est disponible')
```

---

## Options avancées

### Durée personnalisée

```typescript
// Notification qui reste 10 secondes
notificationStore.success('Titre', 'Message', 10000)

// Notification qui ne disparaît pas automatiquement (0 = infini)
notificationStore.error('Erreur critique', 'Action requise', 0)
```

### Fermeture manuelle

Les utilisateurs peuvent toujours fermer une notification en cliquant sur le ✕

### Pause au survol

Les notifications se mettent en pause quand l'utilisateur passe la souris dessus.

### Gestion manuelle

```typescript
const notificationStore = useNotificationStore()

// Ajouter une notification et récupérer son ID
const notifId = notificationStore.addNotification(
  'success',
  'Téléchargement en cours',
  'Veuillez patienter...',
  0  // Ne pas auto-fermer
)

// Plus tard, fermer cette notification
notificationStore.removeNotification(notifId)

// Ou fermer toutes les notifications
notificationStore.clearAll()
```

---

## Exemples

### Exemple 1: Formulaire de création

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="name" placeholder="Nom" />
    <button type="submit">Créer</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
const name = ref('')

const handleSubmit = async () => {
  try {
    // Appel API
    await createUser({ name: name.value })

    // Succès
    notificationStore.success(
      'Utilisateur créé',
      `${name.value} a été ajouté avec succès`
    )

    // Réinitialiser le formulaire
    name.value = ''
  } catch (error) {
    // Erreur
    notificationStore.error(
      'Erreur',
      error.message || 'Une erreur est survenue'
    )
  }
}
</script>
```

### Exemple 2: Suppression avec confirmation

```vue
<template>
  <button @click="handleDelete">Supprimer</button>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
    return
  }

  try {
    await deleteItem(itemId)
    notificationStore.success('Supprimé', 'L\'élément a été supprimé')
  } catch (error) {
    notificationStore.error('Erreur', 'Impossible de supprimer l\'élément')
  }
}
</script>
```

### Exemple 3: Validation de formulaire

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
const email = ref('')

const validateEmail = () => {
  if (!email.value) {
    notificationStore.warning(
      'Email requis',
      'Veuillez saisir votre adresse email'
    )
    return false
  }

  if (!email.value.includes('@')) {
    notificationStore.error(
      'Email invalide',
      'L\'adresse email doit contenir un @'
    )
    return false
  }

  return true
}
</script>
```

### Exemple 4: Process long (upload, téléchargement)

```vue
<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const uploadFile = async (file: File) => {
  // Notification de démarrage (ne se ferme pas)
  const notifId = notificationStore.info(
    'Upload en cours',
    `Téléversement de ${file.name}...`,
    0  // Ne pas fermer automatiquement
  )

  try {
    await uploadToServer(file)

    // Fermer la notification de progression
    notificationStore.removeNotification(notifId)

    // Afficher le succès
    notificationStore.success(
      'Upload terminé',
      `${file.name} a été téléversé avec succès`
    )
  } catch (error) {
    // Fermer la notification de progression
    notificationStore.removeNotification(notifId)

    // Afficher l'erreur
    notificationStore.error(
      'Échec de l\'upload',
      error.message
    )
  }
}
</script>
```

### Exemple 5: Notification avec actions multiples

```vue
<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()

const saveDraft = async () => {
  try {
    await saveToDraft()
    notificationStore.info('Brouillon enregistré', 'Vos modifications sont sauvegardées')
  } catch (error) {
    notificationStore.error('Erreur', 'Impossible de sauvegarder le brouillon')
  }
}

const publish = async () => {
  try {
    await publishArticle()
    notificationStore.success(
      'Article publié',
      'Votre article est maintenant en ligne',
      7000
    )
  } catch (error) {
    notificationStore.error(
      'Erreur de publication',
      'Impossible de publier l\'article. Vérifiez votre connexion.',
      10000  // Erreur reste plus longtemps
    )
  }
}
</script>
```

### Exemple 6: Dans un store Pinia

```typescript
// stores/users.ts
import { defineStore } from 'pinia'
import { useNotificationStore } from './notifications'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      users.value = response.data
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error(
        'Erreur de chargement',
        'Impossible de charger la liste des utilisateurs'
      )
    }
  }

  const createUser = async (userData) => {
    try {
      const response = await api.post('/users', userData)
      users.value.push(response.data)

      const notificationStore = useNotificationStore()
      notificationStore.success(
        'Utilisateur créé',
        `${userData.name} a été ajouté`
      )
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error('Erreur', error.message)
      throw error
    }
  }

  return { users, fetchUsers, createUser }
})
```

---

## Bonnes pratiques

### 1. Messages clairs et concis

✅ **Bon:**
```typescript
notificationStore.success('Enregistré', 'Vos modifications ont été sauvegardées')
```

❌ **Mauvais:**
```typescript
notificationStore.success('OK', 'C\'est bon')
```

### 2. Durée appropriée

- **Success/Info**: 5 secondes (par défaut)
- **Warning**: 6-7 secondes
- **Error**: 7-10 secondes (erreurs importantes)
- **Process long**: 0 (infini) puis fermer manuellement

### 3. Ne pas abuser

```typescript
// ❌ Mauvais: Trop de notifications
notificationStore.info('Chargement...')
notificationStore.info('Traitement...')
notificationStore.info('Finalisation...')

// ✅ Bon: Une notification
notificationStore.success('Terminé', 'L\'opération est complétée')
```

### 4. Gestion des erreurs

```typescript
try {
  await operation()
  notificationStore.success('Succès', 'Opération réussie')
} catch (error) {
  // Utiliser le message d'erreur du serveur si disponible
  notificationStore.error(
    'Erreur',
    error.response?.data?.message || error.message || 'Une erreur est survenue'
  )
}
```

### 5. Feedback immédiat

```typescript
const handleClick = async () => {
  // ❌ Mauvais: Pas de feedback
  await longOperation()

  // ✅ Bon: Feedback immédiat
  const notifId = notificationStore.info('Traitement en cours...', '', 0)
  await longOperation()
  notificationStore.removeNotification(notifId)
  notificationStore.success('Terminé!')
}
```

---

## Style et personnalisation

Les notifications utilisent:
- **Success**: Vert (`border-green-500`, `text-green-500`)
- **Error**: Rouge (`border-red-500`, `text-red-500`)
- **Warning**: Orange (`border-orange-500`, `text-orange-500`)
- **Info**: Bleu (`border-blue-500`, `text-blue-500`)

Les styles sont définis dans `ToastNotification.vue` et peuvent être personnalisés selon vos besoins.
