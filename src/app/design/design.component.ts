import { Component, computed, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class LandingComponent {
  constructor(private router: Router) {}

  // State
  protected liveBadge = signal('🔴 Live Podcast');
  protected mainTitle = signal('SCHNITTSTELLENPASS');
  protected subtitle = signal('Der Fußball-Podcast zwischen Profis und Amateur. Taktik, Analysen und spannende Gespräche über das schönste Spiel der Welt.');

  // Navigation
  protected navLinks = signal([
    { id: '1', label: 'Episoden', url: '#episodes', isRoute: false },
    { id: '2', label: 'Über uns', url: '/about', isRoute: true },
    { id: '3', label: 'Kontakt', url: '#contact', isRoute: false }
  ]);

  // Stats
  protected stats = signal([
    { id: '1', value: '50+', label: 'Episoden' },
    { id: '2', value: '10K+', label: 'Hörer' },
    { id: '3', value: '4.9★', label: 'Bewertung' }
  ]);

  // Social Links
  protected socialLinks = signal<SocialLink[]>([
    { id: '1', name: 'Spotify', icon: '🎵', url: 'https://open.spotify.com/show/4gpxvhJ8WyrGAnba5A6LQc', color: '#1DB954' },
    { id: '2', name: 'YouTube', icon: '▶️', url: 'https://www.youtube.com/@schnittstellenpass1105', color: '#FF0000' },
    { id: '3', name: 'Apple Podcasts', icon: '🎧', url: 'https://podcasts.apple.com/us/search?term=schnittstellenpass%20-%20zwischen%20profi%20und%20amateur', color: '#9333EA' },
    { id: '4', name: 'Instagram', icon: '📸', url: 'https://www.instagram.com/schnittstellenpass/', color: '#E4405F' }
  ]);

  // Platforms
  protected platforms = signal([
    { id: '1', name: 'Spotify', icon: '🎵', url: 'https://spotify.com' },
    { id: '2', name: 'Apple', icon: '🎧', url: 'https://podcasts.apple.com' },
    { id: '3', name: 'YouTube', icon: '▶️', url: 'https://youtube.com' }
  ]);

  // Latest Episode
  protected latestEpisode = signal<Episode>({
    id: '1',
    title: 'Taktische Meisterwerke: Die besten Spielzüge der Saison',
    description: 'Eine tiefgehende Analyse der genialsten taktischen Schachzüge und was wir daraus für Amateur und Profi lernen können.',
    date: '20.11.2025'
  });

  // Features
  protected features = signal([
    {
      id: '1',
      icon: '⚽',
      title: 'Taktik & Analyse',
      description: 'Professionelle Spielanalysen verständlich erklärt'
    },
    {
      id: '2',
      icon: '🎙️',
      title: 'Spannende Gäste',
      description: 'Experten, Trainer und ehemalige Profis im Gespräch'
    },
    {
      id: '3',
      icon: '📊',
      title: 'Datenbasiert',
      description: 'Moderne Statistiken und deren Bedeutung für das Spiel'
    }
  ]);

  // Grid für Fußballfeld
  protected gridLines = computed(() => Array.from({ length: 36 }, (_, i) => i));

  // Actions
  protected onSubscribe(): void {
    console.log('Subscribe clicked');
  }

  protected onListenNow(): void {
    console.log('Listen now clicked');
  }

  protected onShowMore(): void {
    this.router.navigate(['/about']);
  }

  protected onPlayLatest(): void {
    console.log('Play latest episode clicked');
  }

  protected navigateTo(url: string): void {
    this.router.navigate([url]);
  }
}
