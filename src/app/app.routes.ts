import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.tabsRoutes)
  },
  {
    path: 'duplicate-warning',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/duplicate-warning/duplicate-warning.page').then(m => m.DuplicateWarningPage)
  },
  {
    path: 'report-detail/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/report-detail/report-detail.page').then(m => m.ReportDetailPage)
  },
  { path: '**', redirectTo: 'login' }
];
