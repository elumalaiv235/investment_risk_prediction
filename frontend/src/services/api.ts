const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customOptions } = options;

  const token = localStorage.getItem('riskwise_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  const config: RequestInit = {
    ...customOptions,
    headers,
    credentials: 'include', // sends cookies
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new ApiError(
      result.message || `Request failed with status ${response.status}`,
      response.status,
      result.errors
    );
  }

  return result.data !== undefined ? result.data : result;
}

// Full typed API surface
export const api = {
  // Auth API
  auth: {
    register: (data: any) => request<any>('/auth/register', { method: 'POST', data }),
    login: (data: any) => request<any>('/auth/login', { method: 'POST', data }),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
    me: () => request<any>('/auth/me', { method: 'GET' }),
    forgotPassword: (data: any) => request<any>('/auth/forgot-password', { method: 'POST', data }),
    resetPassword: (data: any) => request<any>('/auth/reset-password', { method: 'POST', data }),
  },

  // Profile API
  profile: {
    get: () => request<any>('/profile', { method: 'GET' }),
    update: (data: any) => request<any>('/profile', { method: 'PUT', data }),
  },

  // Risk Prediction API
  risk: {
    predict: (data: any) => request<any>('/risk/predict', { method: 'POST', data }),
    getHistory: (params: Record<string, any> = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const query = searchParams.toString();
      return request<any>(`/risk/history${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    getById: (id: string) => request<any>(`/risk/${id}`, { method: 'GET' }),
    deleteById: (id: string) => request<any>(`/risk/${id}`, { method: 'DELETE' }),
  },

  // Dashboard API
  dashboard: {
    getSummary: () => request<any>('/dashboard/summary', { method: 'GET' }),
  },

  // Admin API
  admin: {
    getStats: () => request<any>('/admin/stats', { method: 'GET' }),
    getUsers: (page = 1, limit = 20) =>
      request<any>(`/admin/users?page=${page}&limit=${limit}`, { method: 'GET' }),
    updateUserRole: (userId: string, role: string) =>
      request<any>(`/admin/users/${userId}/role`, { method: 'PUT', data: { role } }),
  },
};
