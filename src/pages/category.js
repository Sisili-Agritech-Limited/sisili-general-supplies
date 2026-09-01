import { shot } from '../components.js';
import { breadcrumbJsonLd, detail, esc, waHref } from '../layout.js';

export default function category({ content, category: cat }) {
  const { site, categories } = content;
  const others = categories.filter((c) => c.slug !== cat.slug).slice(0, 4);
  const waMessage = `Hello Sisili, I would like a quotation for ${cat.name}. My list is:`;

  const facts = [
    { k: 'Typical pack sizes', v: cat.pack },
    { k: 'Indicative lead time', v: cat.lead },
    { k: 'Order size', v: cat.badge },
  ];

  const main = `
      <section class="hero">
        <div class="hero__grid">
          <div class="hero__copy">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a> /
              <a href="/supplies/">What we supply</a> /
              <span aria-current="page">${esc(cat.name)}</span>
            </nav>
            <p class="mono" style="font-size:clamp(22px,2.4vw,30px); color:var(--clay); margin-top:22px; line-height:1">
              ${esc(cat.no)}
            </p>
            <h1 class="h1" style="margin-top:12px; max-width:20ch">${esc(cat.name)}</h1>
            <p class="lead" style="margin-top:18px; max-width:52ch">${esc(cat.long)}</p>
            <div class="button-row mt-3">
              <a class="btn btn--clay" href="/quote/?category=${esc(cat.slug)}">Quote this line</a>
              <a class="btn btn--outline" href="/supplies/">All supply lines</a>
            </div>
          </div>
          <div class="hero__aside">
            ${shot(cat)}
          </div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="container">
          <div class="grid-rule cols-3">
            ${facts
              .map(
                (f) => `
            <div style="padding:20px 22px">
              <p class="eyebrow" style="font-size:10.5px; letter-spacing:0.12em">${esc(f.k)}</p>
              <p class="panel__title" style="line-height:1.3">${esc(f.v)}</p>
            </div>`,
              )
              .join('')}
          </div>

          <div class="split split--wide-first mt-3">
            <div style="min-width:0">
              <h2 class="h2" style="font-size:clamp(20px,2.4vw,28px)">
                What we commonly supply here
              </h2>
              <p class="small" style="margin:4px 0 18px">
                Indicative, not a catalogue. If your item isn’t listed, it is still sourceable.
              </p>

              <ul class="kv" style="margin:0; padding:0; list-style:none">
                ${cat.items
                  .map(
                    (item, i) => `
                <li class="kv__row" style="align-items:center; gap:14px">
                  <span class="mono" style="font-size:11.5px; color:var(--clay); flex:none">
                    ${String(i + 1).padStart(2, '0')}
                  </span>
                  <span style="font-family:var(--font-display); font-weight:600; font-size:16px; flex:1; min-width:0">
                    ${esc(item)}
                  </span>
                </li>`,
                  )
                  .join('')}
              </ul>
              <p style="background:var(--sand-deep); border:1px solid var(--border); border-top:none; padding:16px 18px; font-size:14.5px; color:var(--body); line-height:1.55">
                ${esc(cat.note)}
              </p>
            </div>

            <div style="min-width:0">
              <div class="panel panel--loam is-dark">
                <p class="eyebrow eyebrow--light">Quote this line</p>
                <h2 class="h2" style="font-size:clamp(18px,2vw,23px); margin:10px 0">
                  Send the items and quantities you need.
                </h2>
                <p style="font-size:15px; line-height:1.6; color:var(--loam-text); margin-bottom:18px">
                  The quote form opens with this category already selected — you only fill in items,
                  quantity and delivery point.
                </p>
                <a class="btn btn--clay btn--block" href="/quote/?category=${esc(cat.slug)}">
                  Request a quote
                </a>
                <p class="mono" style="font-size:12px; color:var(--loam-muted); margin-top:14px">
                  Or WhatsApp your list —
                  <a href="${waHref(site, waMessage)}" rel="noopener" style="color:var(--sand)">
                    ${detail(site.whatsapp.display)}
                  </a>
                </p>
              </div>

              <nav class="kv mt-2" aria-label="Other supply lines">
                <p class="kv__row kv__k" style="display:block">Other supply lines</p>
                ${others
                  .map(
                    (o) => `
                <a class="kv__row" href="/supplies/${o.slug}/" style="display:block">
                  <span style="font-family:var(--font-display); font-weight:600; font-size:15.5px; color:var(--ink); display:block">
                    ${esc(o.name)}
                  </span>
                  <span class="card__text" style="margin-top:3px; display:block">${esc(o.short)}</span>
                </a>`,
                  )
                  .join('')}
              </nav>
            </div>
          </div>
        </div>
      </section>`;

  return {
    title: `${cat.seoTitle} | ${site.name}`,
    description: cat.metaDescription,
    main,
    categoryName: cat.name,
    jsonLd: [
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'What we supply', url: '/supplies/' },
        { name: cat.name, url: `/supplies/${cat.slug}/` },
      ]),
    ],
  };
}
