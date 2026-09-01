import { contactButtons, contactRows } from '../components.js';
import { breadcrumbJsonLd, detail, esc } from '../layout.js';
import { isPlaceholder } from '../content.js';

export default function contact({ content }) {
  const { site } = content;
  const directions = isPlaceholder(site.address.directionsUrl) ? null : site.address.directionsUrl;

  const main = `
      <section class="section--sand" style="padding:clamp(32px,5vw,64px) 0 clamp(20px,3vw,32px)">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <span aria-current="page">Contact</span>
          </nav>
          <h1 class="h1 mt-2" style="max-width:18ch">Talk to us directly.</h1>
          <p class="lead" style="margin-top:16px; max-width:54ch">
            Fastest route is a call or WhatsApp during working hours. For a priced list, use the
            quote form — it captures everything we need in one go.
          </p>
        </div>
      </section>

      <section class="section--sand" style="padding:0 0 var(--section-y)">
        <div class="container">
          <div class="grid-rule cols-2">
            <div class="panel">
              ${contactButtons(site, 'Hello Sisili, I have a question:')}
              <div class="mt-2">
                ${contactRows(site)}
              </div>

              <div class="shot shot--placeholder mt-2" style="height:150px" role="img"
                   aria-label="Map showing the Sisili General Supplies store location">
                Static map image<br>+ Directions link
              </div>
              ${
                directions
                  ? `<p class="mt-1"><a class="link-action" href="${esc(directions)}" rel="noopener">Get directions →</a></p>`
                  : `<p class="small mt-1">Directions link: ${detail(site.address.directionsUrl)}</p>`
              }
            </div>

            <div class="panel panel--sand">
              <p class="eyebrow">General enquiry</p>
              <h2 class="h2 mt-1" style="font-size:clamp(20px,2.4vw,26px)">
                Not a quote — just a question
              </h2>
              <p class="small" style="margin:6px 0 20px; font-size:15px">
                Four fields. For anything priced, the quote form is faster for both of us.
              </p>

              <form class="field-grid" data-enquiry-form novalidate
                    action="${esc(site.formEndpoint || '')}" method="post">
                <p class="hp" aria-hidden="true">
                  <label>Leave this field empty
                    <input type="text" name="company_website" tabindex="-1" autocomplete="off">
                  </label>
                </p>

                <p class="field">
                  <label class="field__label" for="enq-name">Your name</label>
                  <input class="input" id="enq-name" name="name" type="text" required
                         autocomplete="name" placeholder="Full name">
                </p>
                <p class="field">
                  <label class="field__label" for="enq-reply">Phone or email</label>
                  <input class="input" id="enq-reply" name="reply_to" type="text" required
                         autocomplete="tel" placeholder="How we reply">
                </p>
                <p class="field field--full">
                  <label class="field__label" for="enq-question">Your question</label>
                  <textarea class="textarea" id="enq-question" name="question" required
                            placeholder="What would you like to know?"></textarea>
                </p>

                <div class="field--full">
                  <div data-form-status role="status" aria-live="polite"></div>
                  <button class="btn btn--clay btn--block mt-1" type="submit">Send enquiry</button>
                </div>
              </form>

              <div style="border-top:1px solid var(--border); margin-top:24px; padding-top:18px">
                <p class="eyebrow" style="font-size:10.5px">Need pricing instead?</p>
                <a class="link-action" href="/quote/" style="font-family:var(--font-display); font-weight:700; font-size:16px">
                  Go to the quote form →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>`;

  return {
    title: `Contact ${site.name} | Nairobi`,
    description:
      'Contact Sisili General Supplies in Nairobi — phone, WhatsApp, email, store location and ' +
      'business hours. Call for a fast answer, or send your list for a written quotation within ' +
      '24 hours.',
    main,
    jsonLd: [
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact/' },
      ]),
    ],
  };
}
