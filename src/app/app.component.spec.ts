import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'schnittstellenpass' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('schnittstellenpass');
  });

  it('should render the site header navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-site-header nav')).toBeTruthy();
  });

  it('should render the site footer with the Instagram contact and the legal links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('app-site-footer footer a'));
    expect(links.map(link => link.getAttribute('href'))).toEqual(['https://www.instagram.com/schnittstellenpass/', '/impressum', '/datenschutz']);
  });

  it('should move focus to the main content via the skip link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const main = document.createElement('main');
    compiled.appendChild(main);

    const skipLink = compiled.querySelector('app-site-header a') as HTMLAnchorElement;
    expect(skipLink.textContent).toContain('Zum Inhalt springen');
    skipLink.click();

    expect(document.activeElement).toBe(main);
  });

  it('should render a router outlet for the routed pages', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
