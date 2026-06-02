import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonIcon, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { businessOutline, documentTextOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { AlertController } from '@ionic/angular';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonList, IonItem, IonIcon, IonLabel, IonButton],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  user = this.auth.currentUser;
  myReportsCount = 0;

  constructor(
    private auth: AuthService,
    private reportService: ReportService
    , private alertCtrl: AlertController
  ) {
    addIcons({ businessOutline, documentTextOutline, logOutOutline, personOutline });
  }

  async ngOnInit() {
    await this.reportService.load();
    const userId = this.user()?.id;
    if (userId) {
      this.myReportsCount = this.reportService.getByUser(userId).length;
    }
  }

  getRoleLabel(role?: string): string {
    return {
      reportante: '📋 Reportante',
      mantenimiento: '🔧 Mantenimiento',
      administrador: '👨‍💼 Administrador'
    }[role ?? ''] ?? 'Usuario';
  }

  async logout() {
    (document.activeElement as HTMLElement)?.blur();
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Cerrar sesión', role: 'confirm', handler: async () => { await this.auth.logout(); } }
      ]
    });
    await alert.present();
  }
}
