import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {

  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      console.error(`[Storage] Error al leer "${key}":`, err);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<boolean> {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) });
      return true;
    } catch (err) {
      console.error(`[Storage] Error al guardar "${key}":`, err);
      return false;
    }
  }

  async remove(key: string): Promise<boolean> {
    try {
      await Preferences.remove({ key });
      return true;
    } catch (err) {
      console.error(`[Storage] Error al eliminar "${key}":`, err);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      await Preferences.clear();
      return true;
    } catch (err) {
      console.error('[Storage] Error al limpiar storage:', err);
      return false;
    }
  }
}

