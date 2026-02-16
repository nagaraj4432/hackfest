import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Create axios instance with token interceptor
const apiClient = axios.create({
  baseURL: API_BASE
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  // Auth
  register: (data) => apiClient.post(`/auth/register`, data),
  login: (email, password) => apiClient.post(`/auth/login`, { email, password }),
  getProfile: () => apiClient.get(`/auth/profile`),

  // Activity
  logActivity: (data) => apiClient.post(`/activity/log`, data),
  getActivities: (params) => apiClient.get(`/activity/all`, { params }),
  getActivityByDate: (date) => apiClient.get(`/activity/date/${date}`),
  getWeeklyDashboard: () => apiClient.get(`/activity/dashboard/weekly`),
  deleteActivity: (id) => apiClient.delete(`/activity/${id}`),

  // Goals
  setWeeklyGoals: (data) => apiClient.post(`/goals/set`, data),
  getWeeklyGoals: () => apiClient.get(`/goals/current`),
  getGoalProgress: () => apiClient.get(`/goals/progress`),

  // Admin
  getAllStudents: (params) => apiClient.get(`/admin/students`, { params }),
  getStudentProfile: (studentId) => apiClient.get(`/admin/student/${studentId}`),
  getDashboardStats: () => apiClient.get(`/admin/dashboard`),
  createAnnouncement: (data) => apiClient.post(`/admin/announcement`, data),
  getAnnouncements: () => apiClient.get(`/admin/announcements`),
  exportStudentReport: () => apiClient.get(`/admin/export/report`, { responseType: 'blob' }),

  // Settings
  updateProfile: (data) => apiClient.put(`/settings/profile`, data),
  updateEmail: (data) => apiClient.put(`/settings/email`, data),
  verifyEmailOTP: (data) => apiClient.post(`/settings/email/verify`, data),
  changePassword: (data) => apiClient.post(`/settings/password`, data),
  getNotifications: () => apiClient.get(`/settings/notifications`),
  markNotificationAsRead: (id) => apiClient.put(`/settings/notifications/${id}/read`),
  getNotificationCount: () => apiClient.get(`/settings/notifications/count`),
  enableEmailNotifications: (data) => apiClient.put(`/settings/notifications/email`, data),
  getTwoFactorStatus: () => apiClient.get(`/settings/2fa/status`),
  enable2FA: () => apiClient.post(`/settings/2fa/enable`),
  verify2FA: (data) => apiClient.post(`/settings/2fa/verify`, data),
  disable2FA: () => apiClient.post(`/settings/2fa/disable`)
};
