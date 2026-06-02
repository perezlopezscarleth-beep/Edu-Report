import { Component, OnInit, signal } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonSegment, IonSegmentButton, IonCard, IonCardContent, IonIcon,
  IonModal, IonButton, IonButtons, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, documentOutline, closeOutline, chevronDownOutline } from 'ionicons/icons';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';
import { IReport } from '../../core/models/report.model';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonSearchbar, IonSegment, IonSegmentButton, IonCard, IonCardContent, IonIcon,
            IonModal, IonButton, IonButtons, IonRefresher, IonRefresherContent, TimeAgoPipe],
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss']
})
export class ReportsPage implements OnInit, ViewWillEnter {
  searchTerm = '';
  activeFilter = 'todos';
  onlyMine = false;
  filtered = signal<IReport[]>([]);
  selectedReport: IReport | null = null;
  isModalOpen = false;

  constructor(
    private reportService: ReportService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ locationOutline, documentOutline, closeOutline, chevronDownOutline });
  }

  async ngOnInit() {
    await this.reportService.load();
    this.route.queryParamMap.subscribe(params => {
      this.activeFilter = params.get('filter') ?? 'todos';
      this.onlyMine = params.get('mine') === 'true';
      this.applyFilters();
    });
  }

  ionViewWillEnter() {
    this.reportService.load().then(() => this.applyFilters());
  }

  async onRefresh(event: Event) {
    await this.reportService.load();
    this.applyFilters();
    (event as CustomEvent).detail.complete();
  }

  applyFilters() {
    let list = this.reportService.reports();

    if (this.onlyMine) {
      const userId = this.auth.currentUser()?.id;
      if (userId) {
        list = list.filter(r => r.reportedBy === userId);
      }
    }

    if (this.activeFilter !== 'todos') {
      list = list.filter(r => r.status === this.activeFilter);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }

    this.filtered.set(list);
  }

  onSearchInput(event: CustomEvent) {
    this.searchTerm = (event.detail as { value?: string }).value ?? '';
    this.applyFilters();
  }

  onFilterChange(event: CustomEvent) {
    const value = (event.detail as { value?: string }).value;
    if (value) {
      this.activeFilter = value;
      this.applyFilters();
    }
  }

  viewReportDetails(report: IReport) {
    this.selectedReport = report;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedReport = null;
  }

  goToDetail(id: string) {
    this.router.navigate(['/report-detail', id]);
    this.closeModal();
  }

  getStatusLabel(s: string): string {
    return { pendiente: 'Pendiente', en_reparacion: 'En reparación', listo: 'Listo' }[s] ?? s;
  }

  getStatusClass(s: string): string {
    return { pendiente: 'badge-pending', en_reparacion: 'badge-in-repair', listo: 'badge-done' }[s] ?? '';
  }
}
