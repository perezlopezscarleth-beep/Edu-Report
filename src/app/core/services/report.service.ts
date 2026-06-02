import { Injectable, signal } from '@angular/core';
import { IReport, ReportCategory, ReportStatus } from '../models/report.model';
import { StorageService } from './storage.service';
import { MOCK_REPORTS } from '../../shared/mock/reports.mock';

const REPORTS_KEY = 'edureport_reports';

@Injectable({ providedIn: 'root' })
export class ReportService {
  reports = signal<IReport[]>([]);

  constructor(private storage: StorageService) {}

  async load(): Promise<void> {
    const stored = await this.storage.get<IReport[]>(REPORTS_KEY);
    if (stored && stored.length > 0) {
      this.reports.set(stored);
    } else {
      await this.storage.set(REPORTS_KEY, MOCK_REPORTS);
      this.reports.set(MOCK_REPORTS);
    }
  }

  private async save(): Promise<void> {
    await this.storage.set(REPORTS_KEY, this.reports());
  }

  async create(report: Omit<IReport, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'history' | 'joinedBy'>): Promise<IReport> {
    const now = new Date().toISOString();
    const reportId = `RPT-${Date.now()}`;
    const historyId = `H-${Date.now()}`;
    const newReport: IReport = {
      ...report,
      id: reportId,
      createdAt: now,
      updatedAt: now,
      comments: [],
      history: [{
        id: historyId,
        reportId,
        action: 'Reporte creado',
        performedBy: report.reportedBy,
        performedByName: report.reportedByName,
        timestamp: now
      }],
      joinedBy: []
    };
    this.reports.update(list => [newReport, ...list]);
    await this.save();
    return newReport;
  }

  async updateStatus(id: string, status: ReportStatus, performedByName: string): Promise<void> {
    this.reports.update(list => list.map(r => {
      if (r.id !== id) return r;
      return {
        ...r,
        status,
        updatedAt: new Date().toISOString(),
        history: [...r.history, {
          id: `H-${Date.now()}`,
          reportId: id,
          action: `Estado actualizado a: ${status.replace('_', ' ')}`,
          performedBy: '',
          performedByName,
          timestamp: new Date().toISOString()
        }]
      };
    }));
    await this.save();
  }

  async addComment(reportId: string, text: string, authorName: string, authorId: string, authorRole: string): Promise<void> {
    this.reports.update(list => list.map(r => {
      if (r.id !== reportId) return r;
      return {
        ...r,
        updatedAt: new Date().toISOString(),
        comments: [...r.comments, {
          id: `C-${Date.now()}`,
          reportId,
          authorId,
          authorName,
          authorRole,
          text,
          createdAt: new Date().toISOString()
        }]
      };
    }));
    await this.save();
  }

  async joinReport(reportId: string, userId: string): Promise<void> {
    this.reports.update(list => list.map(r => {
      if (r.id !== reportId || r.joinedBy.includes(userId)) return r;
      return { ...r, joinedBy: [...r.joinedBy, userId] };
    }));
    await this.save();
  }

  checkDuplicate(category: string, location: string): IReport | null {
    return this.reports().find(r =>
      r.category === category &&
      r.location.toLowerCase() === location.toLowerCase() &&
      r.status !== 'listo'
    ) ?? null;
  }

  getById(id: string): IReport | undefined {
    return this.reports().find(r => r.id === id);
  }

  getByStatus(status: ReportStatus): IReport[] {
    return this.reports().filter(r => r.status === status);
  }

  getByUser(userId: string): IReport[] {
    return this.reports().filter(r => r.reportedBy === userId);
  }
}
