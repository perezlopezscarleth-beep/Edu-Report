import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput,
  IonTextarea, IonSelect, IonSelectOption, IonButton, IonButtons,
  IonBackButton, IonIcon, IonSpinner, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, locationOutline, warningOutline, sendOutline,
         closeCircle, flashOutline, waterOutline, cubeOutline,
         desktopOutline, constructOutline, ellipsisHorizontalOutline,
         documentOutline, imageOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { CameraService } from '../../core/services/camera.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastController } from '@ionic/angular';
import { ReportCategory, ReportPriority } from '../../core/models/report.model';

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
            IonItem, IonInput, IonTextarea, IonSelect, IonSelectOption,
            IonButton, IonButtons, IonBackButton, IonIcon, IonSpinner],
  templateUrl: './new-report.page.html',
  styleUrls: ['./new-report.page.scss']
})
export class NewReportPage {
  @ViewChild('photoInput') photoInput?: ElementRef<HTMLInputElement>;

  isSubmitting = false;
  autoPriority = false;
  otherCategory = '';
  errors: Record<string, string> = {};

  form = {
    category: '' as ReportCategory | '',
    location: '',
    description: '',
    photoUrl: '',
    priority: 'media' as ReportPriority
  };

  categories: { label: string; value: ReportCategory; icon: string }[] = [
    { label: 'Luz', value: 'luz', icon: 'flash-outline' },
    { label: 'Agua', value: 'agua', icon: 'water-outline' },
    { label: 'Mobiliario', value: 'mobiliario', icon: 'cube-outline' },
    { label: 'Computadoras', value: 'computadoras', icon: 'desktop-outline' },
    { label: 'Infraestructura', value: 'infraestructura', icon: 'construct-outline' },
    { label: 'Otros', value: 'otros', icon: 'ellipsis-horizontal-outline' }
  ];

  locations = [
    'Aula Magna', 'Laboratorio de Ciencias', 'Laboratorio de Cómputo',
    'Oficina Administrativa', 'Comedor', 'Biblioteca', 'Gimnasio',
    'Baños Primer Piso', 'Baños Segundo Piso', 'Parqueo', 'Pasillo Principal'
  ];

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private camera: CameraService,
    private notifications: NotificationService,
    private router: Router,
    private actionSheet: ActionSheetController,
    private cdr: ChangeDetectorRef
    , private toastCtrl: ToastController
  ) {
    addIcons({ cameraOutline, locationOutline, warningOutline, sendOutline,
               closeCircle, flashOutline, waterOutline, cubeOutline,
               desktopOutline, constructOutline, ellipsisHorizontalOutline,
               documentOutline, imageOutline });
  }

  selectCategory(cat: ReportCategory) {
    this.form.category = cat;
    this.autoPriority = ['luz', 'agua'].includes(cat);
    if (this.autoPriority) {
      this.form.priority = 'urgente';
    }
    if (cat !== 'otros') {
      this.otherCategory = '';
    }
    delete this.errors['category'];
    this.cdr.markForCheck();
  }

  onDescriptionInput(event: CustomEvent) {
    this.form.description = (event.detail as { value?: string }).value ?? '';
    this.cdr.markForCheck();
  }

  onLocationChange() {
    delete this.errors['location'];
    this.cdr.markForCheck();
  }

  setPriority(p: ReportPriority) {
    if (!this.autoPriority) {
      this.form.priority = p;
    }
    this.cdr.markForCheck();
  }

  removePhoto() {
    this.form.photoUrl = '';
  }

  async showPhotoOptions() {
    if (!Capacitor.isNativePlatform()) {
      this.photoInput?.nativeElement.click();
      return;
    }

    const sheet = await this.actionSheet.create({
      header: 'Adjuntar Foto',
      buttons: [
        { text: 'Cámara', icon: 'camera-outline', handler: () => { this.takePhoto('camera'); } },
        { text: 'Galería', icon: 'image-outline', handler: () => { this.takePhoto('gallery'); } },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  onPhotoFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.photoUrl = reader.result as string;
      delete this.errors['photo'];
    };
    reader.readAsDataURL(file);
    (event.target as HTMLInputElement).value = '';
  }

  async takePhoto(source: 'camera' | 'gallery') {
    const url = source === 'camera'
      ? await this.camera.takePicture()
      : await this.camera.pickFromGallery();
    if (url) {
      this.form.photoUrl = url;
      delete this.errors['photo'];
    }
  }

  private getCategoryLabel(): string {
    if (this.form.category === 'otros') {
      return this.otherCategory.trim();
    }
    return this.form.category;
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.category) {
      this.errors['category'] = 'Selecciona una categoría.';
    } else if (this.form.category === 'otros' && !this.otherCategory.trim()) {
      this.errors['category'] = 'Especifique la categoría en "Otros".';
    }
    if (!this.form.location) {
      this.errors['location'] = 'Selecciona la ubicación.';
    }
    if (this.form.description.trim().length < 10) {
      this.errors['description'] = 'Descripción mínima de 10 caracteres.';
    }
    // Foto es opcional; no forzar como obligatorio
    return Object.keys(this.errors).length === 0;
  }

  async onSubmit() {
    if (!this.validate()) return;

    const categoryLabel = this.getCategoryLabel();
    const duplicate = this.reportService.checkDuplicate(
      this.form.category === 'otros' ? 'otros' : this.form.category!,
      this.form.location
    );
    if (duplicate) {
      this.router.navigate(['/duplicate-warning'], {
        state: { duplicateId: duplicate.id, form: this.form }
      });
      return;
    }

    await this.createReport(categoryLabel);
  }

  async createReport(categoryLabel: string) {
    this.isSubmitting = true;
    const user = this.auth.currentUser()!;
    const report = await this.reportService.create({
      title: `${categoryLabel} — ${this.form.location}`,
      category: this.form.category as ReportCategory,
      location: this.form.location,
      description: this.form.description,
      photoUrl: this.form.photoUrl,
      priority: this.form.priority,
      status: 'pendiente',
      reportedBy: user.id,
      reportedByName: user.name,
    });

    if (['luz', 'agua'].includes(this.form.category!)) {
      await this.notifications.sendUrgentAlert(report.title, report.location);
    }

    this.isSubmitting = false;
    const toast = await this.toastCtrl.create({
      message: 'Reporte enviado correctamente.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
    // Redirigir al listado de incidencias (mis reportes)
    this.router.navigate(['/tabs/reports'], { queryParams: { mine: 'true' } });
  }
}
