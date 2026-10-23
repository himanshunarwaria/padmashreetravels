# Google Business Profile checklist

What only the owner can do in Google Business Profile (GBP) to help Padma Shree Travels rank for the three priority trips: **Agra ↔ Jaipur**, **Mathura–Vrindavan** and **Fatehpur Sikri**. The website side is done (see "Already done on the website" at the end).

Google ranks local results on three things: **relevance** (does the profile match the search), **distance** (how close the searcher is) and **prominence** (reviews, links, how well known the business is). Distance can't be changed. Everything below works on the other two.

Edit the profile at https://business.google.com or by searching "Padma Shree Travels" on Google while signed in to the owner account.

---

## 1. Fix first: the business name

On Google the profile shows as **"Padma Shree Travels – Taxi Service in Agra"**. The owner replies in the review screenshots carry that name too (see the note at the top of `js/reviews-data.js`).

Google's rules: the name must be the business's real-world name, exactly as it appears on signage, registration, vehicles and invoices. Adding keywords or a location ("Taxi Service in Agra") is not allowed. It is one of the most common reasons profiles get suspended, and competitors can report it.

- [ ] Check what the real-world name is. The website, schema and logo all say **Padma Shree Travels**.
- [ ] If "– Taxi Service in Agra" isn't part of that real name, change the GBP name to **Padma Shree Travels**.
- [ ] Expect Google to review the change. It may ask you to verify the business again. That short wait is much better than a suspension later.

## 2. Opening hours: make them agree

The site says two different things today:

- The structured data on 40 pages (and `_seo/business-data.json`) says **open 24/7**.
- The visible text (homepage hero and footer) says **"Support daily, 9 AM–9 PM IST"**.

- [ ] Decide which is true. For example: bookings and support 9–9, but trips run around the clock.
- [ ] Set the same hours in GBP (add special hours for festivals if they differ).
- [ ] Tell the developer which one is right so the website matches. Both the structured data and the visible text need updating.

## 3. Address or service area

- [ ] Do customers come to the Shamsabad address (Rajeshwar Mandir, Kaveri Vihar Phase II)?
  - **Yes:** keep the address visible.
  - **No** (customers are only picked up): Google requires the address to be **hidden**. Set **service areas** instead: Agra, Mathura, Vrindavan, Fatehpur Sikri, Jaipur and other cities you regularly serve (up to 20).

## 4. Categories

- [ ] **Primary category: Taxi service**
- [ ] **Secondary: Tour operator** (helps "Mathura Vrindavan tour", "Fatehpur Sikri tour")
- [ ] **Secondary: Travel agency**
- [ ] Remove any categories that don't describe what you do.

## 5. Services and products

Add each priority trip in **both** places. Use the same prices as the website. Don't add a price where the site says "Fare on WhatsApp".

**Services** (Edit profile → Services, under "Taxi service" / "Tour operator"):

| Service | Price | Description (≤300 characters) |
|---|---|---|
| Agra to Jaipur Taxi | leave blank (fare on WhatsApp) | Private AC cab from Agra to Jaipur, about 235–240 km in 4–5 hours. One way or round trip, pickup anywhere in Agra, optional stops at Fatehpur Sikri or Mehandipur Balaji. |
| Jaipur to Agra Taxi | leave blank | Private AC cab from your Jaipur hotel or the airport to your Agra hotel, about 4–5 hours. |
| Golden Triangle (Agra legs) | leave blank | Agra–Delhi and Agra–Jaipur legs of the Golden Triangle by private cab, with Agra sightseeing in between. Each plan is quoted individually. |
| Mathura Vrindavan Full-Day Tour | ₹3,000 (AC sedan) | Full day from Agra: Krishna Janmabhoomi, Dwarkadhish, Vishram Ghat, Banke Bihari, ISKCON, Prem Mandir. 8–10 hours, driver waits at every temple. Tolls and parking extra. |
| Mathura, Vrindavan & Barsana Tour | ₹3,500 (AC sedan) | Three Braj towns in one long day from Agra, about 10–12 hours. Driver waits during darshan. Tolls and parking extra. |
| Fatehpur Sikri Day Trip | ₹2,500 (AC sedan, full day) | Private AC cab to Fatehpur Sikri, about 40 km from Agra. Driver waits at the complex. Entry tickets, tolls and parking extra. |

**Products** (Edit products → Add product). Products show as cards with a photo and a "Learn more" button. Add one per package above, with a real photo and the button linked to its page:

| Product | Button link |
|---|---|
| Agra to Jaipur Taxi | https://www.padmashreetravels.in/agra-to-jaipur-taxi/ |
| Golden Triangle (Agra legs) | https://www.padmashreetravels.in/golden-triangle-agra-jaipur-delhi/ |
| Mathura Vrindavan Full-Day Tour | https://www.padmashreetravels.in/mathura-vrindavan-tour-from-agra/ |
| Mathura, Vrindavan & Barsana Tour | https://www.padmashreetravels.in/mathura-vrindavan-barsana/ |
| Fatehpur Sikri Day Trip | https://www.padmashreetravels.in/fatehpur-sikri/ |

## 6. Business description

Up to 750 characters. Describe the business plainly, without a list of keywords. A starting point (check every fact before using it):

> Padma Shree Travels is a local taxi and tour service based in Shamsabad, Agra. We run private AC cabs for Agra sightseeing, Mathura–Vrindavan darshan day trips, Fatehpur Sikri, and longer drives to Jaipur, Mehandipur Balaji, Gwalior and other cities, plus airport and railway station transfers. Fares are agreed on WhatsApp before you travel, with tolls and parking explained upfront. You get the driver's name and car number before pickup, and drivers wait at temples and monuments. Book by phone or WhatsApp on +91 87200 81102.

- [ ] Website link on the profile: `https://www.padmashreetravels.in/`. Optionally add `?utm_source=google&utm_medium=organic&utm_campaign=gbp` so profile clicks show separately in analytics.

## 7. Posts: weekly, rotating the three packages

- [ ] One post a week. Use a **real photo from a real trip**, write 2–4 short sentences, and add a **Learn more** button to that package's page.
- [ ] Rotate: week 1 Mathura–Vrindavan, week 2 Fatehpur Sikri, week 3 Jaipur, week 4 something seasonal or local (Janmashtami or Holi in Braj, winter fog and Taj sunrise timing, a new car in the fleet).
- [ ] Keep posts factual: the trip, what's included, the price if published. No "best taxi in Agra" claims.

Example:

> Mathura–Vrindavan in one day from Agra: Krishna Janmabhoomi, Dwarkadhish, Banke Bihari, ISKCON and Prem Mandir, with the driver waiting at every temple. ₹3,000 for an AC sedan; tolls and parking extra. [Learn more]

## 8. Photos

Google favours profiles that regularly add real photos. Stock images don't help and can be removed.

- [ ] Logo and cover photo (the cover can be the fleet night photo used on the homepage).
- [ ] **Cars:** outside and inside, each model in the fleet.
- [ ] **Drivers,** with their permission.
- [ ] **Customers at the destinations, only with their permission:** Amber Fort or Hawa Mahal, Prem Mandir or Banke Bihari, Buland Darwaza.
- [ ] Add a few new photos every month instead of many at once.

## 9. Reviews

- [ ] Follow `docs/review-playbook.md`: send the review link to **every** customer after **every** trip, using the link for the trip they took.
- [ ] Reply to every review within 24–48 hours.
- [ ] Never offer anything for a review, never ask for 5 stars, never post reviews from your own or staff accounts.

## 10. Same details everywhere else

Search engines check that the business's details match across the web. Use exactly this, character for character, on every listing:

```
Padma Shree Travels
Rajeshwar Mandir, Kaveri Vihar Phase II, Shamsabad, Agra, Uttar Pradesh 282001
+91 87200 81102
https://www.padmashreetravels.in/
```

- [ ] **Justdial**: claim or create the listing, category Taxi Services / Tour Operators.
- [ ] **Sulekha**
- [ ] **TripAdvisor**: list as a tour operator. Useful for tourists searching Jaipur, Fatehpur Sikri and Taj trips.
- [ ] **Bing Places** (bingplaces.com): can import directly from Google Business Profile.
- [ ] **Apple Business Connect** (businessconnect.apple.com): this is what Apple Maps and Siri use.
- [ ] Fix or remove any old listings with a different name, phone or address.

---

## Already done on the website (Oct 2026)

- Every business schema block (41 pages) now links to the Google profile (`sameAs` and `hasMap` → `https://g.page/r/CUjtXu1x_3bPEBM`). Before, 39 pointed at the write-a-review link and 2 had no link.
- Phone number is in one format across all structured data.
- Homepage and route finder use "Padma Shree Travels" (not "PadmaShreeTravels"), matching the profile.
- The Jaipur, Fatehpur Sikri and Golden Triangle pages have shorter titles. The Jaipur page now links to the Golden Triangle page, and Fatehpur Sikri has its ₹2,500 fare in structured data.
- The review page (`/review-helper/`) was rebuilt so customers write their own reviews. It has trip-specific links and Hindi.

## Still needed from the owner

- [ ] **Google Maps embed code** for the business: on Google Maps, open the profile → Share → Embed a map → copy the HTML. The contact page and the review page currently show a generic "Agra" map instead of the business.
- [ ] **The correct opening hours** (section 2).
- [ ] **Confirmation of the real-world business name** (section 1).
