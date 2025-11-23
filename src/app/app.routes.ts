import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'design',
    pathMatch: 'full'
  },
  {
    path: 'design',
    loadComponent: () => import('./design/design.component').then(m => m.LandingComponent)
  },
  {
    path: 'episodes',
    loadComponent: () => import('./episodes/episodes.component').then(m => m.EpisodesComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  }
];
