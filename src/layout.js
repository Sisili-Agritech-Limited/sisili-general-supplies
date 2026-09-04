/**
 * Document shell, header, footer and the small helpers every page shares.
 */

import { isPlaceholder } from './content.js';

/* ------------------------------------------------------------------ *
 * Escaping & placeholder handling
 * ------------------------------------------------------------------ */

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for interpolation into HTML text or a quoted attribute. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c]);

/**
 * Render a business detail. Values still written as [PLACEHOLDER] in
 * src/content.js are never shown to a visitor — an honest fallback renders
 * instead, so neither fabricated data nor an internal editing note ever
 * reaches the live page.
 */
export function detail(value, fallback = 'Available on request.') {
  return isPlaceholder(value) ? esc(fallback) : esc(value);
}

/** A filled value, or null when it is still a placeholder. */
const filled = (value) => (isPlaceholder(value) || !value ? null : value);

/* ------------------------------------------------------------------ *
 * Contact links
 * ------------------------------------------------------------------ */

/** tel: link, or /contact/ while the number is unset. */
export const telHref = (site) => {
  const raw = filled(site.phone.raw);
  return raw ? `tel:${raw.replace(/\s+/g, '')}` : '/contact/';
};

/** mailto: link, or /contact/ while the address is unset. */
export const mailHref = (site) => {
  const raw = filled(site.email.raw);
  return raw ? `mailto:${raw}` : '/contact/';
};

/**
 * wa.me link, optionally pre-filled with a message — the spec asks category
 * pages to hand WhatsApp the category the visitor was looking at.
 */
export function waHref(site, message) {
  const raw = filled(site.whatsapp.raw);
  if (!raw) return '/contact/';
  const digits = raw.replace(/\D/g, '');
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}

/**
 * The handful of values app.js needs at runtime. Emitted as inert JSON rather
 * than executable script. Placeholders become null so the client can tell an
 * unconfigured channel from a real one.
 */
function runtimeConfig(site) {
  const whatsapp = filled(site.whatsapp.raw);
  return {
    whatsapp: whatsapp ? whatsapp.replace(/\D/g, '') : null,
    email: filled(site.email.raw),
    formEndpoint: site.formEndpoint || null,
  };
}

/* ------------------------------------------------------------------ *
 * Structured data
 * ------------------------------------------------------------------ */

/**
 * LocalBusiness JSON-LD. Only filled fields are emitted — a placeholder must
 * never reach structured data, where it would read as a factual claim.
 */
function businessJsonLd(content) {
  const { site } = content;
  const origin = filled(site.origin) ?? '';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'Country', name: 'Kenya' },
    ],
    knowsAbout: content.categories.map((c) => c.name),
  };

  if (origin) {
    data.url = `${origin}/`;
    data['@id'] = `${origin}/#business`;
  }

  const phone = filled(site.phone.raw);
  if (phone) data.telephone = phone;

  const email = filled(site.email.raw);
  if (email) data.email = email;

  const street = filled(site.address.street);
  const postalCode = filled(site.address.postalCode);
  if (street || postalCode) {
    data.address = {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
      ...(street ? { streetAddress: street } : {}),
      ...(postalCode ? { postalCode } : {}),
    };
  }

  const hours = site.hours.schema.filter((h) => filled(h));
  if (hours.length) data.openingHours = hours;

  return data;
}

/** FAQPage JSON-LD from the shared FAQ list. */
export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** BreadcrumbList JSON-LD from [{ name, url }] pairs. */
export function breadcrumbJsonLd(site, trail) {
  const origin = filled(site.origin) ?? '';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(origin ? { item: `${origin}${item.url}` } : {}),
    })),
  };
}

const jsonLdScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

const logoMark = (modifier = '') => `
  <span class="mark ${modifier}" aria-hidden="true">
    <span class="mark__bars"><i></i><i></i><i></i></span>
  </span>`;

function renderHeader(content, url) {
  const { site, nav } = content;
  const current = (href) => (href === url ? ' aria-current="page"' : '');

  const links = nav
    .map((item) => `<a href="${item.url}"${current(item.url)}>${esc(item.label)}</a>`)
    .join('\n          ');

  const sheetLinks = nav
    .map(
      (item) =>
        `<a class="sheet__link" href="${item.url}"${current(item.url)}>${esc(item.label)}</a>`,
    )
    .join('\n        ');

  return `
  <header class="header">
    <div class="container header__inner">
      <a class="brand" href="/">
        ${logoMark()}
        <span>
          <span class="brand__name">SISILI</span>
          <span class="brand__sub">GENERAL SUPPLIES</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
          ${links}
      </nav>

      <div class="header__actions">
        <div class="header__phone">
          <span class="eyebrow">Call or WhatsApp</span>
          <strong>${detail(site.phone.display)}</strong>
        </div>
        <a class="header__call" href="${telHref(site)}" aria-label="Call ${esc(site.name)}">CALL</a>
        <a class="btn btn--clay" href="/quote/">Request a quote</a>
        <button class="header__toggle" type="button" aria-expanded="false" aria-controls="menu"
                data-menu-toggle aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <div class="sheet" id="menu" data-open="false">
        ${sheetLinks}
      <div class="sheet__foot">
        <a class="btn btn--clay btn--block" href="/quote/">Request a quote</a>
        <p class="small mono" style="text-align:center">
          ${detail(site.phone.display)} · ${detail(site.hours.display)}
        </p>
      </div>
    </div>
  </header>`;
}

/* ------------------------------------------------------------------ *
 * Footer & mobile action bar
 * ------------------------------------------------------------------ */

function renderFooter(content) {
  const { site, nav, categories } = content;

  const pageLinks = nav
    .map((item) => `<a href="${item.url}">${esc(item.label)}</a>`)
    .join('\n            ');

  const supplyLinks = categories
    .slice(0, 5)
    .map((c) => `<a href="/supplies/${c.slug}/">${esc(c.name)}</a>`)
    .join('\n            ');

  const social = site.social
    .map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`)
    .join('');

  return `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__brand">
            ${logoMark('mark--outline')}
            <span class="brand__name">SISILI</span>
          </div>
          <p>${esc(site.description)}</p>
        </div>

        <details class="footer__group" open>
          <summary class="footer__title">Pages</summary>
          <div class="footer__links">
            ${pageLinks}
          </div>
        </details>

        <details class="footer__group" open>
          <summary class="footer__title">Supply lines</summary>
          <div class="footer__links">
            ${supplyLinks}
          </div>
        </details>

        <div>
          <p class="footer__title">Contact</p>
          <div class="footer__contact">
            <a href="${telHref(site)}"><span class="kv__k" style="margin-right:6px; color:var(--ink-muted)">Phone</span>${detail(site.phone.display)}</a>
            <a href="${waHref(site)}" rel="noopener"><span class="kv__k" style="margin-right:6px; color:var(--ink-muted)">WhatsApp</span>${detail(site.whatsapp.display)}</a>
            <a href="${mailHref(site)}">${detail(site.email.display)}</a>
            <span>${detail(site.address.display)}</span>
            <span>${detail(site.hours.display)}</span>
          </div>
        </div>
      </div>

      <div class="footer__legal">
        <span>© ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</span>
        <span style="display:flex; gap:18px; flex-wrap:wrap">${social}</span>
      </div>
    </div>
  </footer>`;
}

/** Sticky mobile bar: quote plus WhatsApp, per the responsive spec. */
function renderActionBar(content, categoryName) {
  const { site } = content;
  const message = categoryName
    ? `Hello Sisili, I would like a quotation for ${categoryName}.`
    : 'Hello Sisili, I would like a quotation. My list is:';

  return `
  <div class="action-bar">
    <a class="btn btn--clay" href="/quote/">Request a quote</a>
    <a class="btn btn--loam" href="${waHref(site, message)}" rel="noopener">WhatsApp</a>
  </div>`;
}

/* ------------------------------------------------------------------ *
 * Document
 * ------------------------------------------------------------------ */

/**
 * @param {object} page
 * @param {string} page.title        <title> and og:title
 * @param {string} page.description  meta description
 * @param {string} page.main         page markup, inserted inside <main>
 * @param {object[]} [page.jsonLd]   extra structured-data blocks
 * @param {string} [page.categoryName] pre-fills the mobile WhatsApp link
 * @param {string} [page.image]      og:image / twitter:image override; defaults to site.ogImage
 */
export function renderDocument({
  title,
  description,
  main,
  jsonLd = [],
  categoryName = null,
  hideActionBar = false,
  image = null,
  content,
  url,
}) {
  const { site } = content;
  const origin = filled(site.origin);
  const canonical = origin ? `${origin}${url}` : null;
  const blocks = [businessJsonLd(content), ...jsonLd].map(jsonLdScript).join('\n  ');

  // WhatsApp and other unfurlers need an absolute URL — without a real
  // origin yet, there's no correct absolute URL to emit, so the tag is
  // left out entirely rather than shipping a broken relative one.
  const imagePath = image || filled(site.ogImage);
  const ogImage = origin && imagePath ? `${origin}${imagePath}` : null;

  return `<!doctype html>
<html lang="en-KE">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  ${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ''}
  <meta name="theme-color" content="#0F3A31">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">

  <!-- Gates the scroll-reveal styles, so content is never hidden without JS. -->
  <script>document.documentElement.classList.add('js');</script>

  ${blocks}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
${renderHeader(content, url)}

  <main id="main">
${main}
  </main>

${hideActionBar ? '' : renderActionBar(content, categoryName)}
${renderFooter(content)}

  <script type="application/json" id="site-config">${JSON.stringify(runtimeConfig(site)).replace(
    /</g,
    '\\u003c',
  )}</script>
  <script src="/assets/app.js" defer></script>
</body>
</html>
`;
}

/** Static 404 page. */
export function renderNotFound({ content }) {
  const main = `
    <section class="section section--sand">
      <div class="container">
        <p class="eyebrow eyebrow--clay">Error 404</p>
        <h1 class="h1 mt-1">That page isn’t here.</h1>
        <p class="lead mt-1">
          The page may have moved. Start from what we supply, or send us your list directly.
        </p>
        <div class="button-row mt-3">
          <a class="btn btn--clay" href="/supplies/">See what we supply</a>
          <a class="btn btn--outline" href="/">Back to home</a>
          <a class="btn btn--outline" href="/contact/">Contact us</a>
        </div>
      </div>
    </section>`;

  return renderDocument({
    title: `Page not found | ${content.site.name}`,
    description:
      'The page you were looking for could not be found. Browse what Sisili General Supplies ' +
      'stocks, or send us your list for a quotation.',
    main,
    content,
    url: '/404.html',
  });
}
