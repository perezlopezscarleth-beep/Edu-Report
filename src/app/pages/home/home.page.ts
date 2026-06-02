import { Component, OnInit, computed } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent,
  IonButton, IonButtons, IonAvatar, IonIcon, IonGrid, IonRow, IonCol,
  IonRefresher, IonRefresherContent, IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, documentTextOutline, timeOutline,
         locationOutline, personCircleOutline, flashOutline, waterOutline,
         cubeOutline, desktopOutline, constructOutline, ellipsisHorizontalOutline,
         chevronDownOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonCard, IonCardContent, IonButton, IonButtons, IonAvatar, IonIcon,
            IonGrid, IonRow, IonCol, IonRefresher, IonRefresherContent, IonSkeletonText, TimeAgoPipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, ViewWillEnter {
  isLoading = true;
  user = this.auth.currentUser;

  urgentReports = computed(() =>
    this.reportService.reports()
      .filter(r => r.priority === 'urgente' && r.status !== 'listo' && r.reportedBy === this.user()?.id)
      .slice(0, 3)
  );

  myReports = computed(() =>
    this.reportService.getByUser(this.user()?.id ?? '')
  );

  pendingReports = computed(() =>
    this.myReports().filter(r => r.status === 'pendiente')
  );

  recentReports = computed(() =>
    [...this.myReports()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)
  );

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private router: Router
  ) {
    addIcons({ addCircleOutline, documentTextOutline, timeOutline, locationOutline, personCircleOutline,
               flashOutline, waterOutline, cubeOutline, desktopOutline, constructOutline,
               ellipsisHorizontalOutline, chevronDownOutline });
  }

  async ngOnInit() {
    await this.loadData(true);
  }

  ionViewWillEnter() {
    this.loadData(false);
  }

  private async loadData(showSkeleton: boolean) {
    if (showSkeleton) this.isLoading = true;
    await this.reportService.load();
    if (showSkeleton) this.isLoading = false;
  }

  async onRefresh(event: Event) {
    await this.reportService.load();
    (event as CustomEvent).detail.complete();
  }

  goToNewReport() {
    this.router.navigate(['/tabs/new-report']);
  }

  goToMyReports() {
    this.router.navigate(['/tabs/reports'], { queryParams: { mine: 'true' } });
  }

  goToAllReports() {
    this.router.navigate(['/tabs/reports']);
  }

  goToPending() {
    this.router.navigate(['/tabs/reports'], { queryParams: { filter: 'pendiente', mine: 'true' } });
  }

  goToDetail(id: string) {
    this.router.navigate(['/report-detail', id]);
  }

  goToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      luz: 'flash-outline', agua: 'water-outline', mobiliario: 'cube-outline',
      computadoras: 'desktop-outline', infraestructura: 'construct-outline', otros: 'ellipsis-horizontal-outline'
    };
    return map[cat] ?? 'alert-circle-outline';
  }

  getStatusLabel(s: string): string {
    return { pendiente: 'Pendiente', en_reparacion: 'En reparación', listo: 'Listo' }[s] ?? s;
  }

  getStatusClass(s: string): string {
    return { pendiente: 'badge-pending', en_reparacion: 'badge-in-repair', listo: 'badge-done' }[s] ?? '';
  }
}
