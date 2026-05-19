import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  /**
   * Save data to localStorage
   * @param key - The key to store data under
   * @param data - The data to store (will be serialized to JSON)
   */
  setItem<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  /**
   * Retrieve data from localStorage
   * @param key - The key to retrieve data from
   * @returns The data or null if not found
   */
  getItem<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  /**
   * Clear all data from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns true if the key exists, false otherwise
   */
  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
