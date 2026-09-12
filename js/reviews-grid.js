/* ============================================================================
   Padma Shree Travels — <ReviewsGrid /> : ONE component, every landing page
   ============================================================================
   Usage on a page (that is the whole integration):

     <section data-reviews-grid data-page="agra-local-sightseeing"></section>
     ...
     <script src="../js/reviews-data.js"></script>
     <script src="../js/reviews-grid.js"></script>

   Behaviour
     * Renders EXACTLY the 9 reviews mapped to that page in reviews-data.js.
     * 3 columns desktop / 2 tablet / 1 mobile. Cards keep their natural height.
     * Long reviews clamp with a "Read more" toggle — the full original text is
       always in the DOM, never truncated at the data level.
     * If the pool is empty the whole section is REMOVED, so a page never ships
       an empty "What Our Travellers Say" heading.

   Visual language is the approved neo-brutalist template, unchanged:
   white card, thin dashed black border, small radius, no gradient, no blur
   shadow, Poppins, black text.
   ============================================================================ */

(function () {
  'use strict';

  const mounts = document.querySelectorAll('[data-reviews-grid]');
  if (!mounts.length || !window.PST_REVIEWS) return;

  /* ------------------------------- styles ------------------------------- */
  const CSS = `
  .gr-wrap{ background:#fff; padding:76px 20px 66px; }
  @media (min-width:640px){ .gr-wrap{ padding-left:32px; padding-right:32px; } }
  .gr-inner{ max-width:1400px; margin:0 auto; }
  .gr-head{ text-align:center; margin-bottom:36px; }
  .gr-head h2{
    font-weight:700; letter-spacing:-.01em; color:#000;
    font-size:20px; line-height:1.3;
  }
  @media (min-width:640px){ .gr-head h2{ font-size:24px; } }
  .gr-head p{ margin-top:8px; font-size:13px; color:#555; }

  .gr-grid{
    display:grid; gap:20px; align-items:start;
    grid-template-columns:1fr;
  }
  @media (min-width:640px){ .gr-grid{ grid-template-columns:repeat(2,1fr); } }
  @media (min-width:1024px){ .gr-grid{ grid-template-columns:repeat(3,1fr); gap:24px; } }

  .gr-card{
    background:#fff; border:2px dashed #111; border-radius:4px;
    padding:22px 22px 20px; align-self:start;
  }
  @media (min-width:1024px){ .gr-card{ padding:26px 26px 22px; } }

  .gr-top{ display:flex; align-items:flex-start; gap:11px; }
  .gr-avatar{
    flex:0 0 auto; width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff; letter-spacing:.02em;
    overflow:hidden;
  }
  .gr-avatar img{ width:100%; height:100%; object-fit:cover; display:block; }
  .gr-id{ min-width:0; flex:1 1 auto; }
  .gr-name{ font-size:13px; font-weight:700; color:#000; line-height:1.3; overflow-wrap:anywhere; }
  .gr-date{ flex:0 0 auto; font-size:11px; color:#6B7280; padding-top:2px; }

  /* Star row — filled tiles for the real rating, grey for the remainder. */
  .gr-stars{ display:flex; gap:2px; margin-top:14px; }
  .gr-star{
    width:19px; height:19px; border-radius:1px;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; line-height:1; color:#fff; background:#22C55E;
  }
  .gr-star.is-empty{ background:#D1D5DB; }

  .gr-text{ margin-top:13px; font-size:13px; line-height:1.6; color:#333; overflow-wrap:anywhere; }
  .gr-text p{ margin:0; }
  .gr-text p + p{ margin-top:11px; }
  .gr-text.is-clamped{
    display:-webkit-box; -webkit-line-clamp:9; -webkit-box-orient:vertical;
    overflow:hidden;
  }
  .gr-more{
    margin-top:9px; font-size:12px; font-weight:700; color:#15803D;
    background:none; border:0; padding:0; cursor:pointer;
    text-decoration:underline; text-underline-offset:2px;
  }
  .gr-more:hover{ color:#000; }

  .gr-foot{
    margin-top:16px; padding-top:12px; border-top:1px solid #E5E7EB;
    display:flex; align-items:center; gap:6px; font-size:11px; color:#6B7280;
  }
  .gr-g{ font-weight:700; color:#111; letter-spacing:.02em; }

  .gr-cta{ margin-top:34px; text-align:center; }
  .gr-cta a{
    font-size:13px; font-weight:600; color:#15803D;
    text-decoration:underline; text-underline-offset:3px;
  }
  .gr-cta a:hover{ color:#000; }
  `;

  /* ─────────────────── homepage-premium variant (.grx-*) ──────────────────
     A SECOND presentation of the SAME data and the SAME component — opted
     into with data-variant="homepage-premium" on the mount. Only index.html
     uses it; every route page keeps the .gr-* output above, untouched.

     Two namespaces, one renderer: nothing below re-implements review
     selection, escaping, star markup or the read-more behaviour — those are
     shared. Only the arrangement differs.

     Why a separate <style id="grx-styles"> rather than adding to CSS above:
     index.html ships its own <style id="gr-styles"> skin, which by design
     suppresses the injection above. A separately-identified block is
     therefore the only way the variant's rules reach the homepage, and it
     keeps the two presentations independently readable.

     Colours mirror the --pst-* token set added centrally to css/landing.css.
     They are restated here rather than imported because index.html is on the
     legacy track (css/style.css, Inter) and does not load landing.css - the
     two design systems cannot share a stylesheet. The values are identical on
     both tracks, so the band reads the same wherever it is used. */
  const CSS_HOME = `
  /* -- premium dark-teal band -------------------------------------------- */
  .grx{
    --grx-ink:#0E1A22;        /* deep ink base                              */
    --grx-teal:#153C3A;       /* dark teal wash                             */
    --grx-teal-mut:#315A56;   /* muted teal, used only as soft light        */
    --grx-ivory:#F7F3EA;      /* warm ivory card surface                    */
    --grx-gold:#C79B3B;       /* gold for rules + borders (3.2:1, decorative)*/
    --grx-gold-lt:#EBC97F;    /* gold used AS TEXT on dark (4.5:1 on its chip)*/
    --grx-gold-ink:#A8822C;   /* stars on ivory (3.2:1, meets SC 1.4.11)    */
    --grx-green:#7FD8A6;      /* trusted links + eyebrow (10.3:1 on ink)    */

    padding:76px 0 70px;
    background-color:var(--grx-ink);

    /* Original, decorative, image-free background. No raster asset, no
       third-party pattern, no extra network request. Layers paint
       top-to-bottom: edge vignette, two soft lights, the diagonal diamond
       lattice, then the teal wash. The lattice sits near the threshold of
       visibility (3% ivory) so it never competes with a review. */
    background-image:
      radial-gradient(125% 88% at 50% 44%, transparent 50%, rgba(0,0,0,.44) 100%),
      radial-gradient(900px 520px at 15% 6%,  rgba(49,90,86,.55), transparent 70%),
      radial-gradient(780px 480px at 89% 97%, rgba(199,155,59,.085), transparent 68%),
      repeating-linear-gradient(45deg,  rgba(247,243,234,.030) 0 1px, transparent 1px 38px),
      repeating-linear-gradient(-45deg, rgba(247,243,234,.030) 0 1px, transparent 1px 38px),
      linear-gradient(168deg, var(--grx-teal) 0%, var(--grx-ink) 62%);
  }
  .grx__in{ width:100%; max-width:1200px; margin:0 auto; padding:0 1.25rem; }

  /* Visually hidden, still announced. style.css has no .sr-only, so the band
     carries its own rather than depending on a class it cannot see. */
  .grx__srx{
    position:absolute; width:1px; height:1px; padding:0; margin:-1px;
    overflow:hidden; clip:rect(0 0 0 0); clip-path:inset(50%); white-space:nowrap; border:0;
  }

  /* --- top: intro panel + featured review ----------------------------- */
  .grx__top{ display:grid; grid-template-columns:1fr; gap:34px; align-items:start; }
  @media (min-width:900px){
    .grx__top{ grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr); gap:56px; }
  }
  .grx__eyebrow{
    display:flex; align-items:center; gap:10px; margin:0 0 14px;
    font-size:.72rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
    color:var(--grx-green);
  }
  .grx__eyebrow::before{ content:""; width:26px; height:2px; background:var(--grx-gold); flex:0 0 auto; }
  .grx__h2{
    margin:0; color:#fff; font-family:var(--ffd,Inter,sans-serif);
    font-size:clamp(1.6rem,3.4vw,2.3rem); line-height:1.18; letter-spacing:-.02em; font-weight:700;
  }
  .grx__lede{ margin:14px 0 0; color:rgba(247,243,234,.78); font-size:.95rem; line-height:1.75; max-width:44ch; }
  .grx__src{
    display:flex; align-items:flex-start; gap:9px; margin:22px 0 0;
    font-size:.8rem; line-height:1.6; color:rgba(247,243,234,.78);
  }
  .grx__g{
    display:inline-flex; align-items:center; justify-content:center;
    width:21px; height:21px; border-radius:50%; flex:0 0 auto;
    border:1px solid rgba(199,155,59,.42); background:rgba(199,155,59,.10);
    color:var(--grx-gold-lt); font-weight:700; font-size:.7rem;
  }

  /* --- the featured review -------------------------------------------- */
  .grx__feat{
    position:relative; background:var(--grx-ivory); border-radius:14px;
    padding:30px 28px 24px; overflow:hidden;
    border:1px solid rgba(14,26,34,.10);
    box-shadow:0 18px 40px -22px rgba(0,0,0,.65);
  }
  @media (min-width:900px){ .grx__feat{ padding:38px 40px 30px; } }
  .grx__quote{
    position:absolute; top:-14px; right:18px; z-index:0;
    font-family:Georgia,serif; font-size:8rem; line-height:1;
    color:rgba(168,130,44,.15); pointer-events:none; user-select:none;
  }
  /* :not(.grx__quote) matters - a blanket "> *" also re-positioned the
     decorative quote mark into normal flow, which pushed the review text
     down by its own 8rem line box and left a large hole in the card. */
  .grx__feat > :not(.grx__quote){ position:relative; z-index:1; }
  .grx__ftext{ margin-top:14px; color:#1A1A1A; font-size:1.06rem; line-height:1.72; }
  @media (min-width:900px){ .grx__ftext{ font-size:1.16rem; line-height:1.75; } }
  .grx__ftext p{ margin:0; }
  .grx__ftext p + p{ margin-top:.8rem; }

  /* --- shared review meta row (featured + supporting) ------------------ */
  .grx__meta{
    display:flex; align-items:center; gap:11px; margin-top:20px;
    padding-top:16px; border-top:1px solid rgba(14,26,34,.10);
  }
  .grx__av{
    flex:0 0 auto; width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:.74rem; font-weight:700; letter-spacing:.02em;
  }
  .grx__who{ min-width:0; flex:1 1 auto; }
  .grx__name{ margin:0; font-size:.87rem; font-weight:700; color:#0A0A0A; line-height:1.3; overflow-wrap:anywhere; }
  .grx__sub{ margin:2px 0 0; font-size:.73rem; color:#5F5F5F; }

  /* --- supporting grid -------------------------------------------------- */
  .grx__grid{ display:grid; grid-template-columns:1fr; gap:18px; margin-top:30px; }
  @media (min-width:640px){ .grx__grid{ grid-template-columns:repeat(2,1fr); } }
  @media (min-width:1000px){ .grx__grid{ grid-template-columns:repeat(3,1fr); gap:20px; } }
  /* Supporting cards sit one step below the featured card: same ivory and
     radius family, lighter border and shadow, smaller type. */
  .grx__card{
    background:var(--grx-ivory); border-radius:12px; padding:22px 22px 18px;
    display:flex; flex-direction:column;
    border:1px solid rgba(14,26,34,.08);
    box-shadow:0 10px 26px -20px rgba(0,0,0,.6);
  }
  .grx__ctext{ margin-top:12px; color:#3D3D3D; font-size:.9rem; line-height:1.72; flex:1 1 auto; }
  .grx__ctext p{ margin:0; }
  .grx__ctext p + p{ margin-top:.7rem; }

  /* --- stars ------------------------------------------------------------ */
  /* Filled and empty stars differ by GLYPH as well as colour, so a rating is
     never conveyed by colour alone. The accessible name lives on the parent. */
  .grx__stars{ display:flex; gap:3px; }
  .grx__star{ color:var(--grx-gold-ink); font-size:.95rem; line-height:1; }
  .grx__star.is-off{ color:#8C8C8C; }

  /* --- expandable remainder --------------------------------------------- */
  .grx__more[hidden]{ display:none; }
  .grx__more{ display:grid; grid-template-columns:1fr; gap:18px; margin-top:0; }
  @media (min-width:640px){ .grx__more{ grid-template-columns:repeat(2,1fr); } }
  @media (min-width:1000px){ .grx__more{ grid-template-columns:repeat(3,1fr); gap:20px; } }
  .grx__toggle{
    display:block; margin:26px auto 22px; min-height:44px; padding:11px 26px;
    background:transparent; color:#fff; border:1px solid rgba(247,243,234,.32);
    border-radius:999px; font-family:inherit; font-size:.87rem; font-weight:600; cursor:pointer;
    transition:background-color .18s ease, border-color .18s ease;
  }
  .grx__toggle:hover{ background:rgba(247,243,234,.09); border-color:rgba(247,243,234,.58); }

  /* --- Google provenance panel (trust conclusion) ----------------------- */
  /* Reads as a panel, not a paragraph: inset surface, gold hairline, its own
     source marker. It states where the reviews came from and links to the
     profile. It carries no rating, no count, no badge, no certification
     language and no booking action - the CTA below stays the only conversion
     control, and nothing here implies Google endorses the business. */
  .grx__prov{
    margin-top:44px; padding:24px 22px; border-radius:16px;
    border:1px solid rgba(247,243,234,.17);
    background:linear-gradient(180deg, rgba(49,90,86,.34) 0%, rgba(14,26,34,.34) 100%);
    box-shadow:inset 0 1px 0 rgba(247,243,234,.07);
    display:grid; grid-template-columns:1fr; gap:16px; align-items:center;
  }
  .grx__prov::before{
    content:""; display:block; width:38px; height:2px; background:var(--grx-gold);
    grid-column:1 / -1;
  }
  @media (min-width:860px){
    .grx__prov{ grid-template-columns:auto auto minmax(0,1fr) auto; gap:22px; padding:26px 32px; }
    .grx__prov::before{ grid-column:auto; width:2px; height:44px; }
  }
  .grx__provg{
    display:inline-flex; align-items:center; justify-content:center;
    width:38px; height:38px; border-radius:50%; flex:0 0 auto;
    border:1px solid rgba(199,155,59,.45); background:rgba(199,155,59,.11);
    color:var(--grx-gold-lt); font-weight:700; font-size:1rem;
  }
  .grx__provlead{ margin:0; color:#fff; font-size:1rem; font-weight:600; line-height:1.5; }
  .grx__provsub{ margin:6px 0 0; color:rgba(247,243,234,.72); font-size:.85rem; line-height:1.6; }
  .grx__provlink{
    display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
    min-height:46px; padding:12px 22px; border-radius:999px;
    border:1px solid rgba(127,216,166,.5); color:var(--grx-green);
    font-size:.9rem; font-weight:700;
    text-decoration:underline; text-underline-offset:3px;
    transition:background-color .18s ease, color .18s ease, border-color .18s ease;
  }
  .grx__provlink:hover{ background:rgba(127,216,166,.13); color:#fff; border-color:rgba(127,216,166,.85); }
  .grx__provarrow{ width:15px; height:15px; flex:0 0 auto; }
  @media (max-width:520px){ .grx__provlink{ width:100%; } }

  /* --- closing conversion bridge ---------------------------------------- */
  /* Separated from the provenance panel by its own rule and generous space so
     the Google link and the booking action never read as one control group. */
  .grx__cta{
    margin-top:40px; padding-top:32px; border-top:1px solid rgba(247,243,234,.15);
    display:flex; flex-direction:column; align-items:center; gap:14px; text-align:center;
  }
  @media (min-width:760px){ .grx__cta{ flex-direction:row; justify-content:center; gap:20px; text-align:left; } }
  .grx__ctaline{ margin:0; color:rgba(247,243,234,.85); font-size:1rem; font-weight:500; }
  .grx__wa{
    display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
    min-height:46px; padding:12px 26px; border-radius:999px;
    background:#25D366; color:#0A0A0A; font-size:.92rem; font-weight:700;
    transition:filter .18s ease;
  }
  .grx__wa:hover{ filter:brightness(.94); }
  .grx__tel{ color:rgba(247,243,234,.82); font-size:.87rem; font-weight:600;
    text-decoration:underline; text-underline-offset:3px; }
  .grx__tel:hover{ color:#fff; }

  /* Visible keyboard focus on every control in the band. */
  .grx a:focus-visible, .grx button:focus-visible{
    outline:3px solid var(--grx-green); outline-offset:3px; border-radius:4px;
  }

  /* The band animates nothing; this only neutralises the hover transitions. */
  @media (prefers-reduced-motion: reduce){
    .grx *, .grx *::before, .grx *::after{
      transition:none !important; animation:none !important;
    }
  }

  /* Tighter vertical rhythm on phones - the band must not become a scroll
     marathon on a small screen. */
  @media (max-width:600px){
    .grx{ padding:52px 0 48px; }
    .grx__prov{ margin-top:34px; padding:22px 18px; }
    .grx__cta{ margin-top:32px; padding-top:26px; }
  }
  `;

  /* Route pages need the .gr-* sheet; the homepage does not. Injecting it
     only when a non-variant mount exists keeps unused CSS off the homepage. */
  const anyDefault = Array.prototype.some.call(
    mounts, m => m.getAttribute('data-variant') !== 'homepage-premium');
  const anyHome = Array.prototype.some.call(
    mounts, m => m.getAttribute('data-variant') === 'homepage-premium');

  if (anyDefault && !document.getElementById('gr-styles')) {
    const tag = document.createElement('style');
    tag.id = 'gr-styles';
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }
  if (anyHome && !document.getElementById('grx-styles')) {
    const tag = document.createElement('style');
    tag.id = 'grx-styles';
    tag.textContent = CSS_HOME;
    document.head.appendChild(tag);
  }

  /* ------------------------------- helpers ------------------------------ */
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /* Verbatim text — only escaped and split on the author's own paragraph
     breaks. Nothing is shortened, reworded or summarised. */
  const paragraphs = t => esc(t).split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');

  const initials = name => (name || '')
    .trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';

  /* Deterministic avatar colour from the name — a neutral initials badge,
     never an invented photograph of a real person. */
  const AV = ['#0E2439', '#15803D', '#7C2D12', '#3730A3', '#831843', '#374151'];
  const avatarColor = name => {
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
    return AV[h % AV.length];
  };

  function stars(rating) {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    let out = `<div class="gr-stars" role="img" aria-label="${n} out of 5 stars">`;
    for (let i = 1; i <= 5; i++) {
      out += `<span class="gr-star${i <= n ? '' : ' is-empty'}" aria-hidden="true">&#9733;</span>`;
    }
    return out + '</div>';
  }

  function card(r) {
    const av = r.avatar
      ? `<span class="gr-avatar"><img src="${esc(r.avatar)}" alt="" loading="lazy" width="36" height="36" /></span>`
      : `<span class="gr-avatar" style="background:${avatarColor(r.name)}" aria-hidden="true">${esc(initials(r.name))}</span>`;

    return `
      <article class="gr-card">
        <div class="gr-top">
          ${av}
          <div class="gr-id">
            <p class="gr-name">${esc(r.name)}</p>
          </div>
          ${r.date ? `<span class="gr-date">${esc(r.date)}</span>` : ''}
        </div>
        ${stars(r.rating)}
        <div class="gr-text">${paragraphs(r.text)}</div>
        <div class="gr-foot"><span class="gr-g">G</span><span>Posted on ${esc(r.source || 'Google')}</span></div>
      </article>`;
  }

  /* ─────────────── homepage-premium renderer (same data) ────────────────
     Reuses esc / paragraphs / initials / avatarColor above. Every field is
     printed verbatim: name, date, rating, text and source are never edited,
     shortened or recombined here.

     FEATURED REVIEW — deterministic, by id, never random.
     "review-001" (Aakash Sharma) is pinned because it is the one review in
     the homepage set that names, in the customer's own words, all five of
     the things a first-time visitor is deciding on: the driver arrived as
     arranged ("Driver arrived early"), the cab was comfortable ("cool and
     clean"), nobody was rushed ("waited at each temple without rushing us
     even once"), the fare matched the quote ("Fare was as discussed"), and
     it names a real trip ("day trip to Vrindavan").
     It is NOT the most effusive review in the pool — review-005 is — and it
     was deliberately not chosen on that basis. Featuring is presentational
     only: no label claims it is more genuine or more authoritative, and
     every other review stays in the same section.
     If that id is ever removed from the data, this falls back to the first
     review of the page's list, so it stays deterministic either way. */
  const FEATURED_ID = 'review-001';

  function starsHome(rating) {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    let out = `<div class="grx__stars" role="img" aria-label="${n} out of 5 stars">`;
    for (let i = 1; i <= 5; i++) {
      /* Filled U+2605 vs outlined U+2606: the rating is legible without
         colour perception, and the parent carries the accessible name. */
      out += `<span class="grx__star${i <= n ? '' : ' is-off'}" aria-hidden="true">${i <= n ? '&#9733;' : '&#9734;'}</span>`;
    }
    return out + '</div>';
  }

  /* Shared meta row: initials avatar, name, then date and source as text. */
  function metaHome(r) {
    const bits = [];
    if (r.date) bits.push(esc(r.date));
    bits.push('Posted on ' + esc(r.source || 'Google'));
    return `
          <footer class="grx__meta">
            <span class="grx__av" style="background:${avatarColor(r.name)}" aria-hidden="true">${esc(initials(r.name))}</span>
            <span class="grx__who">
              <p class="grx__name">${esc(r.name)}</p>
              <p class="grx__sub">${bits.join(' &middot; ')}</p>
            </span>
          </footer>`;
  }

  const featuredHome = r => `
        <article class="grx__feat">
          <span class="grx__quote" aria-hidden="true">&ldquo;</span>
          ${starsHome(r.rating)}
          <div class="grx__ftext">${paragraphs(r.text)}</div>
          ${metaHome(r)}
        </article>`;

  const cardHome = r => `
          <article class="grx__card">
            ${starsHome(r.rating)}
            <div class="grx__ctext">${paragraphs(r.text)}</div>
            ${metaHome(r)}
          </article>`;

  function renderHome(mount, list, subline) {
    const featured = list.find(r => r.id === FEATURED_ID) || list[0];
    const rest = list.filter(r => r !== featured);
    const shown = rest.slice(0, 3);
    const extra = rest.slice(3);
    const profile = esc(window.PST_REVIEWS.PROFILE_URL);
    const wa = mount.getAttribute('data-wa') || '';
    const moreId = 'grx-more';

    mount.className = 'grx';
    mount.innerHTML = `
      <div class="grx__in">
        <div class="grx__top">
          <div class="grx__intro">
            <p class="grx__eyebrow">Guest Stories</p>
            <h2 class="grx__h2">What Our Travellers Say</h2>
            <p class="grx__lede">${esc(subline)}</p>
            <p class="grx__src"><span class="grx__g" aria-hidden="true">G</span>Every review shown here is published on our Google Business profile.</p>
          </div>
          ${featuredHome(featured)}
        </div>

        <div class="grx__grid">${shown.map(cardHome).join('')}</div>
        ${extra.length ? `<button class="grx__toggle" type="button" aria-expanded="false" aria-controls="${moreId}">Show ${extra.length} more reviews</button>
        <div class="grx__more" id="${moreId}" hidden>${extra.map(cardHome).join('')}</div>` : ''}


        <!-- Google provenance: the trust conclusion of the collection.
             Every review rendered above comes from window.PST_REVIEWS with
             source "Google", so the statement is true of all of them. No
             rating, count, badge or endorsement claim is made. -->
        <div class="grx__prov">
          <span class="grx__provg" aria-hidden="true">G</span>
          <div class="grx__provbody">
            <p class="grx__provlead">Every review below was posted on Google by a customer.</p>
            <p class="grx__provsub">Read the original customer feedback on our Google profile.</p>
          </div>
          <a class="grx__provlink" href="${profile}" target="_blank" rel="noopener noreferrer">Read More Reviews on Google<svg class="grx__provarrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg><span class="grx__srx"> (opens in a new tab)</span></a>
        </div>
        ${wa ? `<div class="grx__cta">
          <p class="grx__ctaline">Planning a trip from Agra?</p>
          <a data-cta class="grx__wa" href="${esc(wa)}" target="_blank" rel="noopener">Get Your Fare on WhatsApp</a>
          <a class="grx__tel" href="tel:+918720081102">or call +91 87200 81102</a>
        </div>` : ''}
      </div>`;

    const btn = mount.querySelector('.grx__toggle');
    if (btn) {
      const box = mount.querySelector('.grx__more');
      btn.addEventListener('click', () => {
        const open = box.hidden;
        box.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Show fewer reviews' : `Show ${extra.length} more reviews`;
      });
    }
  }

  /* -------------------------------- render ------------------------------ */
  mounts.forEach(mount => {
    const key = mount.getAttribute('data-page') || '';
    const list = window.PST_REVIEWS.forPage(key);

    /* No genuine reviews yet — remove the section rather than ship an empty one. */
    if (!list.length) { mount.remove(); return; }

    /* Supporting line. Pages whose review set is route-relevant but not
       route-specific can override it with data-subline so the framing stays
       honest — never by editing a review. */
    const subline = mount.getAttribute('data-subline')
      || 'Real experiences from Padma Shree Travels customers on Google.';

    /* Opt-in variant. Anything without it renders exactly as before. */
    if (mount.getAttribute('data-variant') === 'homepage-premium') {
      renderHome(mount, list, subline);
      return;
    }

    mount.className = 'gr-wrap';
    mount.innerHTML = `
      <div class="gr-inner">
        <div class="gr-head">
          <h2>What Our Travellers Say</h2>
          <p>${esc(subline)}</p>
        </div>
        <div class="gr-grid">${list.map(card).join('')}</div>
        <div class="gr-cta">
          <a href="${esc(window.PST_REVIEWS.PROFILE_URL)}" target="_blank" rel="noopener noreferrer">
            View More Reviews on Google
          </a>
        </div>
      </div>`;

    /* "Read more" is added only to cards that actually overflow, so short
       reviews never get a pointless toggle. */
    mount.querySelectorAll('.gr-text').forEach(el => {
      el.classList.add('is-clamped');
      if (el.scrollHeight - el.clientHeight < 4) { el.classList.remove('is-clamped'); return; }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gr-more';
      btn.textContent = 'Read more';
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const open = el.classList.toggle('is-clamped') === false;
        btn.textContent = open ? 'Show less' : 'Read more';
        btn.setAttribute('aria-expanded', String(open));
      });
      el.insertAdjacentElement('afterend', btn);
    });
  });
})();
