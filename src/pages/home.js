import {
  categoryTile,
  contactButtons,
  contactRows,
  faqAccordion,
  quoteCta,
  stepsBlock,
} from '../components.js';
import { detail, esc, faqJsonLd, waHref } from '../layout.js';

export default function home({ content }) {
  const { site, categories, capabilities, steps, reasons, industries, faqs } = content;

  const main = `
      <!-- HERO -->
      <section class="hero">
        <div class="hero__grid">
          <div class="hero__copy">
            <p class="eyebrow eyebrow--clay">Agricultural &amp; general supply · Nairobi</p>
            <h1 class="h1">One order. Everything the farm runs on.</h1>
            <p class="lead">
              Fertilisers, agrochemicals, farm tools, timber and safety gear — sourced across
              suppliers, quoted on one document, delivered to your gate. Send us your list and we
              handle the rest.
            </p>
            <div class="button-row hero__cta">
              <a class="btn btn--clay" href="/quote/">Request a quote</a>
              <a class="btn btn--outline" href="/supplies/">See what we supply</a>
            </div>
            <p class="mono" style="font-size:12.5px; color:var(--muted); margin-top:18px">
              Or send your list on WhatsApp —
              <a href="${waHref(site, 'Hello Sisili, I would like a quotation. My list is:')}" rel="noopener">${detail(
                site.whatsapp.display,
              )}</a>
            </p>
          </div>
          <div class="hero__aside">
            <img src="/assets/images/hero-loading.jpg"
                 alt="Staff loading fertiliser bags and tools onto a pickup at the Sisili yard"
                 loading="eager" fetchpriority="high" decoding="async">
            <span class="hero__steps" aria-hidden="true"><i></i><i></i><i></i></span>
          </div>
        </div>
      </section>

      <!-- CAPABILITY STRIP -->
      <section class="capability is-dark">
        <div class="capability__grid">
          ${capabilities
            .map(
              (c) => `
          <div class="capability__item">
            <p class="eyebrow">${esc(c.label)}</p>
            <strong>${esc(c.value)}</strong>
          </div>`,
            )
            .join('')}
        </div>
      </section>

      <!-- 01 WHAT WE SUPPLY -->
      <section class="section section--sand section--rule" data-reveal>
        <div class="container">
          <div class="section-head section-head--rule">
            <div>
              <p class="eyebrow">01 — What we supply</p>
              <h2 class="h2">Nine supply lines. One quotation.</h2>
            </div>
            <a class="link-action" href="/supplies/">All categories →</a>
          </div>

          <div class="grid-rule cols-4 mt-3">
            ${categories.map(categoryTile).join('')}
          </div>
        </div>
      </section>

      <!-- 02 HOW IT WORKS -->
      <section class="section section--ink is-dark" id="how" data-reveal>
        <div class="container">
          <p class="eyebrow eyebrow--light">02 — How it works</p>
          <h2 class="h2 mt-1" style="max-width:24ch">From your list to your gate in four steps.</h2>
          <p class="lead" style="color:#9aa09a; margin:6px 0 34px; max-width:60ch">
            No account, no minimum, no walking between suppliers. Every stage ends with something
            in writing.
          </p>
          ${stepsBlock(steps, 'dark')}
        </div>
      </section>

      <!-- 03 WHY BUYERS USE US -->
      <section class="section section--sand section--rule" data-reveal>
        <div class="container">
          <p class="eyebrow">03 — Why buyers use us</p>
          <h2 class="h2 mt-1" style="max-width:28ch">Procurement without the phone calls.</h2>

          <div class="grid-rule cols-3 reasons__desktop mt-3">
            ${reasons
              .map(
                (r) => `
            <div class="reason">
              <div class="reason__head">
                <span class="reason__mark" aria-hidden="true"><i></i><i></i><i></i></span>
                <h3 class="h3">${esc(r.title)}</h3>
              </div>
              <p class="reason__body">${esc(r.body)}</p>
            </div>`,
              )
              .join('')}
          </div>

          <div class="reasons__mobile mt-3">
            <div class="accordion">
              ${reasons
                .map(
                  (r, i) => `
              <details class="accordion__item"${i === 0 ? ' open' : ''}>
                <summary>${esc(r.title)}</summary>
                <div class="accordion__body">${esc(r.body)}</div>
              </details>`,
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- 04 WHO WE SUPPLY -->
      <section class="section section--sand-deep section--rule" data-reveal>
        <div class="container">
          <p class="eyebrow">04 — Who we supply</p>
          <h2 class="h2 mt-1" style="font-size:clamp(22px,2.8vw,32px)">
            Order sizes from one crate to a full lorry.
          </h2>
          <div class="rail-wrap mt-2">
            <ul class="rail" style="margin:0; padding:0; list-style:none">
              ${industries
                .map(
                  (i) => `
              <li>
                <span class="card__no">${esc(i.no)}</span>
                <span class="card__title" style="font-size:15.5px; display:block">${esc(i.name)}</span>
                <span class="card__text" style="font-size:13px">${esc(i.note)}</span>
              </li>`,
                )
                .join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- 05 ABOUT -->
      <section class="section section--sand section--rule" data-reveal>
        <div class="container split split--wide-first">
          <div>
            <p class="eyebrow">05 — About Sisili</p>
            <h2 class="h2 mt-1" style="max-width:24ch">A supply company built around the buyer’s list.</h2>
            <div class="stack mt-2">
              <p class="body" style="color:var(--body-strong)">
                Sisili General Supplies is a Nairobi-based supply and procurement company serving
                farms, agri-businesses, co-operatives, institutions and projects across Kenya. We buy
                from established distributors and manufacturers, consolidate the order, and deliver
                it complete.
              </p>
              <p class="body" style="color:var(--body-strong)">
                We exist because sourcing is where time and money leak: a farm manager needing
                fertiliser, timber, sprayers and gumboots normally deals with four suppliers, four
                invoices and four delivery dates. We take the whole list.
              </p>
              <p class="small">
                Registered in Kenya · ${detail(site.registration.number)} ·
                KRA PIN ${detail(site.registration.kraPin)} ·
                Physical store and store-room at ${detail(site.address.display)}.
              </p>
              <p><a class="link-action" href="/about/">More about the company →</a></p>
            </div>
          </div>

          <div class="grid-rule" style="align-self:start; grid-template-columns:1fr">
            <div class="panel">
              <p class="eyebrow">What we commit to</p>
              <p class="panel__title">Written quotation within 24 hours</p>
              <p class="panel__text">
                Itemised, with unit prices, pack sizes, delivery cost and validity period.
              </p>
            </div>
            <div class="panel">
              <p class="eyebrow">Documentation</p>
              <p class="panel__title">Delivery notes &amp; invoices as standard</p>
              <p class="panel__text">
                LPO-friendly paperwork for schools, NGOs and institutional accounts.
              </p>
            </div>
            <div class="panel panel--loam is-dark">
              <p class="eyebrow eyebrow--light">Testimonials</p>
              <p class="panel__title">[CLIENT TESTIMONIAL — to be added]</p>
              <p class="panel__text">
                Placeholder held until real, attributable client feedback exists. Nothing invented
                here.
              </p>
            </div>
          </div>
        </div>
      </section>

${quoteCta()}

      <!-- 06 CONTACT -->
      <section class="section section--sand section--rule-top" id="contact" data-reveal>
        <div class="container">
          <div class="grid-rule cols-2">
            <div class="panel">
              <p class="eyebrow">06 — Contact</p>
              <h2 class="h2 mt-1" style="font-size:clamp(22px,2.6vw,30px)">Talk to us directly</h2>
              ${contactRows(site)}
              <div class="mt-2">
                ${contactButtons(site, 'Hello Sisili, I would like a quotation. My list is:')}
              </div>
            </div>

            <div class="panel panel--sand">
              <p class="eyebrow">Common questions</p>
              <div class="mt-1">
                ${faqAccordion(faqs)}
              </div>
              <p class="mt-2">
                <a class="link-action" href="/contact/">Full contact details and directions →</a>
              </p>
            </div>
          </div>
        </div>
      </section>`;

  return {
    title: `${site.name} | Farm Tools, Fertilisers & Agricultural Supplies in Nairobi`,
    description:
      'Nairobi agricultural and general supply company. Fertilisers, agrochemicals, seed, farm ' +
      'tools, timber and safety gear on one quotation, delivered to your gate. Itemised quote ' +
      'within 24 hours.',
    main,
    jsonLd: [faqJsonLd(faqs)],
  };
}
