export const AUTH_KEY = 'tataibari_admin_auth';

export const login = (credentials) => {
  // Mock login - in production, validate against backend
  if (credentials.email === 'admin@tataibari.com' && credentials.password === 'admin123') {
    const authData = {
      user: {
        id: 1,
        email: credentials.email,
        name: 'Admin User',
        avatar: '/avatar.jpg'
      },
      token: 'mock-jwt-token',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return { success: true, user: authData.user };
  }
  return { success: false, error: 'Invalid credentials' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getAuthData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return getAuthData() !== null;
};