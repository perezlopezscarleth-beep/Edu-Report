import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class CameraService {

  async takePicture(): Promise<string | null> {
    return this.getPhoto(CameraSource.Camera);
  }

  async pickFromGallery(): Promise<string | null> {
    return this.getPhoto(CameraSource.Photos);
  }

  private async ensurePermissions(source: CameraSource): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    try {
      const permissions = await Camera.requestPermissions({
        permissions: source === CameraSource.Camera ? ['camera'] : ['photos']
      });
      if (source === CameraSource.Camera) {
        return permissions.camera === 'granted' || permissions.camera === 'limited';
      }
      return permissions.photos === 'granted' || permissions.photos === 'limited';
    } catch {
      return false;
    }
  }

  private async getPhoto(source: CameraSource): Promise<string | null> {
    const effectiveSource = (!Capacitor.isNativePlatform() && source === CameraSource.Camera)
      ? CameraSource.Photos
      : source;

    const hasPermission = await this.ensurePermissions(effectiveSource);
    if (!hasPermission) {
      console.warn('[CameraService] Permiso de cámara o galería denegado.');
      return null;
    }

    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: effectiveSource,
        width: 1024,
        correctOrientation: true
      });

      if (!photo.dataUrl) return null;
      return await this.compressImage(photo.dataUrl, 0.7);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('cancelled') || message.includes('canceled') || message.includes('User cancelled')) {
        return null;
      }
      console.error('[CameraService] Error al obtener foto:', err);
      return null;
    }
  }

  private compressImage(dataUrl: string, quality: number): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
    });
  }
}
