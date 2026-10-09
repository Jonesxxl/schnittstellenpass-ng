import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Title and description of each page for search results and link previews (see shared/page-meta.ts);
// the start page repeats the defaults of src/index.html
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Schnittstellenpass – Der Fußball-Podcast zwischen Profi & Amateur',
    data: { description: 'Gespräche mit Menschen aus Bundesliga, Kreisliga und allem dazwischen. Der Fußball-Podcast zwischen Profi & Amateur – auf Spotify, Apple Podcasts und YouTube.' }
  },
  {
    path: 'impressum',
    loadComponent: () => import('./legal/impressum.component').then(m => m.ImpressumComponent),
    title: 'Impressum – Schnittstellenpass',
    data: { description: 'Impressum des Fußball-Podcasts Schnittstellenpass: Anbieter, Kontakt und Verantwortlicher für den Inhalt.' }
  },
  {
    path: 'datenschutz',
    loadComponent: () => import('./legal/datenschutz.component').then(m => m.DatenschutzComponent),
    title: 'Datenschutz – Schnittstellenpass',
    data: { description: 'Datenschutzerklärung von Schnittstellenpass: welche Daten beim Besuch der Website verarbeitet werden und welche Rechte du hast.' }
  },
  // Former sub pages (/home, /episodes, /about, /contact) and unknown URLs lead to the one-pager
  { path: '**', redirectTo: '' }
];
