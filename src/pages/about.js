import { breadcrumbJsonLd, detail, esc } from '../layout.js';

export default function about({ content }) {
  const { site, aboutFacts, commitments } = content;

  const main = `
      <section class="section section--sand section--rule">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <span aria-current="page">About</span>
          </nav>

          <div class="split split--wide-first mt-2">
            <div>
              <h1 class="h1" style="max-width:20ch">A supply company built around the buyer’s list.</h1>
              <div class="stack mt-2">
                <p class="lead" style="color:var(--body-strong)">
                  Sisili General Supplies is a Nairobi-based agricultural and general supply
                  company. We source and deliver farm inputs, tools, timber and safety equipment for
                  farms, agri-businesses, co-operatives, institutions and projects across Kenya.
                </p>
                <p class="lead" style="color:var(--body-strong)">
                  The company exists because sourcing is where buyers lose time and money. A farm
                  manager needing fertiliser, timber, sprayers and gumboots normally deals with four
                  suppliers, four negotiations, four invoices and four delivery dates. We take the
                  whole list, buy from established distributors and manufacturers, and deliver it as
                  one consolidated order.
                </p>
                <p class="body" style="color:var(--muted)">
                  We are early in our trading history and we say so plainly. Rather than claim a
                  record we do not yet have, we compete on the two things a buyer can verify
                  immediately: how quickly and how honestly we quote.
                </p>
              </div>
            </div>

            <div style="min-width:0">
              <div class="shot shot--4x3" style="border:1px solid var(--border)">
                <img src="/assets/images/store-interior.jpg"
                     alt="Inside the Sisili store, tools, tractors and fertiliser bags stocked for sale"
                     loading="lazy" decoding="async">
              </div>
              <dl class="kv" style="border-top:none; margin:0">
                ${aboutFacts
                  .map(
                    (f) => `
                <div class="kv__row">
                  <dt class="kv__k">${esc(f.k)}</dt>
                  <dd class="kv__v" style="margin:0">${detail(f.v)}</dd>
                </div>`,
                  )
                  .join('')}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--loam is-dark" data-reveal>
        <div class="container">
          <p class="eyebrow eyebrow--light">How we work</p>
          <h2 class="h2 mt-1" style="font-size:clamp(22px,3vw,36px); max-width:26ch">
            Four commitments, not a mission statement.
          </h2>
          <div class="steps mt-3" style="border-top-color:var(--loam-line)">
            ${commitments
              .map(
                (c) => `
            <div class="step" style="border-right-color:var(--loam-line)">
              <h3 class="h3">${esc(c.t)}</h3>
              <p class="step__body" style="color:var(--loam-text); margin-top:10px">${esc(c.b)}</p>
            </div>`,
              )
              .join('')}
          </div>
        </div>
      </section>

      <section class="section section--sand section--rule-top" data-reveal>
        <div class="container">
          <div class="grid-rule cols-3">
            <div class="panel">
              <p class="eyebrow" style="font-size:10.5px">Client feedback</p>
              <p class="panel__title" style="font-size:19px; margin-top:10px">
                Coming soon
              </p>
              <p class="panel__text">
                Reserved for a real, attributable quote from a client, with name and organisation.
                Nothing placed here until then.
              </p>
            </div>
            <div class="panel">
              <p class="eyebrow" style="font-size:10.5px">Clients served</p>
              <p class="panel__title" style="font-size:19px; margin-top:10px">
                Coming soon
              </p>
              <p class="panel__text">
                Logos appear only with written permission from the client. Until then, this block
                stays empty by design.
              </p>
            </div>
            <div class="panel panel--sand">
              <p class="eyebrow" style="font-size:10.5px">Company documents</p>
              <p class="panel__title" style="font-size:19px; margin-top:10px">
                Profile &amp; registration on request
              </p>
              <p class="panel__text" style="margin-bottom:14px">
                Certificate of registration, KRA PIN and company profile are sent with any quotation
                on request.
              </p>
              <a class="link-action" href="/contact/">Ask for our documents →</a>
            </div>
          </div>
        </div>
      </section>`;

  return {
    title: `About ${site.name} | Agricultural Supply Company, Nairobi`,
    description:
      'Sisili General Supplies is a Nairobi-based agricultural and general supply company serving ' +
      'farms, co-operatives, institutions and projects across Kenya. Company facts, registration ' +
      'details, coverage and how we work.',
    main,
    jsonLd: [
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about/' },
      ]),
    ],
  };
}
