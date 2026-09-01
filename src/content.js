/**
 * All site content and business details in one place.
 *
 * ─────────────────────────────────────────────────────────────────────
 * BEFORE LAUNCH: replace every value written in [SQUARE BRACKETS].
 * Anything still bracketed renders on the page as a visible placeholder
 * and its links stay inert, so nothing fabricated ever ships. See
 * README.md for the full checklist.
 * ─────────────────────────────────────────────────────────────────────
 */

/** A value is an unfilled placeholder while it still looks like [THIS]. */
export const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]$/.test(value.trim());

/* ------------------------------------------------------------------ *
 * Business details (NAP — name, address, phone)
 * ------------------------------------------------------------------ */

const site = {
  name: 'Sisili General Supplies',
  shortName: 'Sisili',
  legalName: 'Sisili General Supplies',

  /** Production domain, no trailing slash. Used for canonical URLs, sitemap and JSON-LD. */
  origin: '[https://www.example.co.ke]',

  description:
    'Agricultural and general supply company in Nairobi. One order for fertilisers, ' +
    'agrochemicals, farm tools, timber and safety gear — quoted, consolidated and delivered.',

  /**
   * Contact channels. `display` is what a visitor reads; `raw` is the machine
   * form used for tel:/mailto:/wa.me links. Fill both.
   */
  phone: { display: '+254 722 391593', raw: '+254722391593' },
  whatsapp: { display: '+254 722 391593', raw: '254722391593' },
  email: { display: 'info@sisili.co.ke', raw: 'info@sisili.co.ke' },

  address: {
    display: 'Nairobi',
    street: '[STREET / BUILDING]',
    locality: 'Nairobi',
    region: 'Nairobi County',
    country: 'KE',
    postalCode: '[POSTAL CODE]',
    /** Google Maps directions link for the Contact page. */
    directionsUrl: '[https://maps.google.com/?q=...]',
  },

  hours: {
    display: 'Mon–Fri 8:00am–5:00pm, Sat 8:00am–1:00pm',
    /** schema.org openingHours strings, e.g. 'Mo-Fr 08:00-17:00'. */
    schema: ['Mo-Fr 08:00-17:00', 'Sa 08:00-13:00'],
  },

  registration: {
    number: '[REGISTRATION NUMBER]',
    kraPin: '[KRA PIN]',
  },

  paymentTerms: '[TERMS — e.g. on delivery, 14 days for LPO accounts]',

  /**
   * Where the quote and enquiry forms POST. Leave empty to run without a
   * backend: the form then hands the completed list to WhatsApp or email
   * instead of silently pretending to submit. See README.md.
   */
  formEndpoint: '',

  social: [
    // { label: 'Facebook', url: 'https://facebook.com/...' },
  ],
};

/* ------------------------------------------------------------------ *
 * Supply lines
 * ------------------------------------------------------------------ */

const categories = [
  {
    slug: 'fertilisers-soil-inputs',
    name: 'Fertilisers & soil inputs',
    short: 'Planting, top-dressing, foliar, lime.',
    long:
      'Planting and top-dressing fertilisers, foliar feeds, agricultural lime and soil ' +
      'conditioners in farm and bulk quantities.',
    items: ['DAP', 'CAN', 'NPK blends', 'Urea', 'SA', 'Foliar feeds', 'Agricultural lime'],
    badge: 'Bulk & retail',
    shotAlt: 'Stacked 50kg fertiliser bags in the store with labels facing out',
    pack: '50kg bags · 25kg · 1kg foliar packs',
    lead: 'Same-day to 2 days in Nairobi',
    note:
      'State the crop and acreage if you are unsure of the blend — we will quote options ' +
      'rather than guess.',
    seoTitle: 'Fertiliser & Soil Input Supplier in Kenya',
    metaDescription:
      'Bulk and retail fertiliser supplier in Nairobi — DAP, CAN, NPK blends, urea, foliar ' +
      'feeds and agricultural lime. Itemised quotation within 24 hours, delivered to your gate.',
  },
  {
    slug: 'agrochemicals',
    name: 'Agrochemicals',
    short: 'Herbicides, pesticides, fungicides.',
    long:
      'Crop protection sourced from licensed distributors, supplied with original labels and ' +
      'batch details.',
    items: ['Herbicides', 'Insecticides', 'Fungicides', 'Acaricides', 'Adjuvants', 'Rodenticides'],
    badge: 'Licensed stock',
    shotAlt: 'Agrochemical bottles and sachets lined up with labels legible',
    pack: '1L · 5L · 20L · sachets',
    lead: '1–3 days depending on product',
    note:
      'Tell us the pest or weed and the crop; we quote the registered product rather than the ' +
      'nearest bottle.',
    seoTitle: 'Agrochemical Supplier in Nairobi — Herbicides, Pesticides & Fungicides',
    metaDescription:
      'Licensed agrochemical supplier in Nairobi. Herbicides, insecticides, fungicides and ' +
      'acaricides with original labels and batch details. Send your list for a written quotation.',
  },
  {
    slug: 'certified-seed-seedlings',
    name: 'Certified seed & seedlings',
    short: 'Cereals, legumes, vegetables, fodder.',
    long:
      'Certified seed from recognised seed companies, plus seedlings and planting material on ' +
      'order.',
    items: ['Maize', 'Beans', 'Vegetables', 'Fodder grasses', 'Cover crops'],
    badge: 'Seasonal',
    shotAlt: 'Certified seed packets and tins arranged on a bench',
    pack: '2kg · 10kg · 25kg tins',
    lead: 'Season-dependent — order early',
    note:
      'Availability tightens at the start of every planting season. Give us your acreage and ' +
      'target planting date.',
    seoTitle: 'Certified Seed & Seedling Supplier in Kenya',
    metaDescription:
      'Certified maize, bean, vegetable and fodder seed from recognised seed companies, ' +
      'supplied across Kenya. Order early for planting season — quotation within 24 hours.',
  },
  {
    slug: 'farm-tools-equipment',
    name: 'Farm tools & equipment',
    short: 'Hand tools, sprayers, small machinery.',
    long:
      'Everyday hand tools through to sprayers, pumps and small machinery, with spares where ' +
      'available.',
    items: [
      'Jembes',
      'Pangas',
      'Forks',
      'Knapsack sprayers',
      'Water pumps',
      'Wheelbarrows',
    ],
    badge: 'Any quantity',
    shotAlt: 'Jembes, pangas and secateurs laid out in a row on plywood',
    pack: 'Single pieces · dozens · team sets',
    lead: 'Same-day to 2 days',
    note:
      'For sprayers and pumps we quote two or three grades so you can weigh price against ' +
      'working life.',
    seoTitle: 'Farm Tools & Equipment Suppliers in Nairobi',
    metaDescription:
      'Farm tool suppliers in Nairobi — jembes, pangas, forks, knapsack sprayers, water pumps ' +
      'and wheelbarrows. Any quantity, no minimum order, delivered with an itemised invoice.',
  },
  {
    slug: 'irrigation-water',
    name: 'Irrigation & water',
    short: 'Pipes, fittings, tanks, drip lines.',
    long:
      'Irrigation and water-handling supplies sized to the plot, from drip kits to tanks and ' +
      'fittings.',
    items: ['HDPE pipe', 'Drip lines', 'Sprinklers', 'Tanks', 'Valves & fittings'],
    badge: 'Project sizing',
    shotAlt: 'Coiled HDPE irrigation pipe stacked beside valves and fittings',
    pack: 'Rolls · per metre · per fitting',
    lead: '2–5 days for project quantities',
    note:
      'Send plot size and water source; we quote a component list rather than leaving you to ' +
      'work out fittings.',
    seoTitle: 'Irrigation Equipment & Water Supplies — Nairobi & Upcountry',
    metaDescription:
      'Irrigation supplier in Kenya — HDPE pipe, drip lines, sprinklers, tanks, valves and ' +
      'fittings sized to your plot. Send plot size and water source for a full component quote.',
  },
  {
    slug: 'timber-building-supplies',
    name: 'Timber & building supplies',
    short: 'Timber, posts, roofing, fasteners.',
    long:
      'Timber, treated posts and general building materials for farm structures, stores and ' +
      'fencing.',
    items: ['Cypress timber', 'Treated posts', 'Iron sheets', 'Nails', 'Cement', 'Wire'],
    badge: 'Delivery by lorry',
    shotAlt: 'Cut ends of stacked cypress timber forming a repeating pattern',
    pack: 'Per piece · per bundle · per lorry load',
    lead: '2–4 days; transport quoted separately',
    note:
      'Give dimensions and quantity. Transport is priced as its own line so you can compare it ' +
      'honestly.',
    seoTitle: 'Timber & Building Supplies Supplier in Nairobi with Delivery',
    metaDescription:
      'Timber supplier in Nairobi with lorry delivery — cypress timber, treated fencing posts, ' +
      'iron sheets, cement, nails and wire for farm structures, stores and fencing.',
  },
  {
    slug: 'animal-feeds-vet-supplies',
    name: 'Animal feeds & vet supplies',
    short: 'Feeds, supplements, basic vet items.',
    long: 'Livestock feeds, mineral supplements and routine veterinary consumables on request.',
    items: [
      'Dairy meal',
      'Layers mash',
      'Mineral licks',
      'Salt blocks',
      'Syringes',
      'Dewormers',
    ],
    badge: 'On order',
    shotAlt: 'Stacked animal feed bags in the store room',
    pack: '70kg · 50kg bags · units',
    lead: '1–3 days',
    note:
      'Repeat monthly feed orders can be scheduled so you are not re-quoting the same list every ' +
      'month.',
    seoTitle: 'Animal Feeds & Veterinary Supplies — Nairobi Supplier',
    metaDescription:
      'Animal feed supplier in Nairobi — dairy meal, layers mash, mineral licks, salt blocks ' +
      'and routine vet consumables. Scheduled repeat orders for regular monthly supply.',
  },
  {
    slug: 'safety-workwear',
    name: 'Safety & workwear',
    short: 'PPE for spraying and site work.',
    long:
      'Protective equipment for spraying, handling and construction work, sized per team.',
    items: ['Overalls', 'Gumboots', 'Respirators', 'Gloves', 'Goggles', 'Helmets'],
    badge: 'Team sets',
    shotAlt: 'Gumboots, gloves and overalls arranged as a team safety set',
    pack: 'Per piece · per team set',
    lead: '1–3 days; branding adds 3–5 days',
    note:
      'Send sizes and headcount. Branded overalls are possible — allow extra days for printing.',
    seoTitle: 'Safety Equipment & Workwear Supplier in Nairobi — PPE',
    metaDescription:
      'PPE and workwear supplier in Nairobi — overalls, gumboots, respirators, gloves, goggles ' +
      'and helmets supplied as team sets. Branded overalls available on request.',
  },
  {
    slug: 'special-custom-orders',
    name: 'Special & custom orders',
    short: 'Anything not listed above.',
    long:
      'If it is not on this page, send the list anyway. We source non-standard and one-off items ' +
      'on request.',
    items: [
      'Office & cleaning supplies',
      'Spare parts',
      'Institutional items',
      'Imports on request',
    ],
    badge: 'Ask us',
    shotAlt: 'A handwritten supply list on a clipboard beside counted goods',
    pack: 'As specified',
    lead: 'Quoted per item after sourcing',
    note:
      'Describe the item as precisely as you can — a photo, part number or old label helps most.',
    seoTitle: 'Special & Custom Order Sourcing — Kenya',
    metaDescription:
      'Procurement and sourcing for non-standard items in Kenya — office and cleaning supplies, ' +
      'spare parts, institutional items and imports on request. Send your list for a quotation.',
  },
].map((category, index) => ({ ...category, no: String(index + 1).padStart(2, '0') }));

/* ------------------------------------------------------------------ *
 * Home page sections
 * ------------------------------------------------------------------ */

const capabilities = [
  { label: 'Quotation turnaround', value: 'Itemised quote within 24 hours' },
  { label: 'Order size', value: 'One crate to a full lorry' },
  { label: 'Coverage', value: 'Nairobi and upcountry delivery' },
  { label: 'Paperwork', value: 'Delivery notes, invoices, LPO terms' },
];

const steps = [
  {
    no: '01',
    title: 'Send your list',
    body:
      'Type items into the quote form, paste an existing list, upload an LPO or BQ, or send a ' +
      'photo of a handwritten note on WhatsApp.',
    meta: '2 minutes',
  },
  {
    no: '02',
    title: 'We source and price it',
    body:
      'We check availability with our suppliers, confirm specifications with you where needed, ' +
      'and return one itemised quotation.',
    meta: 'Within 24 hours',
  },
  {
    no: '03',
    title: 'You approve',
    body:
      'Approve by email, WhatsApp or LPO. Payment terms are agreed in writing before we dispatch ' +
      '— no surprises on delivery day.',
    meta: 'Written terms',
  },
  {
    no: '04',
    title: 'We deliver, complete',
    body:
      'Goods arrive on the agreed date with a delivery note and invoice. Short-supplied items are ' +
      'flagged before dispatch, not after.',
    meta: 'Agreed date',
  },
];

const reasons = [
  {
    title: 'One list, one invoice',
    body:
      'Fertiliser, timber, sprayers and gumboots normally mean four suppliers and four invoices. ' +
      'We consolidate the whole order into one quotation, one delivery and one paper trail.',
  },
  {
    title: 'Sourcing is our job, not yours',
    body:
      'You don’t need to know which distributor holds stock this week. Tell us the item and the ' +
      'quantity; finding it is what we do.',
  },
  {
    title: 'Priced to be compared',
    body:
      'Quotations show unit price, pack size, quantity and delivery separately, so procurement ' +
      'can compare us line by line against any other supplier.',
  },
  {
    title: 'Order sizes that suit you',
    body:
      'No minimum order. A single knapsack sprayer for a smallholder gets the same quotation ' +
      'format as a 300-bag fertiliser order for an estate.',
  },
  {
    title: 'Delivery dates we hold to',
    body:
      'We commit to a date only after confirming stock. If part of an order will be late, you ' +
      'hear it before dispatch — while you can still decide.',
  },
  {
    title: 'Documentation institutions need',
    body:
      'Quotations, delivery notes, invoices and registration details in the format schools, NGOs ' +
      'and county buyers require for their files.',
  },
];

const industries = [
  { no: '01', name: 'Farms & estates', note: 'Inputs and tools per season' },
  { no: '02', name: 'Agri-businesses', note: 'Repeat supply arrangements' },
  { no: '03', name: 'Co-operatives', note: 'Bulk buying for members' },
  { no: '04', name: 'Schools & institutions', note: 'LPO-based procurement' },
  { no: '05', name: 'NGOs & projects', note: 'Programme supply lists' },
  { no: '06', name: 'Contractors', note: 'Site materials and PPE' },
  { no: '07', name: 'Households', note: 'Small orders welcome' },
];

const faqs = [
  {
    q: 'Do you deliver outside Nairobi?',
    a:
      'Yes — upcountry delivery is quoted per location and load, shown as a separate line on ' +
      'your quotation.',
  },
  {
    q: 'Is there a minimum order?',
    a: 'No. Small orders and single items are quoted the same way as bulk orders.',
  },
  {
    q: 'Can you work with an LPO?',
    a: 'Yes. Send the LPO with your request and we’ll respond with matching documentation.',
  },
  {
    q: 'What if an item isn’t on your list?',
    a: 'Send it anyway. Special orders are routine — we source against your specification.',
  },
];

/* ------------------------------------------------------------------ *
 * How it works / About
 * ------------------------------------------------------------------ */

const terms = [
  {
    k: 'Quotation validity',
    v: '14 days from issue unless stated otherwise — input prices move.',
  },
  { k: 'Lead times', v: 'Confirmed per line once stock is checked, not estimated before.' },
  { k: 'Part deliveries', v: 'Flagged before dispatch, with your approval, never after.' },
  { k: 'Returns', v: 'Wrong-supplied items collected and replaced at our cost.' },
];

const commitments = [
  {
    t: 'We quote what we can actually supply',
    b:
      'If an item is unavailable or the price has moved, we say so on the quotation instead of ' +
      'substituting quietly.',
  },
  {
    t: 'We separate goods from transport',
    b:
      'Delivery is its own line, so you can see exactly what the logistics cost and compare us ' +
      'line by line.',
  },
  {
    t: 'We keep the paper trail',
    b:
      'Quotation, delivery note and invoice for every order — the documents institutional buyers ' +
      'need on file.',
  },
  {
    t: 'We do not invent credentials',
    b:
      'Everything on this site is verifiable. No borrowed client logos, no fabricated years of ' +
      'trading.',
  },
];

const aboutFacts = [
  { k: 'Registered name', v: site.legalName },
  { k: 'Registration no.', v: site.registration.number },
  { k: 'KRA PIN', v: site.registration.kraPin },
  { k: 'Store & office', v: site.address.display },
  { k: 'Delivery coverage', v: 'Nairobi metro and upcountry on quotation' },
  { k: 'Payment terms', v: site.paymentTerms },
];

/* ------------------------------------------------------------------ *
 * Navigation
 * ------------------------------------------------------------------ */

const nav = [
  { label: 'Home', url: '/' },
  { label: 'What we supply', url: '/supplies/' },
  { label: 'How it works', url: '/how-it-works/' },
  { label: 'About', url: '/about/' },
  { label: 'Contact', url: '/contact/' },
];

/** Units offered on the quote form's item rows. */
const units = ['bags', 'pieces', 'litres', 'kg', 'cartons', 'metres'];

export default {
  site,
  nav,
  categories,
  capabilities,
  steps,
  reasons,
  industries,
  faqs,
  terms,
  commitments,
  aboutFacts,
  units,
};
