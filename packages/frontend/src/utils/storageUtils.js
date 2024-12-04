import { isClient } from './isClient';

export const saveToLocalStorage = (key, value) => {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  if (!isClient()) return null;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = (key) => {
  if (!isClient()) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erro ao limpar o localStorage:', error);
  }
};
