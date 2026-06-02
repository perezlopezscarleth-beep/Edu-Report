import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async requestPermission(): Promise<void> {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
        return;
      }
      const result = await LocalNotifications.requestPermissions();
      if (result.display === 'denied') {
        console.debug('[NotificationService] Permisos denegados por el usuario.');
      }
    } catch (error) {
      console.debug('[NotificationService] Permisos no disponibles en este entorno.');
    }
  }

  async sendUrgentAlert(reportTitle: string, location: string): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title: '🚨 Incidencia Urgente Detectada',
          body: `${reportTitle} — ${location}`,
          sound: 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          actionTypeId: '',
          extra: null,
          schedule: { at: new Date(Date.now() + 500) }
        }]
      });
    } catch (error) {
      console.warn('[NotificationService] Error al enviar notificación:', error);
    }
  }
}
