import { faqAccordion, stepsBlock } from '../components.js';
import { breadcrumbJsonLd, esc, faqJsonLd } from '../layout.js';

export default function howItWorks({ content }) {
  const { site, steps, terms, faqs } = content;

  const main = `
      <section class="section section--ink is-dark">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <span aria-current="page">How it works</span>
          </nav>
          <h1 class="h1 mt-2" style="max-width:22ch">How we source, quote and deliver.</h1>
          <p class="lead" style="color:#9aa09a; margin-top:18px; max-width:62ch">
            Written for buyers who need to know exactly what they are dealing with before they
            commit an order — what happens at each stage, what you receive in writing, and where
            the risks sit.
          </p>
        </div>
      </section>

      <section class="section section--sand section--rule" data-reveal>
        <div class="container">
          ${stepsBlock(steps, 'light')}
        </div>
      </section>

      <section class="section section--sand-deep section--rule" data-reveal>
        <div class="container split">
          <div>
            <p class="eyebrow">Terms in plain language</p>
            <h2 class="h2 mt-1" style="font-size:clamp(22px,2.8vw,32px); max-width:24ch">
              What you can hold us to.
            </h2>
            <dl class="kv kv--stacked mt-2" style="background:var(--sand)">
              ${terms
                .map(
                  (t) => `
              <div class="kv__row">
                <dt class="kv__k">${esc(t.k)}</dt>
                <dd class="kv__v" style="margin:0">${esc(t.v)}</dd>
              </div>`,
                )
                .join('')}
            </dl>
          </div>

          <div>
            <p class="eyebrow">Questions buyers ask first</p>
            <h2 class="h2 mt-1" style="font-size:clamp(22px,2.8vw,32px); max-width:24ch">
              Before you send a list.
            </h2>
            <div class="mt-2">
              ${faqAccordion(faqs)}
            </div>
          </div>
        </div>
      </section>

      <section class="section section--clay" data-reveal>
        <div class="container split" style="align-items:center">
          <h2 class="h2" style="font-weight:800; max-width:22ch">
            Ready to test it with a real list?
          </h2>
          <div>
            <a class="btn btn--ink btn--block" href="/quote/">Request a quote</a>
          </div>
        </div>
      </section>`;

  return {
    title: `How We Source & Deliver | ${site.name}`,
    description:
      'How Sisili sources, quotes and delivers: send your list, we price it within 24 hours, you ' +
      'approve in writing, we deliver complete with a delivery note and invoice. Quotation ' +
      'validity, lead times and returns explained.',
    main,
    jsonLd: [
      faqJsonLd(faqs),
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'How it works', url: '/how-it-works/' },
      ]),
    ],
  };
}
