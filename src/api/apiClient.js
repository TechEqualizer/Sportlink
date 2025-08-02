// Real API client for backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Generic CRUD methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new APIClient();

// Athletes API
export const Athlete = {
  async list(sortOption = "-updated_date") {
    const sortMap = {
      "-updated_date": { sortBy: "updated_at", sortOrder: "DESC" },
      "-created_date": { sortBy: "created_at", sortOrder: "DESC" },
      "name": { sortBy: "name", sortOrder: "ASC" },
      "-name": { sortBy: "name", sortOrder: "DESC" },
      "-gpa": { sortBy: "gpa", sortOrder: "DESC" }
    };

    const sort = sortMap[sortOption] || sortMap["-updated_date"];
    const params = new URLSearchParams(sort);
    
    const response = await apiClient.get(`/athletes?${params}`);
    return response.data;
  },

  async filter(query = {}, sortOption = "-updated_date", limit = 25, offset = 0) {
    const sortMap = {
      "-updated_date": { sortBy: "updated_at", sortOrder: "DESC" },
      "name": { sortBy: "name", sortOrder: "ASC" },
      "-name": { sortBy: "name", sortOrder: "DESC" },
      "-gpa": { sortBy: "gpa", sortOrder: "DESC" }
    };

    const sort = sortMap[sortOption] || sortMap["-updated_date"];
    const params = new URLSearchParams({
      ...sort,
      limit: limit.toString(),
      page: Math.floor(offset / limit) + 1
    });

    // Add filters
    if (query.class_year) params.append('class_year', query.class_year);
    if (query.recruiting_status) params.append('recruiting_status', query.recruiting_status);
    if (query.sport_type) params.append('sport_type', query.sport_type);
    if (query.name?.contains) params.append('name', query.name.contains);
    if (query.gpa?.gte) params.append('minGpa', query.gpa.gte.toString());

    const response = await apiClient.get(`/athletes?${params}`);
    return {
      data: response.data,
      total: response.pagination.total
    };
  },

  async findById(id) {
    const response = await apiClient.get(`/athletes/${id}`);
    return response.data;
  },

  async create(athleteData) {
    const response = await apiClient.post('/athletes', athleteData);
    return response.data;
  },

  async update(id, athleteData) {
    const response = await apiClient.put(`/athletes/${id}`, athleteData);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/athletes/${id}`);
    return response;
  },

  async search(query, limit = 10) {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const response = await apiClient.get(`/athletes/search?${params}`);
    return response.data;
  }
};

// Videos API
export const Video = {
  async filter(query = {}, sortOption = "-created_date") {
    const params = new URLSearchParams({
      sortBy: "created_at",
      sortOrder: "DESC"
    });

    // Add filters
    if (query.athlete_id) params.append('athlete_id', query.athlete_id.toString());
    if (query.category && query.category !== 'all') params.append('category', query.category);
    if (query.source) params.append('source', query.source);

    const response = await apiClient.get(`/videos?${params}`);
    return response.data;
  },

  async create(videoData) {
    const response = await apiClient.post('/videos', videoData);
    return response.data;
  },

  async update(id, videoData) {
    const response = await apiClient.put(`/videos/${id}`, videoData);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/videos/${id}`);
    return response;
  },

  async findById(id) {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },

  async incrementViews(id) {
    const response = await apiClient.post(`/videos/${id}/view`);
    return response.data;
  },

  async getFeatured(limit = 10) {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await apiClient.get(`/videos/featured?${params}`);
    return response.data;
  }
};

// Teams API
export const Team = {
  async list() {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  async findById(id) {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  },

  async create(teamData) {
    const response = await apiClient.post('/teams', teamData);
    return response.data;
  },

  async update(id, teamData) {
    const response = await apiClient.put(`/teams/${id}`, teamData);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/teams/${id}`);
    return response;
  },

  async getAthletes(id) {
    const response = await apiClient.get(`/teams/${id}/athletes`);
    return response.data;
  }
};

export default apiClient;