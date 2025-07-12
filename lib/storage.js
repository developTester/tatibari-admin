// Mock data storage for development
export const STORAGE_KEYS = {
  ORDERS: 'tataibari_orders',
  PRODUCTS: 'tataibari_products',
  CATEGORIES: 'tataibari_categories',
  USERS: 'tataibari_users',
  LOGS: 'tataibari_logs',
  SETTINGS: 'tataibari_settings',
  PAGES: 'tataibari_pages'
};

export const getStorageData = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const setStorageData = (key, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const addStorageItem = (key, item) => {
  const data = getStorageData(key);
  const newItem = { ...item, id: Date.now(), createdAt: new Date().toISOString() };
  data.push(newItem);
  setStorageData(key, data);
  return newItem;
};

export const updateStorageItem = (key, id, updates) => {
  const data = getStorageData(key);
  const index = data.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    setStorageData(key, data);
    return data[index];
  }
  return null;
};

export const deleteStorageItem = (key, id) => {
  const data = getStorageData(key);
  const filtered = data.filter(item => item.id !== parseInt(id));
  setStorageData(key, filtered);
  return true;
};