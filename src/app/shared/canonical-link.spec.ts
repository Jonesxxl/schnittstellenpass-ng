import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideCanonicalLink } from './canonical-link';

@Component({ template: '' })
class PageStubComponent {}

describe('provideCanonicalLink', () => {
  let ogUrl: HTMLMetaElement;

  beforeEach(() => {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageStubComponent },
          { path: 'impressum', component: PageStubComponent },
          { path: '**', redirectTo: '' }
        ]),
        provideCanonicalLink()
      ]
    });
  });

  afterEach(() => {
    ogUrl.remove();
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

  it('should point to the page without anchor or query', async () => {
    await TestBed.inject(Router).navigateByUrl('/impressum?ref=footer#kontakt');

    expect(canonical()).toBe('https://schnittstellenpass.de/impressum');
    expect(ogUrl.getAttribute('content')).toBe('https://schnittstellenpass.de/impressum');
  });

  it('should point to the start page for its sections and for redirected URLs', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/#folgen');
    expect(canonical()).toBe('https://schnittstellenpass.de/');

    await router.navigateByUrl('/gibt-es-nicht');
    expect(canonical()).toBe('https://schnittstellenpass.de/');
  });

  it('should keep a single canonical link across navigations', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/impressum');
    await router.navigateByUrl('/');

    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});
