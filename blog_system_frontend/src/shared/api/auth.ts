import { apiClient } from './client';
import { API_ENDPOINTS } from '../config/api';
import { MOCK_API } from '../config/env';
import { mockAuthService } from '../../mocks/services';
import type { UserRequest, AccessTokenResponse, LoginFormData } from '../types';

export const authApi = {
  register: async (data: UserRequest): Promise<AccessTokenResponse> => {
    if (MOCK_API) {
      return mockAuthService.register();
    }
    const response = await apiClient.post<AccessTokenResponse>(API_ENDPOINTS.auth.register, data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AccessTokenResponse> => {
    if (MOCK_API) {
      return mockAuthService.login();
    }
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await apiClient.post<AccessTokenResponse>(API_ENDPOINTS.auth.login, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};
