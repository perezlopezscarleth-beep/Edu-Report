export type UserRole = 'reportante' | 'mantenimiento' | 'administrador';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  createdAt: string;
}
