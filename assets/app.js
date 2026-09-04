/**
 * Sisili General Supplies — client behaviour.
 *
 * Everything here is an enhancement. With JavaScript disabled the site still
 * navigates, the accordions still open, and both forms still submit as plain
 * POSTs to their configured endpoint.
 */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const config = (() => {
    const el = $('#site-config');
    if (!el) return {};
    try {
      return JSON.parse(el.textContent);
    } catch {
      return {};
    }
  })();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- *
   * Mobile menu
   * ---------------------------------------------------------------- */

  function initMenu() {
    const toggle = $('[data-menu-toggle]');
    const sheet = $('#menu');
    if (!toggle || !sheet) return;

    const setOpen = (open) => {
      sheet.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setOpen(sheet.dataset.open !== 'true'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sheet.dataset.open === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Leaving mobile widths should never strand the sheet open.
    window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------------------------------------------------------------- *
   * Reveal on scroll — one pass, opacity + rise, then done
   * ---------------------------------------------------------------- */

  function initReveal() {
    const targets = $$('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));

    // Landing straight on a URL fragment — mysite.com/#contact from a shared
    // link or bookmark — makes the browser jump the scroll position before
    // this script's own paint, skipping every section above it past the
    // observer in one frame; a person who then scrolls back up would find
    // them stuck invisible. A double rAF runs this after that initial jump
    // has settled, so anything already at or above the fold gets revealed
    // without waiting to be scrolled past a second time. Sections still
    // below the fold are untouched, left for the normal scroll-triggered
    // reveal as the visitor scrolls down.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        targets.forEach((el) => {
          if (el.getBoundingClientRect().top > window.innerHeight) return;
          el.classList.add('is-revealed');
          observer.unobserve(el);
        });
      }),
    );
  }

  /* ---------------------------------------------------------------- *
   * Footer lists collapse on mobile, stay open above 640px
   * ---------------------------------------------------------------- */

  function initFooterGroups() {
    const groups = $$('.footer__group');
    if (!groups.length) return;

    const wide = window.matchMedia('(min-width: 640px)');
    const sync = () => groups.forEach((g) => (g.open = wide.matches));

    sync();
    wide.addEventListener('change', sync);
  }

  /* ---------------------------------------------------------------- *
   * Shared form helpers
   * ---------------------------------------------------------------- */

  const value = (el) => (el && el.value ? el.value.trim() : '');

  /** True once the honeypot field is filled in — no real visitor ever sees it. */
  const isSpam = (form) => Boolean(value(form.querySelector('[name="company_website"]')));

  /** Build a WhatsApp deep link, or null when no number is configured. */
  function whatsappLink(text) {
    if (!config.whatsapp) return null;
    return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  /** Build a mailto: link, or null when no address is configured. */
  function mailtoLink(subject, body) {
    if (!config.email) return null;
    return `mailto:${config.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  /**
   * POST a form to the configured endpoint.
   * Resolves with the parsed JSON body when the server returns one.
   */
  async function postForm(form) {
    const response = await fetch(config.formEndpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Submission failed (${response.status})`);
    return response.json().catch(() => ({}));
  }

  /* ---------------------------------------------------------------- *
   * Quote form
   * ---------------------------------------------------------------- */

  function initQuoteForm() {
    const form = $('[data-quote-form]');
    if (!form) return;

    const steps = $$('[data-step]', form);
    const chips = $$('[data-step-chip]');
    const backBtn = $('[data-quote-back]', form);
    const nextBtn = $('[data-quote-next]', form);
    const counter = $('[data-step-counter]', form);
    const errorBox = $('[data-form-error]', form);
    const success = $('[data-quote-success]');
    const itemList = $('[data-item-list]', form);
    const addBtn = $('[data-item-add]', form);
    const fileInput = $('[data-file-input]', form);
    const dropzone = $('[data-dropzone]', form);

    const TOTAL = steps.length;
    let current = 1;

    /* -- step navigation -- */

    function showStep(n) {
      current = Math.min(Math.max(n, 1), TOTAL);

      steps.forEach((el) => {
        const isCurrent = Number(el.dataset.step) === current;
        el.hidden = !isCurrent;
        // Spacing above steps 2 and 3 only matters when they stack un-stepped.
        el.style.marginTop = '0';
      });

      chips.forEach((chip) => {
        const n2 = Number(chip.dataset.stepChip);
        chip.dataset.state = n2 === current ? 'current' : n2 < current ? 'done' : 'todo';
      });

      backBtn.hidden = current === 1;
      nextBtn.textContent = current === TOTAL ? 'Submit request' : 'Continue';
      if (counter) counter.textContent = `Step ${current} of ${TOTAL} · `;
      clearError();
    }

    function clearError() {
      errorBox.innerHTML = '';
    }

    function showError(message, focusTarget) {
      errorBox.innerHTML = `<div class="form-error">${message}</div>`;
      if (focusTarget) focusTarget.focus();
      else errorBox.scrollIntoView({ block: 'nearest' });
    }

    /* -- items -- */

    const itemRows = () => $$('[data-item-row]', itemList);

    /** Rows the buyer actually filled in. */
    const filledItems = () =>
      itemRows()
        .map((row) => ({
          name: value($('[data-item-name]', row)),
          qty: value($('[data-item-qty]', row)),
          unit: value($('[data-item-unit]', row)),
        }))
        .filter((item) => item.name);

    /** Keep labels, ids and label/input pairing correct after add or remove. */
    function renumberItems() {
      itemRows().forEach((row, i) => {
        const n = i + 1;
        $('[data-item-label]', row).textContent = `Item ${String(n).padStart(2, '0')}`;

        [
          ['[data-item-name]', `item-name-${n}`],
          ['[data-item-qty]', `item-qty-${n}`],
          ['[data-item-unit]', `item-unit-${n}`],
        ].forEach(([sel, id]) => {
          const field = $(sel, row);
          const label = row.querySelector(`label[for="${field.id}"]`);
          field.id = id;
          if (label) label.setAttribute('for', id);
        });
      });

      // With a single row left there is nothing to remove down to.
      const rows = itemRows();
      rows.forEach((row) => {
        $('[data-item-remove]', row).hidden = rows.length === 1;
      });
    }

    addBtn?.addEventListener('click', () => {
      const template = itemRows()[0];
      const clone = template.cloneNode(true);

      $$('input, select', clone).forEach((field) => {
        if (field.tagName === 'SELECT') field.selectedIndex = 0;
        else field.value = '';
      });

      itemList.appendChild(clone);
      renumberItems();
      updateSummary();
      $('[data-item-name]', clone).focus();
    });

    itemList.addEventListener('click', (e) => {
      const remove = e.target.closest('[data-item-remove]');
      if (!remove) return;
      if (itemRows().length === 1) return;
      remove.closest('[data-item-row]').remove();
      renumberItems();
      updateSummary();
    });

    /* -- attachments -- */

    const fileLabel = $('[data-file-label]', form);
    const defaultFileLabel = fileLabel ? fileLabel.innerHTML : '';

    function syncFiles() {
      if (!fileLabel || !fileInput) return;
      const files = Array.from(fileInput.files || []);
      fileLabel.innerHTML = files.length
        ? `${files.length} file${files.length > 1 ? 's' : ''} attached — ${files
            .map((f) => f.name)
            .join(', ')}`
        : defaultFileLabel;
    }

    fileInput?.addEventListener('change', () => {
      syncFiles();
      clearError();
    });

    if (dropzone && fileInput) {
      ['dragenter', 'dragover'].forEach((type) =>
        dropzone.addEventListener(type, (e) => {
          e.preventDefault();
          dropzone.dataset.dragging = 'true';
        }),
      );

      ['dragleave', 'drop'].forEach((type) =>
        dropzone.addEventListener(type, (e) => {
          e.preventDefault();
          dropzone.dataset.dragging = 'false';
        }),
      );

      dropzone.addEventListener('drop', (e) => {
        if (!e.dataTransfer?.files?.length) return;
        fileInput.files = e.dataTransfer.files;
        syncFiles();
      });
    }

    /* -- live summary rail -- */

    const out = (key) => $(`[data-summary-out="${key}"]`);
    const pickedCategories = () =>
      $$('[data-category-chips] input:checked', form).map((el) => el.value);

    function updateSummary() {
      const items = filledItems();
      const categories = pickedCategories();

      const title = $('[data-summary-title]');
      if (title) {
        title.textContent = items.length
          ? `${items.length} item${items.length === 1 ? '' : 's'} listed`
          : 'Nothing listed yet';
      }

      out('items').textContent = items.length
        ? items.map((i) => (i.qty ? `${i.qty} ${i.unit} ` : '') + i.name).join(', ')
        : 'No items added yet';

      out('categories').textContent = categories.length ? categories.join(', ') : 'Not selected';
      out('location').textContent = value($('[data-summary="location"]', form)) || '—';
      out('needed').textContent = value($('[data-summary="needed"]', form)) || '—';
      out('contact').textContent =
        [
          value($('[data-summary="name"]', form)),
          value($('[data-summary="phone"]', form)),
          value($('[data-summary="email"]', form)),
        ]
          .filter(Boolean)
          .join(' · ') || '—';
    }

    form.addEventListener('input', updateSummary);
    form.addEventListener('change', updateSummary);

    /* -- validation -- */

    function validate(step) {
      if (step === 1) {
        const hasItems = filledItems().length > 0;
        const hasFile = Boolean(fileInput?.files?.length);
        if (!hasItems && !hasFile) {
          showError(
            'Add at least one item — or upload your list — before continuing.',
            $('[data-item-name]', form),
          );
          return false;
        }
      }

      if (step === 2) {
        const location = $('[data-summary="location"]', form);
        if (!value(location)) {
          showError(
            'Add your delivery location so we can quote the full landed price.',
            location,
          );
          return false;
        }
      }

      if (step === 3) {
        const name = $('[data-summary="name"]', form);
        const phone = $('[data-summary="phone"]', form);
        if (!value(name)) {
          showError('Add your name so we know who the quotation is for.', name);
          return false;
        }
        if (!value(phone)) {
          showError('Add a phone or WhatsApp number so we can reach you.', phone);
          return false;
        }
        const email = $('[data-summary="email"]', form);
        if (value(email) && !email.checkValidity()) {
          showError('That email address doesn’t look right — check it and try again.', email);
          return false;
        }
      }

      clearError();
      return true;
    }

    /* -- request text, used for the WhatsApp / email handoff -- */

    function requestText() {
      const items = filledItems();
      const field = (name) => value(form.querySelector(`[name="${name}"]`));
      const lines = ['Quotation request — Sisili General Supplies', ''];

      lines.push('Items:');
      lines.push(
        ...(items.length
          ? items.map((i) => `- ${i.qty ? `${i.qty} ${i.unit} ` : ''}${i.name}`)
          : ['- (see attached list)']),
      );

      const categories = pickedCategories();
      if (categories.length) lines.push('', `Supply lines: ${categories.join(', ')}`);

      lines.push('');
      lines.push(`Deliver to: ${field('location') || '—'}`);
      lines.push(`Needed by: ${field('needed_by') || '—'}`);
      lines.push(`Delivery or collection: ${field('fulfilment') || '—'}`);
      if (field('notes')) lines.push(`Notes: ${field('notes')}`);

      lines.push('');
      lines.push(`Name: ${field('name')}`);
      if (field('organisation')) lines.push(`Organisation: ${field('organisation')}`);
      lines.push(`Phone: ${field('phone')}`);
      if (field('email')) lines.push(`Email: ${field('email')}`);

      return lines.join('\n');
    }

    /* -- success & handoff -- */

    const successTitle = $('[data-success-title]', success);
    const successBody = $('[data-success-body]', success);
    const successFacts = $('[data-success-facts]', success);
    const successActions = $('[data-success-actions]', success);

    const fact = (label, val, clay = false) => `
      <div>
        <div class="eyebrow" style="font-size:10.5px">${label}</div>
        <strong${clay ? ' class="is-clay"' : ''}>${val}</strong>
      </div>`;

    function reveal(node) {
      form.hidden = true;
      $('[data-step-chips]')?.setAttribute('hidden', '');
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (node) successActions.innerHTML = node;
      else successActions.innerHTML = '';
    }

    /** The server accepted the request. */
    function showSubmitted(result) {
      const items = filledItems().length;
      const email = value($('[data-summary="email"]', form));

      successTitle.textContent = 'Your request is with our sourcing desk.';
      successBody.textContent =
        'We’ll come back with an itemised quotation within 24 working hours.' +
        (result.reference ? ' Keep this reference for follow-up on phone or WhatsApp.' : '');

      successFacts.innerHTML = [
        result.reference ? fact('Reference', result.reference, true) : '',
        fact('Items', String(items || '—')),
        email ? fact('Copy sent to', email) : '',
      ]
        .filter(Boolean)
        .join('');

      reveal('');
    }

    /**
     * No endpoint is configured (or it failed). Rather than pretend the
     * request was received, hand the finished list to WhatsApp or email.
     */
    function showHandoff(reason) {
      const text = requestText();
      const wa = whatsappLink(text);
      const mail = mailtoLink('Quotation request', text);

      successTitle.textContent = 'Your list is ready to send.';
      successBody.textContent =
        reason ||
        'This site isn’t connected to a mailbox yet, so send the list below straight to us — ' +
          'it is already filled in for you.';

      successFacts.innerHTML = fact('Items', String(filledItems().length || '—'));

      const buttons = [
        wa ? `<a class="btn btn--clay" href="${wa}" rel="noopener">Send on WhatsApp</a>` : '',
        mail ? `<a class="btn btn--loam" href="${mail}">Send by email</a>` : '',
        `<button class="btn btn--outline" type="button" data-copy-request>Copy the list</button>`,
      ]
        .filter(Boolean)
        .join('');

      reveal(`
        <div class="button-row mt-2">${buttons}</div>
        <pre class="mono" style="white-space:pre-wrap; background:var(--surface); border:1px solid var(--border); padding:18px; margin-top:18px; font-size:13.5px; line-height:1.6; overflow-x:auto">${text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')}</pre>`);

      $('[data-copy-request]', success)?.addEventListener('click', async (e) => {
        try {
          await navigator.clipboard.writeText(text);
          e.target.textContent = 'Copied';
        } catch {
          e.target.textContent = 'Press Ctrl+C to copy';
        }
      });
    }

    /* -- submission -- */

    async function submit() {
      if (!validate(1)) {
        showStep(1);
        validate(1);
        return;
      }

      // Silently pretend success — a real visitor never fills this field, so
      // there's nothing to explain and nothing worth alerting a bot to.
      if (isSpam(form)) {
        showSubmitted({});
        return;
      }

      if (!config.formEndpoint) {
        showHandoff();
        return;
      }

      nextBtn.disabled = true;
      nextBtn.textContent = 'Sending…';

      try {
        showSubmitted(await postForm(form));
      } catch {
        showHandoff(
          'We couldn’t reach our server just now. Nothing is lost — send the list below ' +
            'directly and we’ll pick it up from there.',
        );
      } finally {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Submit request';
      }
    }

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validate(current)) return;
      if (current < TOTAL) showStep(current + 1);
      else submit();
    });

    backBtn.addEventListener('click', () => showStep(current - 1));
    form.addEventListener('submit', (e) => e.preventDefault());

    $('[data-quote-reset]')?.addEventListener('click', () => {
      form.reset();
      itemRows()
        .slice(1)
        .forEach((row) => row.remove());
      renumberItems();
      syncFiles();
      updateSummary();
      success.hidden = true;
      $('[data-step-chips]')?.removeAttribute('hidden');
      form.hidden = false;
      showStep(1);
      form.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });

    /* -- category pre-fill from /supplies/<slug>/ -- */

    const wanted = new URLSearchParams(location.search).get('category');
    if (wanted) {
      const chip = $(`[data-category-chips] input[data-slug="${CSS.escape(wanted)}"]`, form);
      if (chip) chip.checked = true;
    }

    renumberItems();
    updateSummary();
    showStep(1);
  }

  /* ---------------------------------------------------------------- *
   * Contact page enquiry form
   * ---------------------------------------------------------------- */

  function initEnquiryForm() {
    const form = $('[data-enquiry-form]');
    if (!form) return;

    const status = $('[data-form-status]', form);
    const submitBtn = $('button[type="submit"]', form);

    const say = (message, tone = 'ok') => {
      status.innerHTML =
        tone === 'err'
          ? `<div class="form-error" style="margin-top:0">${message}</div>`
          : `<p class="small" style="color:var(--ok)">${message}</p>`;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = $('#enq-name', form);
      const reply = $('#enq-reply', form);
      const question = $('#enq-question', form);

      if (!value(name)) return say('Add your name so we know who is asking.', 'err'), name.focus();
      if (!value(reply)) return say('Add a phone number or email so we can reply.', 'err'), reply.focus();
      if (!value(question)) return say('Let us know what you’d like to ask.', 'err'), question.focus();

      // Silently pretend success — a real visitor never fills this field, so
      // there's nothing to explain and nothing worth alerting a bot to.
      if (isSpam(form)) {
        form.reset();
        say('Thank you — we’ve got your question and will reply during working hours.');
        return;
      }

      const body = `Enquiry from ${value(name)}\nReply to: ${value(reply)}\n\n${value(question)}`;

      if (!config.formEndpoint) {
        const wa = whatsappLink(body);
        const mail = mailtoLink('Website enquiry', body);
        const link = wa || mail;
        if (link) {
          window.open(link, wa ? '_blank' : '_self');
          say('Opening your message — send it and we’ll reply during working hours.');
        } else {
          say('This form isn’t connected yet. Please call or WhatsApp us instead.', 'err');
        }
        return;
      }

      submitBtn.disabled = true;
      try {
        await postForm(form);
        form.reset();
        say('Thank you — we’ve got your question and will reply during working hours.');
      } catch {
        say('That didn’t send. Please call or WhatsApp us instead.', 'err');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------------------------------------------------------------- */

  initMenu();
  initReveal();
  initFooterGroups();
  initQuoteForm();
  initEnquiryForm();
})();
