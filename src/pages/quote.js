import { breadcrumbJsonLd, detail, esc, telHref } from '../layout.js';

/**
 * The conversion page: a three-step request form.
 *
 * All three steps are rendered into the document and visible by default, so
 * the form still works as a plain POST with JavaScript disabled. app.js turns
 * it into a stepped flow, keeps the summary rail live, and handles submission.
 */
export default function quote({ content }) {
  const { site, categories, units } = content;

  const stepChips = ['Your items', 'Delivery', 'Your details']
    .map(
      (label, i) => `
            <span class="step-chip" data-step-chip="${i + 1}"
                  data-state="${i === 0 ? 'current' : 'todo'}">${i + 1}. ${esc(label)}</span>`,
    )
    .join('');

  const categoryChips = categories
    .map(
      (c) => `
                <label class="chip">
                  <input class="visually-hidden" type="checkbox" name="categories"
                         value="${esc(c.name)}" data-slug="${esc(c.slug)}">
                  ${esc(c.name)}
                </label>`,
    )
    .join('');

  const unitOptions = units
    .map((u) => `<option value="${esc(u)}">${esc(u)}</option>`)
    .join('');

  /** One item row. app.js clones this markup for "+ Add another item". */
  const itemRow = (index) => `
              <div class="item-card" data-item-row>
                <div class="item-card__head">
                  <span class="item-card__label" data-item-label>Item ${String(index).padStart(2, '0')}</span>
                  <button class="item-card__remove" type="button" data-item-remove>Remove</button>
                </div>
                <div class="item-card__grid">
                  <p class="field field--full" style="grid-column:1/-1">
                    <label class="field__label" for="item-name-${index}">Item / description</label>
                    <input class="input" id="item-name-${index}" name="item_name" type="text"
                           placeholder="e.g. DAP fertiliser 50kg" data-item-name>
                  </p>
                  <p class="field">
                    <label class="field__label" for="item-qty-${index}">Quantity</label>
                    <input class="input input--mono" id="item-qty-${index}" name="item_qty"
                           type="text" inputmode="numeric" placeholder="120" data-item-qty>
                  </p>
                  <p class="field">
                    <label class="field__label" for="item-unit-${index}">Unit</label>
                    <select class="select" id="item-unit-${index}" name="item_unit" data-item-unit>
                      ${unitOptions}
                    </select>
                  </p>
                </div>
              </div>`;

  const main = `
      <section class="section--sand section--rule" style="padding:clamp(28px,4vw,56px) 0 clamp(24px,3vw,40px)">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> / <span aria-current="page">Request a quote</span>
          </nav>
          <p class="eyebrow eyebrow--clay mt-2">Request a quote</p>
          <h1 class="h1 mt-1" style="max-width:22ch">Three steps. Two minutes.</h1>
          <p class="lead" style="margin-top:12px; max-width:56ch">
            Split into three short steps so nobody abandons a wall of fields on mobile — items
            first, delivery next, contact details last. Nothing is priced until we’ve checked stock
            with our suppliers.
          </p>
          <div class="chip-row mt-3" data-step-chips>${stepChips}
          </div>
        </div>
      </section>

      <!-- Shown after a successful submission -->
      <section class="section section--sand-deep" data-quote-success hidden tabindex="-1">
        <div class="container" style="max-width:820px">
          <p class="eyebrow" style="color:var(--ok)">Request received</p>
          <h2 class="h1 mt-1" style="font-size:clamp(26px,4vw,44px)" data-success-title>
            Your request is with our sourcing desk.
          </h2>
          <p class="lead mt-1" data-success-body>
            We’ll come back with an itemised quotation within 24 working hours.
          </p>
          <div class="ref-grid mt-2" data-success-facts></div>
          <div data-success-actions></div>
          <div class="button-row mt-3">
            <a class="btn btn--loam" href="/">Back to home</a>
            <button class="btn btn--outline" type="button" data-quote-reset>
              Start another request
            </button>
          </div>
        </div>
      </section>

      <form class="quote-layout" data-quote-form novalidate
            action="${esc(site.formEndpoint || '')}" method="post" enctype="multipart/form-data">
        <div class="quote-form">
          <p class="hp" aria-hidden="true">
            <label>Leave this field empty
              <input type="text" name="company_website" tabindex="-1" autocomplete="off">
            </label>
          </p>

          <!-- STEP 1 -->
          <fieldset data-step="1" style="border:none; margin:0; padding:0; min-width:0">
            <legend class="visually-hidden">Step 1 of 3 — what you need</legend>
            <h2 class="h2" style="font-size:clamp(20px,2.2vw,26px)">01 — What do you need?</h2>
            <p class="small" style="font-size:15.5px; margin:6px 0 22px">
              Add each item with a quantity. Rough descriptions are fine — we’ll confirm
              specifications before quoting.
            </p>

            <fieldset style="border:none; margin:0 0 22px; padding:0">
              <legend class="field__label" style="padding:0">Supply lines (optional)</legend>
              <div class="chip-row" data-category-chips>${categoryChips}
              </div>
            </fieldset>

            <div style="display:flex; flex-direction:column; gap:12px" data-item-list>
${itemRow(1)}
            </div>

            <button class="btn btn--dashed mt-1" type="button" data-item-add>
              + Add another item
            </button>
            <noscript>
              <p class="small mt-1">
                JavaScript is off, so extra item rows can’t be added. List any further items in
                “Anything we should know” below, or attach your list as a file.
              </p>
            </noscript>

            <div class="mt-2" style="background:var(--surface); border:1px solid var(--border); padding:18px">
              <p style="font-family:var(--font-display); font-weight:700; font-size:16px">
                Already have a list, LPO or BQ?
              </p>
              <p class="small" style="margin:6px 0 14px">
                Upload it instead of typing — PDF, Excel, Word or a clear photo, up to 10MB.
              </p>
              <label class="dropzone" data-dropzone>
                <input class="visually-hidden" type="file" name="attachment" data-file-input
                       accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp" multiple>
                <span class="dropzone__title">Drop file here</span>
                <span class="dropzone__hint" data-file-label>
                  or <u>browse files</u> · take a photo of a handwritten list
                </span>
              </label>
            </div>
          </fieldset>

          <!-- STEP 2 -->
          <fieldset data-step="2" style="border:none; margin:32px 0 0; padding:0; min-width:0">
            <legend class="visually-hidden">Step 2 of 3 — delivery</legend>
            <h2 class="h2" style="font-size:clamp(20px,2.2vw,26px)">02 — Where and when?</h2>
            <p class="small" style="font-size:15.5px; margin:6px 0 22px">
              Delivery cost depends on location and load, so this lets us quote the full landed
              price rather than goods only.
            </p>
            <div class="field-grid">
              <p class="field field--full">
                <label class="field__label" for="q-location">Delivery location</label>
                <input class="input" id="q-location" name="location" type="text" data-summary="location"
                       placeholder="Town / area, and a landmark if rural">
              </p>
              <p class="field">
                <label class="field__label" for="q-needed">Needed by</label>
                <input class="input" id="q-needed" name="needed_by" type="text" data-summary="needed"
                       placeholder="e.g. 30 Aug, or ‘as soon as possible’">
              </p>
              <p class="field">
                <label class="field__label" for="q-fulfilment">Delivery or collection</label>
                <select class="select" id="q-fulfilment" name="fulfilment">
                  <option>Deliver to my location</option>
                  <option>I’ll collect from your store</option>
                  <option>Advise me — whichever is cheaper</option>
                </select>
              </p>
              <p class="field field--full">
                <label class="field__label" for="q-notes">Anything we should know</label>
                <textarea class="textarea" id="q-notes" name="notes"
                          placeholder="Brands you prefer or must avoid, split deliveries, offloading, LPO or tender reference, payment terms"></textarea>
              </p>
            </div>
          </fieldset>

          <!-- STEP 3 -->
          <fieldset data-step="3" style="border:none; margin:32px 0 0; padding:0; min-width:0">
            <legend class="visually-hidden">Step 3 of 3 — your details</legend>
            <h2 class="h2" style="font-size:clamp(20px,2.2vw,26px)">03 — Who should we send it to?</h2>
            <p class="small" style="font-size:15.5px; margin:6px 0 22px">
              The quotation goes out on your name and organisation so it can go straight into your
              procurement file.
            </p>
            <div class="field-grid">
              <p class="field">
                <label class="field__label" for="q-name">Your name</label>
                <input class="input" id="q-name" name="name" type="text" required
                       autocomplete="name" data-summary="name" placeholder="Full name">
              </p>
              <p class="field">
                <label class="field__label" for="q-org">
                  Organisation <span class="optional">(optional)</span>
                </label>
                <input class="input" id="q-org" name="organisation" type="text"
                       autocomplete="organization" placeholder="Farm, company, school, NGO">
              </p>
              <p class="field">
                <label class="field__label" for="q-phone">Phone / WhatsApp</label>
                <input class="input input--mono" id="q-phone" name="phone" type="tel" required
                       autocomplete="tel" data-summary="phone" placeholder="07xx xxx xxx">
              </p>
              <p class="field">
                <label class="field__label" for="q-email">Email</label>
                <input class="input" id="q-email" name="email" type="email"
                       autocomplete="email" data-summary="email" placeholder="name@organisation.co.ke">
              </p>
              <label class="checkbox-row">
                <input type="checkbox" name="whatsapp_copy" value="yes">
                <span>
                  Send the quotation on WhatsApp as well as email — faster to approve on site.
                </span>
              </label>
            </div>
          </fieldset>

          <div data-form-error role="alert" aria-live="polite"></div>

          <div class="button-row mt-3">
            <button class="btn btn--outline" type="button" data-quote-back hidden
                    style="flex:0 1 140px">Back</button>
            <button class="btn btn--clay btn--grow" type="submit" data-quote-next>
              Submit request
            </button>
          </div>
          <p class="form-note">
            <span data-step-counter></span>Your details are used only to prepare this quotation.
          </p>
        </div>

        <!-- SUMMARY RAIL -->
        <aside class="quote-summary is-dark" aria-label="Your request so far">
          <div class="quote-summary__inner">
          <p class="eyebrow eyebrow--light">Your request so far</p>
          <p class="h2" style="font-size:clamp(18px,2vw,24px); margin:10px 0 18px"
             data-summary-title>Nothing listed yet</p>

          <div data-summary-rows>
            <div class="summary__row">
              <span class="summary__k">Items</span>
              <span class="summary__v" data-summary-out="items">No items added yet</span>
            </div>
            <div class="summary__row">
              <span class="summary__k">Categories</span>
              <span class="summary__v" data-summary-out="categories">Not selected</span>
            </div>
            <div class="summary__row">
              <span class="summary__k">Deliver to</span>
              <span class="summary__v" data-summary-out="location">—</span>
            </div>
            <div class="summary__row">
              <span class="summary__k">Needed by</span>
              <span class="summary__v" data-summary-out="needed">—</span>
            </div>
            <div class="summary__row">
              <span class="summary__k">Contact</span>
              <span class="summary__v" data-summary-out="contact">—</span>
            </div>
          </div>

          <div class="summary__block">
            <p class="eyebrow" style="color:var(--loam-muted)">What happens next</p>
            <ol>
              <li>We confirm specifications and check stock.</li>
              <li>Itemised quotation to you within 24 working hours.</li>
              <li>You approve; we deliver on the agreed date.</li>
            </ol>
          </div>

          <div class="summary__block" style="font-size:14.5px; line-height:1.6; color:var(--loam-text)">
            Prefer to talk? Call
            <a href="${telHref(site)}" class="mono" style="color:var(--sand)">${detail(site.phone.display)}</a>
            — ${detail(site.hours.display)}.
          </div>
          </div>
        </aside>
      </form>`;

  return {
    title: `Request a Quotation | ${site.name}`,
    description:
      'Send your supply list to Sisili General Supplies and get an itemised quotation within 24 ' +
      'hours. Three short steps, no account, no minimum order. Upload an existing list, LPO or BQ.',
    main,
    // The form's own Continue button is the CTA here — a sticky "Request a
    // quote" bar on the quote page would just cover fields.
    hideActionBar: true,
    jsonLd: [
      breadcrumbJsonLd(site, [
        { name: 'Home', url: '/' },
        { name: 'Request a quote', url: '/quote/' },
      ]),
    ],
  };
}
