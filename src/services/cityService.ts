import apiClient from './api'
import type { ApiResponse, ApiVille } from '@/types/api'

/**
 * Service pour la gestion des villes
 * Centralise tous les appels API liés aux villes
 */
class CityService {
  private readonly basePath = '/villes'

  /**
   * Récupérer la liste de toutes les villes
   */
  async getAllCities(params?: {
    page?: number
    per_page?: number
    search?: string
  }): Promise<ApiResponse<{ data: ApiVille[], pagination: ApiPagination }>> {
    const response = await apiClient.get<ApiResponse<{ data: ApiVille[], pagination: ApiPagination }>>(this.basePath, {
      params: { ...params, per_page: params?.per_page || 1000 },
    })
    return response.data
  }
}

// Export une instance unique du service
export default new CityService()
