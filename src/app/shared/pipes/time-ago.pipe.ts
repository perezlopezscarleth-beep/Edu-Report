import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true, pure: false })
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private cd: ChangeDetectorRef) {
    // Actualizar cada 30 segundos para que los tiempos sean precisos
    this.timer = setInterval(() => this.cd.markForCheck(), 30_000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  transform(value: string | null | undefined): string {
    if (!value) return 'Fecha desconocida';

    const now  = new Date();
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 30)    return 'Ahora mismo';
    if (diff < 60)    return `Hace ${diff} segundos`;
    if (diff < 3600)  return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
    return date.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

