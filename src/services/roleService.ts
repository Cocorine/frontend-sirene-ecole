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
   * Get all roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await apiClient.get('/roles')
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
   * Get all available permissions
   */
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await apiClient.get('/permissions')
    return response.data
  }
}

export default new RoleService()
