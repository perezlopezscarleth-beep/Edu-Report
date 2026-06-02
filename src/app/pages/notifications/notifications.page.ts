import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewWillEnter } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonIcon, IonLabel, IonBadge, IonButton, IonButtons, IonRefresher, IonRefresherContent,
  IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOffOutline, addCircleOutline, chevronDownOutline,
  alertCircleOutline, checkmarkCircleOutline, chatbubbleOutline, closeOutline
} from 'ionicons/icons';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { ReportService } from '../../core/services/report.service';
import { IReport } from '../../core/models/report.model';
import { AuthService } from '../../core/services/auth.service';

export interface INotification {
  id: string;
  reportId: string;
  title: string;
  body: string;
  icon: string;
  urgent: boolean;
  read: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonList, IonItem, IonIcon, IonLabel, IonBadge, IonButton, IonButtons,
            IonRefresher, IonRefresherContent, IonModal, TimeAgoPipe],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss']
})
export class NotificationsPage implements OnInit, ViewWillEnter {
  notifications = signal<INotification[]>([]);
  selectedReport: IReport | null = null;
  isModalOpen = false;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private auth: AuthService
  ) {
    addIcons({
      notificationsOffOutline, addCircleOutline, chevronDownOutline,
      alertCircleOutline, checkmarkCircleOutline, chatbubbleOutline, closeOutline
    });
  }

  ngOnInit() {
    this.loadNotifications();
  }

  ionViewWillEnter() {
    this.loadNotifications();
  }

  async onRefresh(event: Event) {
    await this.reportService.load();
    this.loadNotifications();
    (event as CustomEvent).detail.complete();
  }

  loadNotifications() {
    const userId = this.auth.currentUser()?.id;
    const reports = this.reportService.reports().filter(r => r.reportedBy === userId);
    const urgent = reports.find(r => r.priority === 'urgente' && r.status !== 'listo');
    const inRepair = reports.find(r => r.status === 'en_reparacion');
    const withComments = reports.find(r => r.comments.length > 0);

    const items: INotification[] = [];

    if (urgent) {
      items.push({
        id: 'n-urgent',
        reportId: urgent.id,
        title: 'Incidencia urgente detectada',
        body: `${urgent.title} — ${urgent.location}`,
        icon: 'alert-circle-outline',
        urgent: true,
        read: false,
        timestamp: urgent.updatedAt
      });
    }

    if (inRepair) {
      items.push({
        id: 'n-repair',
        reportId: inRepair.id,
        title: 'Estado actualizado',
        body: `Tu reporte "${inRepair.title}" está en reparación`,
        icon: 'checkmark-circle-outline',
        urgent: false,
        read: true,
        timestamp: inRepair.updatedAt
      });
    }

    if (withComments) {
      const lastComment = withComments.comments[withComments.comments.length - 1];
      items.push({
        id: 'n-comment',
        reportId: withComments.id,
        title: 'Nuevo comentario',
        body: `${lastComment.authorName} comentó en tu reporte`,
        icon: 'chatbubble-outline',
        urgent: false,
        read: true,
        timestamp: lastComment.createdAt
      });
    }

    this.notifications.set(items);
  }

  goToNewReport() {
    this.router.navigate(['/tabs/new-report']);
  }

  openNotification(notif: INotification) {
    this.markAsRead(notif.id);
    const report = this.reportService.getById(notif.reportId);
    if (report) {
      this.selectedReport = report;
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedReport = null;
  }

  goToDetail(id: string) {
    this.router.navigate(['/report-detail', id]);
    this.closeModal();
  }

  markAsRead(id: string) {
    this.notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  getStatusLabel(s: string): string {
    return { pendiente: 'Pendiente', en_reparacion: 'En reparación', listo: 'Listo' }[s] ?? s;
  }

  getStatusClass(s: string): string {
    return { pendiente: 'badge-pending', en_reparacion: 'badge-in-repair', listo: 'badge-done' }[s] ?? '';
  }
}
