import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('../pages/devices/devices.page').then((m) => m.DevicesPage),
      },
      {
        path: 'processes',
        loadComponent: () =>
          import('../pages/processes/processes.page').then((m) => m.ProcessesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];
