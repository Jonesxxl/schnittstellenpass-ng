/*
 * Live preview for the CMS editor: each section of the start page is shown
 * the way it looks on the website, next to the form (styles in preview.css).
 * Decap provides the globals CMS and h (React.createElement).
 */
/* global CMS, h */
(function () {
  if (typeof CMS === 'undefined') {
    return;
  }

  function value(entry, key) {
    const raw = entry.getIn(['data', key]);
    return typeof raw === 'string' ? raw.trim() : '';
  }

  // Lists of lines: plain strings, as the CMS saves them, or older { line } objects
  function lines(entry, key) {
    const raw = entry.getIn(['data', key]);
    const items = raw && raw.toJS ? raw.toJS() : [];
    return items.map(item => (typeof item === 'string' ? item : item && item.line) || '').map(line => line.trim()).filter(Boolean);
  }

  // Bundled pictures are referenced relative to the site root; uploads go through the CMS
  function picture(props, key, fallback) {
    const path = value(props.entry, key) || fallback;
    if (path.startsWith('assets/')) {
      return '/' + path;
    }
    const asset = props.getAsset(path);
    return asset ? asset.toString() : path;
  }

  // Empty fields: the website shows its built-in default text instead
  function text(content, className, tag) {
    return content
      ? h(tag || 'p', { className }, content)
      : h(tag || 'p', { className: className + ' sp-empty' }, 'Leer – auf der Website steht dann der bisherige Standardtext.');
  }

  function headline(items, className) {
    if (!items.length) {
      return text('', className, 'h2');
    }
    return h('h2', { className }, items.map((line, index) => h('span', { key: index, className: 'sp-line' }, line)));
  }

  function frame(children, note) {
    return h('div', { className: 'sp' },
      h('div', { className: 'sp-note' }, note || 'Vorschau · so erscheint dieser Bereich auf der Startseite'),
      children);
  }

  function Hero(props) {
    return frame(h('section', { className: 'sp-section sp-pitch' },
      h('div', { className: 'sp-eyebrow sp-forest' }, 'Der Fußball-Podcast · Seit 2021'),
      h('img', { className: 'sp-logo', src: '/assets/brand/logo-black.webp', alt: '' }),
      headline(lines(props.entry, 'titleLines'), 'sp-hero-title'),
      text(value(props.entry, 'subtitle'), 'sp-lead'),
      h('div', { className: 'sp-buttons' },
        h('span', { className: 'sp-button sp-button-dark' }, 'Spotify'),
        h('span', { className: 'sp-button' }, 'Apple Podcasts'),
        h('span', { className: 'sp-button' }, 'YouTube'))));
  }

  function Live(props) {
    return frame([
      h('div', { key: 'banner', className: 'sp-banner' },
        h('span', { className: 'sp-dot' }),
        text(value(props.entry, 'bannerText'), 'sp-banner-text', 'span'),
        h('span', { className: 'sp-banner-more' }, 'Mehr →')),
      h('section', { key: 'live', className: 'sp-section sp-ink' },
        h('div', { className: 'sp-eyebrow sp-on-dark' }, h('span', { className: 'sp-dot' }), value(props.entry, 'eyebrow') || '…'),
        headline(lines(props.entry, 'headlineLines'), 'sp-big-title'),
        text(value(props.entry, 'text'), 'sp-body sp-chalk'),
        h('div', { className: 'sp-box' },
          h('div', { className: 'sp-box-label' }, value(props.entry, 'jubileeLabel') || '…'),
          text(value(props.entry, 'jubileeText'), 'sp-box-text')),
        h('div', { className: 'sp-photo sp-photo-wide' }, h('img', { src: picture(props, 'photo', 'assets/live-event.webp'), alt: '' })))
    ], 'Vorschau · Banner ganz oben und Live-Bereich der Startseite');
  }

  function Episodes(props) {
    const rows = [1, 2, 3].map(number => h('div', { key: number, className: 'sp-row' },
      h('span', { className: 'sp-row-code' }, 'S4 · ' + (10 - number)),
      h('span', { className: 'sp-row-title' }, 'Folge von Spotify (automatisch)'),
      h('span', { className: 'sp-play' }, '▶')));
    return frame(h('section', { className: 'sp-section sp-paper' },
      h('div', { className: 'sp-head' },
        h('div', null,
          h('div', { className: 'sp-eyebrow sp-moss' }, value(props.entry, 'eyebrow') || '…'),
          text(value(props.entry, 'headline'), 'sp-big-title', 'h2')),
        text(value(props.entry, 'intro'), 'sp-intro')),
      h('div', { className: 'sp-rows' }, rows)));
  }

  function About(props) {
    const factsRaw = props.entry.getIn(['data', 'facts']);
    const facts = (factsRaw && factsRaw.toJS ? factsRaw.toJS() : []).filter(fact => fact && (fact.value || fact.label));
    return frame(h('section', { className: 'sp-section sp-pitch sp-about' },
      h('div', { className: 'sp-photo sp-photo-portrait' }, h('img', { src: picture(props, 'portrait', 'assets/host-portrait.webp'), alt: '' })),
      h('div', null,
        h('div', { className: 'sp-eyebrow sp-forest' }, 'Der Gastgeber'),
        text(value(props.entry, 'headline'), 'sp-big-title', 'h2'),
        text(value(props.entry, 'body'), 'sp-body'),
        facts.length
          ? h('div', { className: 'sp-board' },
            h('div', { className: 'sp-board-head' }, 'Der Podcast in Zahlen'),
            h('div', { className: 'sp-facts' }, facts.map((fact, index) => h('div', { key: index, className: 'sp-fact' },
              h('span', { className: 'sp-fact-value' }, fact.value || '…'),
              h('span', { className: 'sp-fact-label' }, fact.label || '')))))
          : null)));
  }

  function Social(props) {
    const tiles = [1, 2, 3, 4].map(number => h('div', { key: number, className: 'sp-tile' }, 'Instagram-Beitrag (automatisch)'));
    return frame(h('section', { className: 'sp-section sp-paper' },
      h('div', { className: 'sp-eyebrow sp-moss' }, value(props.entry, 'eyebrow') || '…'),
      text(value(props.entry, 'headline'), 'sp-big-title', 'h2'),
      h('div', { className: 'sp-tiles' }, tiles)));
  }

  CMS.registerPreviewStyle('/admin/preview.css');
  CMS.registerPreviewTemplate('home_hero', Hero);
  CMS.registerPreviewTemplate('live', Live);
  CMS.registerPreviewTemplate('episodes', Episodes);
  CMS.registerPreviewTemplate('about_intro', About);
  CMS.registerPreviewTemplate('social', Social);
})();
