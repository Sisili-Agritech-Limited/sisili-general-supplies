import { categoryCard } from '../components.js';
import { breadcrumbJsonLd, esc, waHref } from '../layout.js';

export default function supplies({ content }) {
  const { site, categories } = content;

  const main = `
      <section class="section section--loam is-dark">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <span aria-current="page">What we supply</span>
          </nav>
          <h1 class="h1 mt-1" style="max-width:20ch">Nine supply lines, one point of contact.</h1>
          <p class="lead" style="color:var(--loam-text); margin-top:18px; max-width:60ch">
            These are the lines we source regularly. If your list crosses several of them — or
            includes something not shown — send it anyway; special orders are normal work for us.
          </p>
          <div class="button-row mt-3">
            <a class="btn btn--clay" href="/quote/">Request a quote</a>
            <a class="btn btn--outline-light"
               href="${waHref(site, 'Hello Sisili, I would like a quotation. My list is:')}"
               rel="noopener">Send list on WhatsApp</a>
          </div>
        </div>
      </section>

      <section class="section section--sand">
        <div class="container">
          <div class="grid-rule cols-3">
            ${categories.map(categoryCard).join('')}
          </div>
        </div>
      </section>`;

  return {
    title: `What We Supply — Farm Inputs, Tools, Timber & Agrochemicals | ${esc(site.shortName)}`,
    description:
      'The nine supply lines Sisili sources regularly — fertilisers, agrochemicals, certified ' +
      'seed, farm tools, irrigation, timber, animal feeds, safety workwear and special orders. ' +
      'One list, one quotation.',
    main,
    jsonLd: [
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'What we supply', url: '/supplies/' },
      ]),
    ],
  };
}
