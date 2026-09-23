import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'impressum', loadComponent: () => import('./legal/impressum.component').then(m => m.ImpressumComponent) },
  { path: 'datenschutz', loadComponent: () => import('./legal/datenschutz.component').then(m => m.DatenschutzComponent) },
  // Former sub pages (/home, /episodes, /about, /contact) and unknown URLs lead to the one-pager
  { path: '**', redirectTo: '' }
];
