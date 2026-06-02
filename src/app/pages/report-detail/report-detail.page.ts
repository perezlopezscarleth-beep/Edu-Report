import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonItem, IonSelect, IonSelectOption, IonTextarea, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, flagOutline, personOutline, timeOutline, saveOutline } from 'ionicons/icons';
import { AuthService }   from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { IReport, ReportStatus } from '../../core/models/report.model';
import { TimeAgoPipe }   from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, IonHeader, IonToolbar, IonTitle,
            IonContent, IonButtons, IonBackButton, IonItem, IonSelect, IonSelectOption,
            IonTextarea, IonButton, IonIcon, TimeAgoPipe],
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss']
})
export class ReportDetailPage implements OnInit {
  report: IReport | null = null;
  newStatus  = '';
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private reportService: ReportService
  ) {
    addIcons({ locationOutline, flagOutline, personOutline, timeOutline, saveOutline });
  }

  async ngOnInit() {
    await this.reportService.load();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.report    = this.reportService.getById(id) ?? null;
    this.newStatus = this.report?.status ?? '';
  }

  canManage(): boolean  { return this.auth.isAdmin() || this.auth.isMaintenance(); }
  isAdmin(): boolean    { return this.auth.isAdmin(); }

  async updateReport() {
    if (!this.report) return;
    const user = this.auth.currentUser()!;

    if (this.newStatus && this.newStatus !== this.report.status) {
      await this.reportService.updateStatus(this.report.id, this.newStatus as ReportStatus, user.name);
    }
    if (this.newComment.trim() && this.isAdmin()) {
      await this.reportService.addComment(this.report.id, this.newComment, user.name, user.id, user.role);
      this.newComment = '';
    }
    // Recargar
    this.report = this.reportService.getById(this.report.id) ?? null;
  }

  getStatusLabel(s: string): string {
    return { pendiente: 'Pendiente', en_reparacion: 'En reparación', listo: 'Listo' }[s] ?? s;
  }

  getStatusClass(s: string): string {
    return { pendiente: 'badge-pending', en_reparacion: 'badge-in-repair', listo: 'badge-done' }[s] ?? '';
  }

  getHistoryIcon(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('creado'))       return 'add-circle-outline';
    if (a.includes('asignado'))     return 'person-add-outline';
    if (a.includes('reparacion') || a.includes('reparación')) return 'construct-outline';
    if (a.includes('listo') || a.includes('completado'))      return 'checkmark-circle-outline';
    if (a.includes('comentario'))   return 'chatbubble-outline';
    if (a.includes('urgente'))      return 'warning-outline';
    return 'ellipse-outline';
  }

  getHistoryClass(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('creado'))       return 'hist-created';
    if (a.includes('asignado'))     return 'hist-assigned';
    if (a.includes('reparacion') || a.includes('reparación')) return 'hist-repair';
    if (a.includes('listo') || a.includes('completado'))      return 'hist-done';
    if (a.includes('comentario'))   return 'hist-comment';
    return 'hist-default';
  }
}
