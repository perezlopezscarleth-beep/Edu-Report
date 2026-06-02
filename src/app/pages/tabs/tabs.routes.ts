import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.HomePage)
      },
      {
        path: 'reports',
        loadComponent: () => import('../reports/reports.page').then(m => m.ReportsPage)
      },
      {
        path: 'new-report',
        loadComponent: () => import('../new-report/new-report.page').then(m => m.NewReportPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('../notifications/notifications.page').then(m => m.NotificationsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
