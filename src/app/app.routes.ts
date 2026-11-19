import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/portfolio/portfolio').then((m) => m.Portfolio),
    title: 'Miguel Angel Cesary | Full Stack Developer',
  },
  {
    // Cambia "admin" por la ruta privada que prefieras (ej. "panel-mcs").
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    title: 'Panel de estadísticas | MACS',
  },
  { path: '**', redirectTo: '' },
];
