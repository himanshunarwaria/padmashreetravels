/*
  Central route → image mapping for Padma Shree Travels route/service pages.
  One source of truth: add or change a route's photos here, not in the HTML.

  Each page only needs two things in its markup:
    1. <section class="phero"> ... </section>   (no inline background-image)
    2. <div class="rstrip" data-rstrip aria-label="Photos related to this route"></div>
       placed between the trust strip and the "Quick Facts" section
  This script detects the current route from the URL, sets the hero photo,
  and fills the strip — or renders a neutral "Route photo coming soon"
  placeholder for any slot without a genuine, relevant photo.
*/
(function () {
  'use strict';

  var D = 'images/destinations/';
  var F = 'images/fleet/';

  var ROUTES = {

    'agra-to-mathura-taxi': {
      hero: { src: D + 'dest-mathura-janmabhoomi.webp', alt: 'Krishna Janmabhoomi Temple, Mathura' },
      strip: [
        { src: D + 'dest-mathura-janmabhoomi.webp', alt: 'Krishna Janmabhoomi Temple, Mathura' },
        { src: D + 'dest-mathura-dwarkadhish.webp', alt: 'Dwarkadhish Temple, Mathura' },
        { src: D + 'dest-vishram-ghat.webp', alt: 'Evening aarti at Vishram Ghat, Mathura' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' }
      ]
    },
    'agra-to-vrindavan-cab': {
      hero: { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir illuminated at night, Vrindavan' },
      strip: [
        { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir, Vrindavan' },
        { src: D + 'dest-iskcon.webp', alt: 'ISKCON temple, Vrindavan' },
        { src: D + 'dest-nidhivan.webp', alt: 'Nidhivan grove, Vrindavan' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'mathura-vrindavan-tour-from-agra': {
      hero: { src: D + 'dest-vishram-ghat.webp', alt: 'Evening aarti at Vishram Ghat, Mathura' },
      strip: [
        { src: D + 'dest-mathura-janmabhoomi.webp', alt: 'Krishna Janmabhoomi Temple, Mathura' },
        { src: D + 'dest-vishram-ghat.webp', alt: 'Vishram Ghat, Mathura' },
        { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir, Vrindavan' },
        { src: D + 'dest-tour-map.webp', alt: 'Mathura–Vrindavan day-tour route map' }
      ]
    },
    'mathura-vrindavan-barsana': {
      hero: { src: D + 'dest-barsana.webp', alt: 'Radha Rani Temple on the hill at Barsana' },
      strip: [
        { src: D + 'dest-barsana.webp', alt: 'Radha Rani Temple, Barsana' },
        { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir, Vrindavan' },
        { src: D + 'dest-vishram-ghat.webp', alt: 'Vishram Ghat, Mathura' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-local-sightseeing': {
      hero: { src: D + 'dest-taj-mahal-sunrise.webp', alt: 'Taj Mahal at sunrise' },
      strip: [
        { src: D + 'dest-taj-mahal-sunrise.webp', alt: 'Taj Mahal at sunrise' },
        { src: D + 'dest-agra-fort.webp', alt: 'Agra Fort' },
        { src: D + 'dest-baby-taj.webp', alt: 'Itimad-ud-Daulah (Baby Taj)' },
        { src: D + 'dest-akbars-tomb.webp', alt: "Akbar's Tomb, Sikandra" },
        { src: D + 'dest-mehtab-bagh.webp', alt: 'Mehtab Bagh, sunset view of the Taj' }
      ]
    },
    'fatehpur-sikri': {
      hero: { src: D + 'dest-fatehpur-sikri.webp', alt: 'Buland Darwaza gateway, Fatehpur Sikri' },
      strip: [
        { src: D + 'dest-fatehpur-sikri.webp', alt: 'Buland Darwaza, Fatehpur Sikri' },
        { src: D + 'dest-agra-fort.webp', alt: 'Agra Fort' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway between Agra and Fatehpur Sikri' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' }
      ]
    },
    'taj-mahal-taxi': {
      hero: { src: D + 'dest-mehtab-bagh.webp', alt: 'Taj Mahal viewed from Mehtab Bagh' },
      strip: [
        { src: D + 'dest-taj-mahal-sunrise.webp', alt: 'Taj Mahal at sunrise' },
        { src: D + 'dest-mehtab-bagh.webp', alt: 'Taj Mahal from Mehtab Bagh' },
        { src: D + 'dest-agra-fort.webp', alt: 'Agra Fort' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'taj-mahal-sunrise-taxi': {
      hero: { src: D + 'dest-taj-sunrise-2.webp', alt: 'Taj Mahal at first light' },
      strip: [
        { src: D + 'dest-taj-sunrise-2.webp', alt: 'Taj Mahal at first light' },
        { src: D + 'dest-taj-mahal-sunrise.webp', alt: 'Taj Mahal main gate at sunrise' },
        { src: D + 'dest-mehtab-bagh.webp', alt: 'Mehtab Bagh, across the Yamuna' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' }
      ]
    },
    'agra-to-jaipur-taxi': {
      hero: { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' },
      strip: [
        { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' },
        { src: D + 'dest-jaipur-street.webp', alt: 'Street view near Hawa Mahal, Jaipur' },
        { src: D + 'dest-fatehpur-sikri.webp', alt: 'Fatehpur Sikri, a stop on the way' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-gwalior': {
      hero: { src: D + 'dest-gwalior-fort.webp', alt: 'Gwalior Fort approach gate' },
      strip: [
        { src: D + 'dest-gwalior-fort.webp', alt: 'Gwalior Fort' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway to Gwalior' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' },
        { src: D + 'dest-tour-map.webp', alt: 'Agra outstation route map' }
      ]
    },
    'agra-to-mehandipur-balaji-taxi': {
      hero: { src: D + 'dest-mehandipur-balaji.webp', alt: 'Hillside Hanuman temple typical of the Mehandipur Balaji route' },
      strip: [
        { src: D + 'dest-mehandipur-balaji.webp', alt: 'Hillside temple, Mehandipur Balaji route' },
        { src: D + 'dest-temple-crowd.webp', alt: 'Temple gateway with pilgrims' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Mehandipur Balaji' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-kaila-devi-temple-taxi': {
      hero: { src: D + 'dest-kaila-devi.webp', alt: 'Temple on a rocky ravine, typical of the Kaila Devi route near Karauli' },
      strip: [
        { src: D + 'dest-kaila-devi.webp', alt: 'Hillside temple, Kaila Devi route' },
        { src: D + 'dest-hilltop-village.webp', alt: 'Village below a hilltop temple, Karauli area' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Karauli' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-bateshwar': {
      hero: { src: D + 'dest-bateshwar.webp', alt: 'Red sandstone riverside temples, Bateshwar' },
      strip: [
        { src: D + 'dest-bateshwar.webp', alt: 'Sandstone temple ghats, Bateshwar' },
        { src: D + 'dest-yamuna-ghat.webp', alt: 'Yamuna riverside ghat' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway along the Yamuna toward Bateshwar' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' }
      ]
    },
    'agra-karauli-kaila-devi-balaji-tour': {
      hero: { src: D + 'dest-kaila-devi.webp', alt: 'Hillside temple typical of the Karauli pilgrimage circuit' },
      strip: [
        { src: D + 'dest-kaila-devi.webp', alt: 'Kaila Devi Temple route' },
        { src: D + 'dest-mehandipur-balaji.webp', alt: 'Mehandipur Balaji route' },
        { src: D + 'dest-hilltop-village.webp', alt: 'Village below a hilltop temple, Karauli area' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-govardhan-taxi': {
      hero: { src: D + 'dest-govardhan-kund.webp', alt: 'Temple beside a sacred kund, typical of Govardhan' },
      strip: [
        { src: D + 'dest-govardhan-kund.webp', alt: 'Temple beside a sacred kund, Govardhan' },
        { src: D + 'dest-hilltop-village.webp', alt: 'Village near the Govardhan hill' },
        { src: D + 'dest-heritage-lane.webp', alt: 'Old Braj-region lane' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-gokul-nandgaon-taxi': {
      hero: { src: D + 'dest-heritage-lane.webp', alt: 'Old lane typical of the Gokul–Nandgaon villages' },
      strip: [
        { src: D + 'dest-heritage-lane.webp', alt: 'Old village lane, Braj region' },
        { src: D + 'dest-hilltop-village.webp', alt: 'Village below a hilltop temple' },
        { src: D + 'dest-yamuna-ghat.webp', alt: 'Yamuna riverside ghat' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-rajasthan-temple-tour': {
      hero: { src: D + 'dest-aravalli-temple.webp', alt: 'Temple in the Aravalli hills, Rajasthan' },
      strip: [
        { src: D + 'dest-aravalli-temple.webp', alt: 'Temple in the Aravalli hills' },
        { src: D + 'dest-kaila-devi.webp', alt: 'Kaila Devi Temple route' },
        { src: D + 'dest-mehandipur-balaji.webp', alt: 'Mehandipur Balaji route' },
        { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' }
      ]
    },
    'agra-temple-tour-by-cab': {
      hero: { src: D + 'dest-temple-crowd.webp', alt: 'Temple gateway with pilgrims, typical of Braj darshan routes' },
      strip: [
        { src: D + 'dest-temple-crowd.webp', alt: 'Temple gateway with pilgrims' },
        { src: D + 'dest-vishram-ghat.webp', alt: 'Vishram Ghat, Mathura' },
        { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir, Vrindavan' },
        { src: D + 'dest-mehandipur-balaji.webp', alt: 'Mehandipur Balaji route' }
      ]
    },
    'agra-to-karauli-taxi': {
      hero: { src: D + 'dest-kaila-devi.webp', alt: 'Hillside temple typical of the Karauli route' },
      strip: [
        { src: D + 'dest-kaila-devi.webp', alt: 'Kaila Devi Temple, Karauli route' },
        { src: D + 'dest-hilltop-village.webp', alt: 'Village below a hilltop temple, Karauli area' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Karauli' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-to-aligarh': {
      hero: { src: D + 'dest-highway.webp', alt: 'Highway on the Agra to Aligarh route' },
      strip: [
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Aligarh' },
        { src: D + 'dest-dhaba.webp', alt: 'Roadside dhaba, a typical highway stop' },
        { src: F + 'fleet-amaze.webp', alt: 'AC sedan used on this route' },
        null
      ]
    },
    'agra-to-firozabad': {
      hero: { src: D + 'dest-highway-sunset.webp', alt: 'Highway on the Agra to Firozabad route' },
      strip: [
        { src: D + 'dest-highway.webp', alt: 'Highway toward Firozabad' },
        { src: D + 'dest-agra-market.webp', alt: 'Old city market street, typical of the region' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' },
        null
      ]
    },
    'agra-to-etawah': {
      hero: { src: D + 'dest-highway.webp', alt: 'Highway on the Agra to Etawah route' },
      strip: [
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Etawah' },
        { src: D + 'dest-dhaba.webp', alt: 'Roadside dhaba, a typical highway stop' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' },
        null
      ]
    },
    'agra-to-hathras': {
      hero: { src: D + 'dest-highway-sunset.webp', alt: 'Highway on the Agra to Hathras route' },
      strip: [
        { src: D + 'dest-highway.webp', alt: 'Highway toward Hathras' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' },
        null,
        null
      ]
    },
    'agra-to-tundla': {
      hero: { src: D + 'dest-highway.webp', alt: 'Highway on the Agra to Tundla route' },
      strip: [
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Tundla' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' },
        null,
        null
      ]
    },
    'agra-to-sirsaganj': {
      hero: { src: D + 'dest-highway-sunset.webp', alt: 'Highway on the Agra to Sirsaganj route' },
      strip: [
        { src: D + 'dest-highway.webp', alt: 'Highway toward Sirsaganj' },
        { src: D + 'dest-dhaba.webp', alt: 'Roadside dhaba, a typical highway stop' },
        { src: F + 'fleet-amaze.webp', alt: 'AC sedan used on this route' },
        null
      ]
    },
    'agra-to-shikohabad': {
      hero: { src: D + 'dest-highway.webp', alt: 'Highway on the Agra to Shikohabad route' },
      strip: [
        { src: D + 'dest-highway-sunset.webp', alt: 'Highway toward Shikohabad' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' },
        null,
        null
      ]
    },
    'jaipur-to-agra-taxi': {
      hero: { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' },
      strip: [
        { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' },
        { src: D + 'dest-jaipur-street.webp', alt: 'Street view near Hawa Mahal, Jaipur' },
        { src: D + 'dest-fatehpur-sikri.webp', alt: 'Fatehpur Sikri, a stop on the way' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used on this route' }
      ]
    },
    'agra-airport-taxi': {
      hero: { src: D + 'dest-airport-terminal.webp', alt: "Agra's Kheria Airport terminal" },
      strip: [
        { src: D + 'dest-airport-terminal.webp', alt: 'Airport terminal, pickup point' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used for airport transfers' },
        { src: F + 'fleet-boot-luggage.webp', alt: 'Boot space for luggage' },
        { src: D + 'dest-tour-map.webp', alt: 'Agra route map' }
      ]
    },
    'agra-railway-station-taxi': {
      hero: { src: D + 'dest-highway.webp', alt: 'Pickup and transfer context, Agra Cantt route' },
      strip: [
        { src: D + 'dest-agra-market.webp', alt: 'Agra old city street, near the station' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used for station transfers' },
        { src: F + 'fleet-boot-luggage.webp', alt: 'Boot space for luggage' },
        null
      ]
    },
    'agra-to-bharatpur-taxi': {
      hero: { src: D + 'dest-bharatpur-keoladeo.webp', alt: 'Keoladeo wetland, Bharatpur' },
      strip: [
        { src: D + 'dest-bharatpur-keoladeo.webp', alt: 'Keoladeo National Park wetland' },
        { src: F + 'fleet-ertiga.webp', alt: 'AC SUV used on this route' },
        { src: D + 'dest-highway.webp', alt: 'Highway toward Bharatpur' },
        null
      ]
    },
    'agra-to-delhi-airport-taxi': {
      hero: { src: D + 'dest-airport-terminal.webp', alt: 'Modern airport terminal, Delhi' },
      strip: [
        { src: D + 'dest-airport-terminal.webp', alt: 'Airport terminal, drop point' },
        { src: F + 'fleet-innova-crysta.webp', alt: 'AC SUV used for airport transfers' },
        { src: F + 'fleet-boot-luggage.webp', alt: 'Boot space for luggage' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Yamuna Expressway toward Delhi' }
      ]
    },
    'outstation-cabs-agra': {
      hero: { src: D + 'dest-highway.webp', alt: 'Highway for outstation routes from Agra' },
      strip: [
        { src: D + 'dest-gwalior-fort.webp', alt: 'Gwalior Fort' },
        { src: D + 'dest-jaipur-hawa-mahal.webp', alt: 'Hawa Mahal, Jaipur' },
        { src: D + 'dest-highway-sunset.webp', alt: 'Open highway' },
        { src: F + 'fleet-tempo-traveller.webp', alt: 'Tempo Traveller for group outstation trips' }
      ]
    },
    'agra-to-mathura-vrindavan': {
      hero: { src: D + 'dest-vishram-ghat.webp', alt: 'Evening aarti at Vishram Ghat, Mathura' },
      strip: [
        { src: D + 'dest-mathura-janmabhoomi.webp', alt: 'Krishna Janmabhoomi Temple, Mathura' },
        { src: D + 'dest-prem-mandir.webp', alt: 'Prem Mandir, Vrindavan' },
        { src: D + 'dest-vishram-ghat.webp', alt: 'Vishram Ghat, Mathura' },
        { src: F + 'fleet-dzire.webp', alt: 'AC sedan used on this route' }
      ]
    }

  };

  function currentSlug() {
    var parts = location.pathname.split('/').filter(Boolean);
    return parts.length ? parts[0] : 'home';
  }

  function pathPrefix() {
    var depth = location.pathname.split('/').filter(Boolean).length;
    return depth > 0 ? new Array(depth + 1).join('../') : '';
  }

  function renderStrip(container, entry, prefix) {
    var slots = (entry && entry.strip) || [];
    var html = '';
    for (var i = 0; i < slots.length; i++) {
      var item = slots[i];
      if (item) {
        html += '<div class="rstrip__item"><img src="' + prefix + item.src + '" alt="' +
          item.alt.replace(/"/g, '&quot;') + '" width="400" height="300" loading="' +
          (i === 0 ? 'eager' : 'lazy') + '"></div>';
      } else {
        html += '<div class="rstrip__item rstrip__item--empty">Route photo<br>coming soon</div>';
      }
    }
    container.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var slug = currentSlug();
    var entry = ROUTES[slug];
    var prefix = pathPrefix();

    var hero = document.querySelector('.phero');
    if (hero && entry && entry.hero) {
      hero.classList.add('phero--img');
      hero.style.setProperty('--phero-img', "url('" + prefix + entry.hero.src + "')");
    }

    var strip = document.querySelector('[data-rstrip]');
    if (strip) renderStrip(strip, entry, prefix);
  });
})();
