import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { StorageService } from './storage.service';
import { MOCK_USERS } from '../../shared/mock/users.mock';
import { environment } from '../../../environments/environment';
import { isInstitutionEmail } from '../utils/validation';

const SESSION_KEY = environment.storage.sessionKey;
const USERS_KEY = environment.storage.usersKey;
const PASSWORDS_KEY = environment.storage.passwordsKey;

/** Contraseñas iniciales solo para usuarios demo (se guardan en storage la primera vez). */
const SEED_PASSWORDS: Record<string, string> = {
  'martinez@institucion.cr': 'Report123456',
  'cvargas@institucion.cr': 'Report234567',
  'arodriguez@institucion.cr': 'Report345678',
  'jsequeira@institucion.cr': 'Report456789',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<IUser | null>(null);
  isInitialized = signal(false);

  private users = signal<IUser[]>([]);
  private passwords = signal<Record<string, string>>({});

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  async init(): Promise<void> {
    try {
      await this.loadUsers();
      await this.loadPasswords();

      const saved = await this.storage.get<IUser>(SESSION_KEY);
      if (saved) {
        this.currentUser.set(saved);
        if (!environment.production) {
          console.debug('[AuthService] Sesión restaurada:', saved.name);
        }
      }
    } catch (err) {
      console.warn('[AuthService] No se pudo restaurar sesión:', err);
    } finally {
      this.isInitialized.set(true);
    }
  }

  private async loadUsers(): Promise<void> {
    const stored = await this.storage.get<IUser[]>(USERS_KEY);
    if (stored?.length) {
      this.users.set(stored);
      return;
    }
    await this.storage.set(USERS_KEY, MOCK_USERS);
    this.users.set([...MOCK_USERS]);
  }

  private async loadPasswords(): Promise<void> {
    const stored = await this.storage.get<Record<string, string>>(PASSWORDS_KEY);
    if (stored && Object.keys(stored).length > 0) {
      this.passwords.set(stored);
      return;
    }
    await this.storage.set(PASSWORDS_KEY, { ...SEED_PASSWORDS });
    this.passwords.set({ ...SEED_PASSWORDS });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  getUsers(): IUser[] {
    return this.users();
  }

 async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const key = this.normalizeEmail(email);
    
    // 1. Buscar el usuario por email
    const user = this.users().find(u => this.normalizeEmail(u.email) === key);
    
    // 2. Obtener su contraseña guardada
    const expected = this.passwords()[key];

    // 3. Validar que la contraseña coincida
    if (!user || !expected || password !== expected) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    // 4. Guardar sesión y retornar éxito
    this.currentUser.set(user);
    await this.storage.set(SESSION_KEY, user);
    return { success: true };
  } catch {
    return { success: false, error: 'Error interno. Intenta de nuevo.' };
  }
}

async registerUser(
  user: Omit<IUser, 'id' | 'createdAt'>,
  password: string  // ← Contraseña única del nuevo usuario
): Promise<{ success: boolean; error?: string }> {
  
  // 1. Validar que sea email institucional
  if (!isInstitutionEmail(user.email)) {
    return { success: false, error: 'Use el formato nombre@institucion.cr' };
  }

  // 2. Verificar que no exista una cuenta con ese correo
  const key = this.normalizeEmail(user.email);
  if (this.users().some(u => this.normalizeEmail(u.email) === key)) {
    return { success: false, error: 'Ya existe una cuenta con ese correo.' };
  }

  // 3. Crear nuevo usuario con ID único
  const newUser: IUser = {
    ...user,
    id: `USR-${Date.now()}`,  // ← ID único basado en timestamp
    createdAt: new Date().toISOString(),
  };

  // 4. Guardar usuario Y contraseña en arrays
  const updatedUsers = [...this.users(), newUser];
  const updatedPasswords = { ...this.passwords(), [key]: password };  // ← La contraseña se vincula al email

  // 5. Guardar en signals (memoria)
  this.users.set(updatedUsers);
  this.passwords.set(updatedPasswords);
  
  // 6. Guardar en Capacitor Storage (persistente)
  await this.storage.set(USERS_KEY, updatedUsers);
  await this.storage.set(PASSWORDS_KEY, updatedPasswords);

  return { success: true };
}

  async logout(): Promise<void> {
    this.currentUser.set(null);
    await this.storage.remove(SESSION_KEY);
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('administrador');
  }

  isMaintenance(): boolean {
    return this.hasRole('mantenimiento');
  }

  isReporter(): boolean {
    return this.hasRole('reportante');
  }
}
