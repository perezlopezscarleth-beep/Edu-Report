import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wifiOutline, cloudOfflineOutline } from 'ionicons/icons';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="offline-banner" *ngIf="!isOnline">
      <ion-icon name="cloud-offline-outline"></ion-icon>
      <span>Modo sin conexión — Los datos están guardados localmente</span>
    </div>
  `,
  styles: [`
    .offline-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #F57F17;
      color: white;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 500;
      width: 100%;
      justify-content: center;
    }

    ion-icon {
      font-size: 16px;
    }
  `]
})
export class OfflineBannerComponent implements OnInit, OnDestroy {
  isOnline = navigator.onLine;

  private onlineHandler  = () => this.isOnline = true;
  private offlineHandler = () => this.isOnline = false;

  constructor() {
    addIcons({ wifiOutline, cloudOfflineOutline });
  }

  ngOnInit() {
    window.addEventListener('online',  this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('online',  this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
  }
}
