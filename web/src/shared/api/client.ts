const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: headers || {},
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      let retryAfter: number | undefined;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.retryAfter) {
          retryAfter = errorData.retryAfter;
        }
      } catch (e) {
        // If response is not JSON, use status text
      }
      
      throw new ApiError(errorMessage, response.status, retryAfter);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      let retryAfter: number | undefined;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.retryAfter) {
          retryAfter = errorData.retryAfter;
        }
      } catch (e) {
        // If response is not JSON, use status text
      }
      
      throw new ApiError(errorMessage, response.status, retryAfter);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
