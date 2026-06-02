export type ReportStatus   = 'pendiente' | 'en_reparacion' | 'listo';
export type ReportPriority = 'baja' | 'media' | 'urgente';
export type ReportCategory = 'luz' | 'agua' | 'mobiliario' | 'computadoras' | 'infraestructura' | 'otros';

export interface IReport {
  id: string;
  title: string;
  category: ReportCategory;
  location: string;
  description: string;
  photoUrl: string;
  priority: ReportPriority;
  status: ReportStatus;
  reportedBy: string;
  reportedByName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  comments: IComment[];
  history: IHistoryEntry[];
  joinedBy: string[];
}

export interface IComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface IHistoryEntry {
  id: string;
  reportId: string;
  action: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
}
