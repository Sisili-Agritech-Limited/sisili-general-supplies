/**
 * Markup fragments shared by more than one page.
 */

import { detail, esc, mailHref, telHref, waHref } from './layout.js';

/**
 * A category's photo, cropped to the given ratio. Every category's image
 * lives at /assets/images/<slug>.jpg — see assets/images/ and README.
 */
export const shot = (category, ratio = '4x3') => `
    <div class="shot shot--${ratio}">
      <img src="/assets/images/${esc(category.slug)}.jpg" alt="${esc(category.shotAlt)}"
           loading="lazy" decoding="async">
    </div>`;

/** Compact category tile for the home page teaser grid. */
export const categoryTile = (category) => `
        <a class="cat-tile" href="/supplies/${category.slug}/">
          ${shot(category)}
          <div class="cat-tile__body">
            <span class="card__no">${esc(category.no)}</span>
            <span class="card__title">${esc(category.name)}</span>
            <span class="card__text">${esc(category.short)}</span>
          </div>
        </a>`;

/** Full category card for /supplies/, with item list and a scoped quote link. */
export const categoryCard = (category) => `
        <article class="cat-card">
          <a href="/supplies/${category.slug}/" aria-label="${esc(category.name)}">
            ${shot(category, '16x9')}
          </a>
          <div class="cat-card__body">
            <span class="card__no">${esc(category.no)}</span>
            <h3 class="h3" style="margin:8px 0">
              <a href="/supplies/${category.slug}/">${esc(category.name)}</a>
            </h3>
            <p style="font-size:15px; line-height:1.55; color:var(--body)">${esc(category.long)}</p>
            <p class="cat-card__items">${esc(category.items.join(' · '))}</p>
            <div class="cat-card__foot">
              <span class="badge">${esc(category.badge)}</span>
              <a class="link-action" href="/quote/?category=${esc(category.slug)}">
                Quote this line →
              </a>
            </div>
          </div>
        </article>`;

/**
 * The four-step process block.
 * @param {'dark'|'light'} tone  dark sits on Ink, light on hairline cards
 */
export function stepsBlock(steps, tone = 'dark') {
  const cls = tone === 'light' ? 'step step--light' : 'step';
  const items = steps
    .map(
      (s) => `
          <div class="${cls}">
            <div class="step__no">${esc(s.no)}</div>
            <h3 class="step__title">${esc(s.title)}</h3>
            <p class="step__body">${esc(s.body)}</p>
            <p class="step__meta">${esc(s.meta)}</p>
          </div>`,
    )
    .join('');

  return tone === 'light'
    ? `<div class="grid-rule cols-4">${items}\n        </div>`
    : `<div class="steps">${items}\n        </div>`;
}

/** FAQ list as a native <details> accordion, first item open. */
export const faqAccordion = (faqs) => `
          <div class="accordion">
            ${faqs
              .map(
                (f, i) => `
            <details class="accordion__item"${i === 0 ? ' open' : ''}>
              <summary>${esc(f.q)}</summary>
              <div class="accordion__body">${esc(f.a)}</div>
            </details>`,
              )
              .join('')}
          </div>`;

/** Phone / WhatsApp / email / location / hours as labelled rows. */
export const contactRows = (site) => {
  const rows = [
    { label: 'Phone', value: site.phone.display, href: telHref(site) },
    { label: 'WhatsApp', value: site.whatsapp.display, href: waHref(site) },
    { label: 'Email', value: site.email.display, href: mailHref(site) },
    { label: 'Location', value: site.address.display },
    { label: 'Business hours', value: site.hours.display },
  ];

  return `
            <dl class="kv kv--stacked" style="border:none">
              ${rows
                .map(
                  (r) => `
              <div class="kv__row" style="padding-left:0; padding-right:0">
                <dt class="kv__k">${esc(r.label)}</dt>
                <dd class="kv__v" style="margin:0; font-family:var(--font-display); font-weight:600; font-size:16.5px">
                  ${r.href ? `<a href="${r.href}">${detail(r.value)}</a>` : detail(r.value)}
                </dd>
              </div>`,
                )
                .join('')}
            </dl>`;
};

/** Call / WhatsApp button pair. */
export const contactButtons = (site, message) => `
            <div class="button-row">
              <a class="btn btn--loam" style="flex:1 1 140px" href="${telHref(site)}">Call now</a>
              <a class="btn btn--outline" style="flex:1 1 140px" href="${waHref(site, message)}" rel="noopener">
                WhatsApp us
              </a>
            </div>`;

/** The clay conversion band that closes the home page. */
export const quoteCta = () => `
      <section class="section section--clay" data-reveal>
        <div class="container split split--wide-first" style="align-items:center">
          <div>
            <h2 class="h2" style="font-weight:800; max-width:22ch">
              Tell us what you need. We’ll handle the sourcing.
            </h2>
            <p class="lead" style="color:var(--clay-wash); margin-top:16px; max-width:46ch">
              Type your items, paste a list, or upload the LPO you already have. Two minutes on the
              form, priced back within 24 hours.
            </p>
          </div>
          <div style="display:flex; flex-direction:column; gap:12px">
            <a class="btn btn--ink btn--block" href="/quote/">Request a quote</a>
            <a class="btn btn--outline-light btn--block" href="/contact/">Contact us</a>
            <p class="mono" style="font-size:12.5px; color:var(--clay-wash); text-align:center">
              No account needed · No minimum order
            </p>
          </div>
        </div>
      </section>`;
