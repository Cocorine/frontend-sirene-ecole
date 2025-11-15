import apiClient from './api'

export interface Permission {
  id: string
  slug: string
  nom: string
  description?: string
  created_at?: string
}

export interface Role {
  id: string
  slug: string
  nom: string
  description?: string
  permissions: Permission[]
  users_count?: number
  created_at?: string
  updated_at?: string
}

export interface CreateRoleData {
  nom: string
  slug: string
  description?: string
}

export interface UpdateRoleData {
  nom?: string
  slug?: string
  description?: string
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{ url: string | null; label: string; active: boolean }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

/**
 * Role Service
 * Handles all role-related API calls
 */
class RoleService {
  /**
   * Get all roles with pagination
   */
  async getRoles(page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<Role>>> {
    const response = await apiClient.get('/roles', {
      params: { page, per_page: perPage }
    })
    return response.data
  }

  /**
   * Get all roles without pagination (for backward compatibility)
   */
  async getAllRoles(): Promise<ApiResponse<Role[]>> {
    const response = await apiClient.get('/roles', {
      params: { per_page: 1000 } // Get a large number to simulate "all"
    })
    // Extract roles from paginated response
    if (response.data.success && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data.data // Extract roles array from pagination
      }
    }
    return response.data
  }

  /**
   * Get a specific role by ID
   */
  async getRole(id: string): Promise<ApiResponse<Role>> {
    const response = await apiClient.get(`/roles/${id}`)
    return response.data
  }

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleData): Promise<ApiResponse<Role>> {
    const response = await apiClient.post('/roles', data)
    return response.data
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, data: UpdateRoleData): Promise<ApiResponse<Role>> {
    const response = await apiClient.put(`/roles/${id}`, data)
    return response.data
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/roles/${id}`)

    // Handle 204 No Content response
    if (response.status === 204) {
      return {
        success: true,
        message: 'Rôle supprimé avec succès'
      }
    }

    return response.data
  }

  /**
   * Assign permissions to a role
   */
  async assignPermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<Role>> {
    const response = await apiClient.post(`/roles/${roleId}/permissions/assign`, {
      permission_ids: permissionIds
    })
    return response.data
  }

  /**
   * Remove permissions from a role
   */
  async removePermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<Role>> {
    const response = await apiClient.post(`/roles/${roleId}/permissions/remove`, {
      permission_ids: permissionIds
    })
    return response.data
  }

  /**
   * Sync permissions for a role (replace all permissions)
   */
  async syncPermissions(roleId: string, permissionIds: string[]): Promise<ApiResponse<Role>> {
    const response = await apiClient.post(`/roles/${roleId}/permissions/sync`, {
      permission_ids: permissionIds
    })
    return response.data
  }

  /**
   * Get all available permissions with pagination support
   */
  async getPermissions(page: number = 1, perPage: number = 15): Promise<ApiResponse<PaginatedResponse<Permission> | Permission[]>> {
    const response = await apiClient.get('/permissions', {
      params: { page, per_page: perPage }
    })
    return response.data
  }

  /**
   * Get all permissions (loads all pages automatically)
   */
  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      // First request to get total pages
      const firstPage = await apiClient.get('/permissions', {
        params: { page: 1, per_page: 50 }
      })

      const firstPageData = firstPage.data

      // Check if response is paginated
      if (firstPageData.success && firstPageData.data?.data && firstPageData.data?.last_page) {
        const paginatedData = firstPageData.data as PaginatedResponse<Permission>
        let allPermissions = [...paginatedData.data]

        // If there are more pages, load them all in parallel
        if (paginatedData.last_page > 1) {
          const remainingPages = Array.from(
            { length: paginatedData.last_page - 1 },
            (_, i) => i + 2
          )

          const remainingRequests = remainingPages.map(page =>
            apiClient.get('/permissions', {
              params: { page, per_page: 50 }
            })
          )

          const remainingResponses = await Promise.all(remainingRequests)

          remainingResponses.forEach(response => {
            if (response.data.success && response.data.data?.data) {
              allPermissions = [...allPermissions, ...response.data.data.data]
            }
          })
        }

        return {
          success: true,
          message: firstPageData.message,
          data: allPermissions
        }
      }

      // If not paginated, return as is
      if (firstPageData.success && Array.isArray(firstPageData.data)) {
        return {
          success: true,
          message: firstPageData.message,
          data: firstPageData.data
        }
      }

      return firstPageData
    } catch (error) {
      throw error
    }
  }
}

export default new RoleService()
