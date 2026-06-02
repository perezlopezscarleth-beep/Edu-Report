import { IUser } from '../../core/models/user.model';

export const MOCK_USERS: IUser[] = [
  {
    id: 'USR-001',
    name: 'Prof. Dr. Martínez García',
    email: 'martinez@institucion.cr',
    role: 'reportante',
    department: 'Ciencias Naturales',
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'USR-002',
    name: 'Carlos Vargas Solís',
    email: 'cvargas@institucion.cr',
    role: 'mantenimiento',
    department: 'Mantenimiento General',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'USR-003',
    name: 'Lic. Ana Rodríguez Mora',
    email: 'arodriguez@institucion.cr',
    role: 'administrador',
    department: 'Administración',
    createdAt: '2024-01-05T08:00:00Z'
  },
  {
    id: 'USR-004',
    name: 'Jorge Sequeira Blanco',
    email: 'jsequeira@institucion.cr',
    role: 'reportante',
    department: 'Conserjería',
    createdAt: '2024-02-01T08:00:00Z'
  }
];
