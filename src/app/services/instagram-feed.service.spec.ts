import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InstagramFeedService, InstagramPost } from './instagram-feed.service';

describe('InstagramFeedService', () => {
  let service: InstagramFeedService;
  let httpMock: HttpTestingController;

  const post: InstagramPost = {
    id: '17900000000000001',
    permalink: 'https://www.instagram.com/p/abc/',
    caption: 'Neue Folge ist online',
    mediaType: 'IMAGE',
    timestamp: '2026-09-20T18:00:00+0000',
    image: '/.netlify/functions/instagram?image=17900000000000001'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(InstagramFeedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Fails if any unexpected request was made, e.g. directly to Instagram
  afterEach(() => httpMock.verify());

  it('should load the posts through the server-side proxy without credentials', () => {
    let posts: InstagramPost[] | undefined;
    service.getLatestPosts().subscribe(result => posts = result);

    const req = httpMock.expectOne('/.netlify/functions/instagram');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ posts: [post] });

    expect(posts).toEqual([post]);
  });

  it('should resolve to no posts when the proxy fails', () => {
    const consoleError = spyOn(console, 'error');
    let posts: InstagramPost[] | undefined;
    service.getLatestPosts().subscribe(result => posts = result);

    httpMock.expectOne('/.netlify/functions/instagram')
      .flush({ error: 'Instagram is not configured' }, { status: 503, statusText: 'Service Unavailable' });

    expect(posts).toEqual([]);
    expect(consoleError).toHaveBeenCalled();
  });
});
