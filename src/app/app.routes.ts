import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./design/design.component').then(m => m.LandingComponent)
  },
  {
    path: 'episodes',
    loadComponent: () => import('./episodes/episodes.component').then(m => m.EpisodesComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'impressum',
    loadComponent: () => import('./legal/impressum.component').then(m => m.ImpressumComponent)
  },
  {
    path: 'datenschutz',
    loadComponent: () => import('./legal/datenschutz.component').then(m => m.DatenschutzComponent)
  }
];
