/* ============================================================================
   Padma Shree Travels — <ReviewsGrid /> : ONE component, every landing page
   ============================================================================
   Usage on a page (that is the whole integration):

     <section data-reviews-grid data-page="agra-local-sightseeing"></section>
     ...
     <script src="../_shared/reviews-data.js"></script>
     <script src="../_shared/reviews-grid.js"></script>

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

  if (!document.getElementById('gr-styles')) {
    const tag = document.createElement('style');
    tag.id = 'gr-styles';
    tag.textContent = CSS;
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
