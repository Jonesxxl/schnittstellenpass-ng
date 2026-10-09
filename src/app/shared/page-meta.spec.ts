import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { providePageMeta } from './page-meta';
import { routes } from '../app.routes';

@Component({ template: '' })
class PageStubComponent {}

describe('providePageMeta', () => {
  let metas: HTMLMetaElement[];
  const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute('content');

  beforeEach(() => {
    metas = [['property', 'og:url'], ['name', 'description'], ['property', 'og:title'], ['property', 'og:description']].map(([attribute, value]) => {
      const element = document.createElement('meta');
      element.setAttribute(attribute, value);
      element.setAttribute('content', 'Standard aus index.html');
      return document.head.appendChild(element);
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageStubComponent, title: 'Start', data: { description: 'Über den Podcast' } },
          { path: 'impressum', component: PageStubComponent, title: 'Impressum', data: { description: 'Anbieter und Kontakt' } },
          { path: 'ohne-angaben', component: PageStubComponent },
          { path: '**', redirectTo: '' }
        ]),
        providePageMeta()
      ]
    });
  });

  afterEach(() => {
    metas.forEach(element => element.remove());
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

  it('should point to the page without anchor or query', async () => {
    await TestBed.inject(Router).navigateByUrl('/impressum?ref=footer#kontakt');

    expect(canonical()).toBe('https://schnittstellenpass.de/impressum');
    expect(meta('meta[property="og:url"]')).toBe('https://schnittstellenpass.de/impressum');
  });

  it('should take description and share title from the route', async () => {
    await TestBed.inject(Router).navigateByUrl('/impressum');

    expect(meta('meta[name="description"]')).toBe('Anbieter und Kontakt');
    expect(meta('meta[property="og:description"]')).toBe('Anbieter und Kontakt');
    expect(meta('meta[property="og:title"]')).toBe('Impressum');
  });

  it('should keep the defaults for a route without title and description', async () => {
    await TestBed.inject(Router).navigateByUrl('/ohne-angaben');

    expect(meta('meta[name="description"]')).toBe('Standard aus index.html');
    expect(meta('meta[property="og:title"]')).toBe('Standard aus index.html');
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

  it('should have a title and a description for every page of the site', () => {
    const pages = routes.filter(route => route.redirectTo === undefined);

    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(page.title).withContext(page.path!).toEqual(jasmine.any(String));
      expect(page.data?.['description']).withContext(page.path!).toEqual(jasmine.any(String));
    }
  });
});
