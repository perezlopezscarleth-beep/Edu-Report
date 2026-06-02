import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular/standalone';

@Injectable({ providedIn: 'root' })
export class UiService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl:   ToastController,
    private alertCtrl:   AlertController
  ) {}

  // ─── LOADING ────────────────────────────────────────────────
  private loadingRef: HTMLIonLoadingElement | null = null;

  async showLoading(message = 'Cargando...'): Promise<void> {
    this.loadingRef = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
      cssClass: 'edureport-loading'
    });
    await this.loadingRef.present();
  }

  async hideLoading(): Promise<void> {
    if (this.loadingRef) {
      await this.loadingRef.dismiss();
      this.loadingRef = null;
    }
  }

  // ─── TOAST ──────────────────────────────────────────────────
  async showSuccess(message: string): Promise<void> {
    await this.showToast(message, 'success', 'checkmark-circle-outline');
  }

  async showError(message: string): Promise<void> {
    await this.showToast(message, 'danger', 'alert-circle-outline');
  }

  async showWarning(message: string): Promise<void> {
    await this.showToast(message, 'warning', 'warning-outline');
  }

  private async showToast(message: string, color: string, icon: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
      icon,
      cssClass: 'edureport-toast'
    });
    await toast.present();
  }

  // ─── ALERT DE CONFIRMACIÓN ──────────────────────────────────
  async confirm(
    header: string,
    message: string,
    confirmText = 'Confirmar',
    cancelText  = 'Cancelar'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          { text: cancelText,  role: 'cancel',  handler: () => resolve(false) },
          { text: confirmText, role: 'confirm', handler: () => resolve(true)  }
        ]
      });
      await alert.present();
    });
  }
}
