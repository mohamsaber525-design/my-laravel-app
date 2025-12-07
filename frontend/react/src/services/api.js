// src/services/api.js
import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Instance Axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== TRIPS ==========

export const tripsAPI = {
  // Récupérer tous les trips
  getAll: async (filters = {}) => {
    const response = await api.get('/trips', { params: filters });
    return response.data;
  },

  // Récupérer un trip par ID
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Créer un nouveau trip (Admin)
  create: async (tripData) => {
    const response = await api.post('/admin/trips', tripData);
    return response.data;
  },

  // Mettre à jour un trip (Admin)
  update: async (id, tripData) => {
    const response = await api.post(`/admin/trips/${id}?_method=PUT`, tripData);
    return response.data;
  },

  // Supprimer un trip (Admin)
  delete: async (id) => {
    const response = await api.delete(`/admin/trips/${id}`);
    return response.data;
  },

  // Rechercher des trips
  search: async (query) => {
    const response = await api.get('/trips/search', { params: { q: query } });
    return response.data;
  },
};

export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};

// Alias pour compatibilité
export const voyagesAPI = tripsAPI;

// ========== RÉSERVATIONS ==========

export const reservationsAPI = {
  // Récupérer les réservations de l'utilisateur
  getMyReservations: async () => {
    const response = await api.get('/reservations/me');
    return response.data;
  },

  // Récupérer une réservation par ID
  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  // Créer une nouvelle réservation
  create: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  // Annuler une réservation
  cancel: async (id) => {
    const response = await api.put(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Mettre à jour une réservation
  update: async (id, reservationData) => {
    const response = await api.put(`/reservations/${id}`, reservationData);
    return response.data;
  },

  // Admin - Récupérer toutes les réservations
  getAll: async () => {
    const response = await api.get('/admin/reservations');
    return response.data;
  },

  // Admin - Mettre à jour le statut
  updateStatus: async (id, status) => {
    const response = await api.put(`/admin/reservations/${id}`, { status });
    return response.data;
  },
};

// ========== AUTHENTIFICATION ==========

export const authAPI = {
  // Connexion
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Inscription
  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response.data;
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Récupérer les données utilisateur du localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ========== UTILISATEURS ==========

export const usersAPI = {
  // Récupérer le profil
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },

  // Récupérer tous les utilisateurs (Admin)
  getAll: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

// ========== AVIS ==========

export const reviewsAPI = {
  // Récupérer tous les avis
  getAll: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  // Créer un avis
  create: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
};

// ========== PAIEMENTS ==========

export const paymentsAPI = {
  // Créer un paiement
  create: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Vérifier le statut d'un paiement
  checkStatus: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/status`);
    return response.data;
  },
};

// ========== STATISTIQUES ==========

export const statsAPI = {
  // Récupérer les statistiques utilisateur
  getUserStats: async () => {
    const response = await api.get('/stats/user');
    return response.data;
  },

  // Récupérer les statistiques générales (Admin)
  getGeneralStats: async () => {
    const response = await api.get('/stats/general');
    return response.data;
  },

  // Récupérer les statistiques du dashboard (Admin)
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// Exporter l'instance axios pour des appels personnalisés
export default api;