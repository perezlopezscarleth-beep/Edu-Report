import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { warning, peopleOutline } from 'ionicons/icons';
import { AuthService }   from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { IReport }       from '../../core/models/report.model';

@Component({
  selector: 'app-duplicate-warning',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
            IonCardContent, IonButton, IonButtons, IonBackButton, IonIcon],
  templateUrl: './duplicate-warning.page.html',
  styleUrls: ['./duplicate-warning.page.scss']
})
export class DuplicateWarningPage implements OnInit {
  existing: IReport | null = null;
  private pendingForm: any;

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private router: Router
  ) {
    addIcons({ warning, peopleOutline });
  }

  ngOnInit() {
    const state = history.state;
    this.pendingForm = state.form;
    if (state.duplicateId) {
      this.existing = this.reportService.getById(state.duplicateId) ?? null;
    }
  }

  async joinExisting() {
    if (this.existing) {
      await this.reportService.joinReport(this.existing.id, this.auth.currentUser()!.id);
      this.router.navigate(['/report-detail', this.existing.id]);
    }
  }

  viewExisting() {
    if (this.existing) this.router.navigate(['/report-detail', this.existing.id]);
  }

  async createNew() {
    this.router.navigate(['/tabs/home']);
  }

  getStatusLabel(s?: string): string {
    return { pendiente: 'Pendiente', en_reparacion: 'En reparación', listo: 'Listo' }[s ?? ''] ?? '';
  }

  getStatusClass(s?: string): string {
    return { pendiente: 'badge-pending', en_reparacion: 'badge-in-repair', listo: 'badge-done' }[s ?? ''] ?? '';
  }
}
