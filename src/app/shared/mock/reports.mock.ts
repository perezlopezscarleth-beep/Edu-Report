import { IReport } from '../../core/models/report.model';

export const MOCK_REPORTS: IReport[] = [
  {
    id: 'INC-2024-001',
    title: 'Fuga de Agua B-4',
    category: 'agua',
    location: 'Laboratorio de Ciencias',
    description: 'Se observa una filtración constante de agua proveniente de la tubería principal del ala B. Existe riesgo de daño a equipos electrónicos. El área ha sido desalojada.',
    photoUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23E3F2FD" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%231565C0" font-size="12">Agua</text></svg>',
    priority: 'urgente',
    status: 'en_reparacion',
    reportedBy: 'USR-001',
    reportedByName: 'Prof. Dr. Martínez García',
    assignedTo: 'USR-002',
    createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 1*60*60*1000).toISOString(),
    joinedBy: ['USR-004'],
    comments: [
      {
        id: 'C-001',
        reportId: 'INC-2024-001',
        authorId: 'USR-002',
        authorName: 'Carlos Vargas Solís',
        authorRole: 'mantenimiento',
        text: 'En proceso de reparación. El personal de mantenimiento ha localizado la fuga en la tubería principal del ala B.',
        createdAt: new Date(Date.now() - 1*60*60*1000).toISOString()
      }
    ],
    history: [
      { id: 'H-001', reportId: 'INC-2024-001', action: 'Reporte creado', performedBy: 'USR-001', performedByName: 'Prof. Dr. Martínez García', timestamp: new Date(Date.now() - 2*60*60*1000).toISOString() },
      { id: 'H-002', reportId: 'INC-2024-001', action: 'Asignado a Mantenimiento', performedBy: 'USR-003', performedByName: 'Lic. Ana Rodríguez Mora', timestamp: new Date(Date.now() - 90*60*1000).toISOString() },
      { id: 'H-003', reportId: 'INC-2024-001', action: 'Estado actualizado a: en reparacion', performedBy: 'USR-002', performedByName: 'Carlos Vargas Solís', timestamp: new Date(Date.now() - 1*60*60*1000).toISOString() }
    ]
  },
  {
    id: 'INC-2024-002',
    title: 'Falla Eléctrica — Laboratorio de Cómputo',
    category: 'luz',
    location: 'Laboratorio de Cómputo',
    description: 'Tres tomacorrientes del lado sur no tienen corriente. Varios equipos no encienden.',
    photoUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23FFF8E1" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%23F57F17" font-size="12">Luz</text></svg>',
    priority: 'urgente',
    status: 'pendiente',
    reportedBy: 'USR-004',
    reportedByName: 'Jorge Sequeira Blanco',
    createdAt: new Date(Date.now() - 5*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 5*60*60*1000).toISOString(),
    joinedBy: [],
    comments: [],
    history: [
      { id: 'H-004', reportId: 'INC-2024-002', action: 'Reporte creado', performedBy: 'USR-004', performedByName: 'Jorge Sequeira Blanco', timestamp: new Date(Date.now() - 5*60*60*1000).toISOString() }
    ]
  },
  {
    id: 'INC-2024-003',
    title: 'Gotera Techo — Oficina Administrativa',
    category: 'agua',
    location: 'Oficina Administrativa',
    description: 'Gotera detectada en el cielo raso de la oficina principal. Manchas de humedad visibles.',
    photoUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23E3F2FD" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%231565C0" font-size="10">Agua</text></svg>',
    priority: 'media',
    status: 'en_reparacion',
    reportedBy: 'USR-001',
    reportedByName: 'Prof. Dr. Martínez García',
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
    joinedBy: [],
    comments: [],
    history: [
      { id: 'H-005', reportId: 'INC-2024-003', action: 'Reporte creado', performedBy: 'USR-001', performedByName: 'Prof. Dr. Martínez García', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
    ]
  },
  {
    id: 'INC-2024-004',
    title: 'Puerta Vidrio Rota — Entrada Principal',
    category: 'infraestructura',
    location: 'Aula Magna',
    description: 'El vidrio lateral de la puerta principal está agrietado. Riesgo de cortaduras.',
    photoUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23E8F5E9" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%232E7D32" font-size="10">Listo</text></svg>',
    priority: 'media',
    status: 'listo',
    reportedBy: 'USR-004',
    reportedByName: 'Jorge Sequeira Blanco',
    createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
    updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    joinedBy: [],
    comments: [],
    history: [
      { id: 'H-006', reportId: 'INC-2024-004', action: 'Reporte creado', performedBy: 'USR-004', performedByName: 'Jorge Sequeira Blanco', timestamp: new Date(Date.now() - 7*24*60*60*1000).toISOString() },
      { id: 'H-007', reportId: 'INC-2024-004', action: 'Estado actualizado a: listo', performedBy: 'USR-003', performedByName: 'Lic. Ana Rodríguez Mora', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString() }
    ]
  }
];
