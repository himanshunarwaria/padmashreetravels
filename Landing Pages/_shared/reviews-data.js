/* ============================================================================
   Padma Shree Travels — SHARED GOOGLE REVIEW DATASET
   ============================================================================
   ONE dataset for every landing page. Do not copy reviews into page files.

   SOURCE
     Transcribed verbatim from the 12 Google review screenshots in /reviews/
     ("1 (1).png" … "1 (12).png"). Names, star counts, date labels and review
     text match the screenshots exactly. Nothing was reworded, corrected,
     shortened or completed.

   DELIBERATELY EXCLUDED
     * Owner responses from "Padma Shree Travels – Taxi Service in Agra (owner)"
       — these are not customer reviews.
     * Star-only entries with no review text:
       Shaikh Altaf, Purnendu Shekhar, Kuldeep lali Singh, Ramniwash Yadav.
     * Reviews whose text is truncated and never shown in full in any
       screenshot — storing a partial review as if complete would misrepresent
       the customer:
         Himanshu Narwaria  — cut off at "...More"
         Oshin Manwani      — cut off at "...More"
         Sanjay Raj         — Hathras review cut off at "Will use for all future"
       If you later capture these in full, add them here and they can be mapped
       to pages (Himanshu Narwaria → Agra local, Sanjay Raj → outstation).

   Every review in the pool below is 5 stars because every complete customer
   review visible in the screenshots is 5 stars. The component renders whatever
   number is stored — it does not force 5.

   ADDING A REVIEW
     Copy it EXACTLY as Google shows it. Never summarise, rewrite, translate or
     "clean up" the customer's wording or punctuation. Keep paragraph breaks as
     "\n\n" inside text. Give it the next free id; never reuse an id.
   ============================================================================ */

window.PST_REVIEWS = (function () {
  'use strict';

  /* --------------------------------------------------------------------------
     THE POOL — 31 genuine customer reviews, each stored once.
     -------------------------------------------------------------------------- */
  const POOL = [
    {
      id: "review-001",
      name: "Aakash Sharma",
      rating: 5,
      date: "a month ago",
      text: "Booked for a day trip to Vrindavan. Driver arrived early, cab was cool and clean, and he waited at each temple without rushing us even once. Fare was as discussed. Will go again soon.",
      source: "Google"
    },
    {
      id: "review-002",
      name: "Shashank Dauhaliya",
      rating: 5,
      date: "a month ago",
      text: "I book through WhatsApp and driver is always there within the time they say. Cab is clean, no argument over price at the end of the ride. That is all I need from a local cab service.",
      source: "Google"
    },
    {
      id: "review-003",
      name: "Ansh Chauhan",
      rating: 5,
      date: "2 months ago",
      text: "Use for shopping trips near Sadar Bazar. Driver knows the parking spots and waits without any fuss. Simple but very reliable. Good for regular errands.",
      source: "Google"
    },
    {
      id: "review-004",
      name: "Shivank Yadav",
      rating: 5,
      date: "2 months ago",
      text: "Comfortable ride to Firozabad and back. Driver on time, price as quoted. No complaints. Good for outstation from Agra.",
      source: "Google"
    },
    {
      id: "review-005",
      name: "Shreshtha Narwariya",
      rating: 5,
      date: "3 months ago",
      text: "The quality of service provided by this travel agency was truly unmatched. The team was extremely polite, helpful, and generous throughout the journey. Traveling with them was very comfortable and well-managed. Had a genuinely great experience and would definitely recommend them",
      source: "Google"
    },
    {
      id: "review-006",
      name: "vikas kumar",
      rating: 5,
      date: "2 months ago",
      text: "Really nice trip to Vrindavan. Driver arrived on time, drove carefully, and did not rush us at any temple. Paid what was quoted — no bargaining needed. Relaxed and easy pilgrimage trip.",
      source: "Google"
    },
    {
      id: "review-007",
      name: "Shubham Upadhyay",
      rating: 5,
      date: "a month ago",
      text: "Took family to Bateshwar for the famous fair and temple. Driver knew the route through the ghats and the fair parking area. Very useful for a place I had not visited before.",
      source: "Google"
    },
    {
      id: "review-008",
      name: "Tomar \"Aryan Tomar\" Singh220",
      rating: 5,
      date: "2 months ago",
      text: "I travel alone sometimes at odd hours and reliability matters a lot to me. Padma Shree has been consistent — driver confirms before leaving, cab is clean, I reach safely. That peace of mind is worth a lot.",
      source: "Google"
    },
    {
      id: "review-009",
      name: "Jitendra Singh",
      rating: 5,
      date: "a month ago",
      text: "I am a devotee of Lord Krishna and visit Mathura regularly. Have settled on Padma Shree as my permanent cab for this route. They are consistent and the driver respects the religious nature of the trips.",
      source: "Google"
    },
    {
      id: "review-010",
      name: "Sonu Kumar",
      rating: 5,
      date: "2 months ago",
      text: "First time using Padma Shree for outstation. Was recommended by a colleague. Driver was good, car was comfortable, price was clear. Will be my first choice for outstation from Agra going forward.",
      source: "Google"
    },
    {
      id: "review-011",
      name: "Kalyan Boyapati",
      rating: 5,
      date: "2 months ago",
      text: "Was visiting Agra for a few days and used Padma Shree for all my local travel. Driver always on time, knew the city well, never tried to inflate the fare. Wish more cities had services like this.",
      source: "Google"
    },
    {
      id: "review-012",
      name: "Rohit Bhardwaj",
      rating: 5,
      date: "a month ago",
      text: "Went for the famous Lathmar Holi at Barsana and Nandgaon after Vrindavan. Full day from Agra. Driver knew the schedule and timing for each place. We saw everything and got back by evening.",
      source: "Google"
    },
    {
      id: "review-013",
      name: "Sudhir Chavan",
      rating: 5,
      date: "2 months ago",
      text: "Foreign tourist here. Driver was polite, knew each monument well, spoke decent English, and helped us navigate the ticketing lines. A lot better than the random guides at the gate.",
      source: "Google"
    },
    {
      id: "review-014",
      name: "Deepu Singh Chahar",
      rating: 5,
      date: "2 months ago",
      text: "Missed an Ola once for an airport pickup because the driver cancelled last minute. Since then I only book Padma Shree for airport and station runs. Confirmed fare, driver shows up, no cancellations. Much better.",
      source: "Google"
    },
    {
      id: "review-015",
      name: "Keshav sharma",
      rating: 5,
      date: "2 months ago",
      text: "Very well experience. Polite driver. Very neat and clean car.",
      source: "Google"
    },
    {
      id: "review-016",
      name: "Hemant Tomar",
      rating: 5,
      date: "2 months ago",
      text: "I travel from Bhopal to Agra and always do a Vrindavan trip. Use Padma Shree for the Agra to Vrindavan leg. Three trips now and all three have been good.",
      source: "Google"
    },
    {
      id: "review-017",
      name: "HITENDRA SINGH",
      rating: 5,
      date: "2 months ago",
      text: "We did a round trip to Mathura for Holi. Fair price for a festival day when other cabs were charging double. Driver was cheerful about the festivities and made the trip enjoyable.",
      source: "Google"
    },
    {
      id: "review-018",
      name: "Raj Sekhar Sen",
      rating: 5,
      date: "4 weeks ago",
      text: "Very Good behaviour, near and clean car",
      source: "Google"
    },
    {
      id: "review-019",
      name: "Imbhupendra Singh",
      rating: 5,
      date: "2 months ago",
      text: "Very good service and excellent driver",
      source: "Google"
    },
    {
      id: "review-020",
      name: "Veerendra Chaudhary",
      rating: 5,
      date: "2 weeks ago",
      text: "First time booking after a friend recommended them. Driver reached in about 8 minutes, car was clean, and I paid exactly the rate quoted on WhatsApp. Simple and honest. Will book again.",
      source: "Google"
    },
    {
      id: "review-021",
      name: "Vishanu Baghel",
      rating: 5,
      date: "Edited 2 weeks ago",
      text: "My aunt from the US was visiting India and Vrindavan was on her list. Driver was polite, the car was air-conditioned throughout, and the route was smooth. She was very happy.",
      source: "Google"
    },
    {
      id: "review-022",
      name: "shyamal vinod",
      rating: 5,
      date: "2 weeks ago",
      text: "Used Padma Shree for a business trip to Firozabad. Driver was punctual and the ride was smooth. Comfortable to do some calls in the car during the journey.",
      source: "Google"
    },
    {
      id: "review-023",
      name: "Raj Tomar",
      rating: 5,
      date: "2 weeks ago",
      text: "My family of 4 went to Mathura, Vrindavan, and Govardhan in one day. Driver managed the long route and all the temple stops. Everyone tired but happy by evening.",
      source: "Google"
    },
    {
      id: "review-024",
      name: "Himanshu Singh",
      rating: 5,
      date: "2 weeks ago",
      text: "Used Padma Shree 4 times in one week during my Agra trip for all local movement. No surprises, no arguments, same quality each time. That consistency is what makes you a repeat customer.",
      source: "Google"
    },
    {
      id: "review-025",
      name: "Hotel vinayaka retreat's Birari etawah",
      rating: 5,
      date: "a month ago",
      text: "Regular outstation trips to Aligarh for business. Padma Shree has been my go-to for 8 months. No issues in any trip. That record speaks for itself.",
      source: "Google"
    },
    {
      id: "review-026",
      name: "Akash Chauhan",
      rating: 5,
      date: "a month ago",
      text: "I visit Vrindavan 2 to 3 times a year. Padma Shree has become my default for this route. Price is consistent and the drivers are always experienced with the temple routes.",
      source: "Google"
    },
    {
      id: "review-027",
      name: "Rajat Khambra",
      rating: 5,
      date: "a month ago",
      text: "Booked a round trip to Aligarh for a student admission interview. Driver waited 4 hours at the university. No extra charge was demanded. The fare we agreed on covered everything.",
      source: "Google"
    },
    {
      id: "review-028",
      name: "Dyaram Mishra",
      rating: 5,
      date: "a month ago",
      text: "Outstation trip to Shikohabad for some family work. Driver on time, good on the highway, no unnecessary stops. Got work done and returned by evening. Clean fare.",
      source: "Google"
    },
    {
      id: "review-029",
      name: "Rajeevyadav Yadav",
      rating: 5,
      date: "2 months ago",
      text: "I have been to Vrindavan over 30 times. Finding a reliable driver who does not rush you and does not charge extra for waiting has always been the challenge. Padma Shree solved that.",
      source: "Google"
    },
    {
      id: "review-030",
      name: "Vijay Sirohi",
      rating: 5,
      date: "2 months ago",
      text: "Superb",
      source: "Google"
    },
    {
      id: "review-031",
      name: "Kuldeep Dhakrey",
      rating: 5,
      date: "3 weeks ago",
      text: "Needed a cab urgently for a medical appointment. Got one in 15 minutes. Driver drove carefully and did not chat unnecessarily. Fair price. These small things matter when you are stressed.",
      source: "Google"
    }
  ];

  /* --------------------------------------------------------------------------
     PAGE → REVIEW IDS  (exactly 9 per page)

     Selection order: exact destination match first, then same trip type, then
     relevant general service review. No review was edited to fit a page — the
     outstation pages carry genuine Firozabad / Aligarh / Shikohabad trips
     because no Jaipur-specific review exists in the screenshots, and the
     Karauli page borrows genuine temple-tour reviews without implying those
     customers travelled to Kaila Devi or Balaji.
     -------------------------------------------------------------------------- */
  const PAGES = {

    /* Agra local movement, monuments, city knowledge, station/airport, bazaar. */
    'agra-local-sightseeing': [
      "review-024", // Himanshu Singh   — all local movement across an Agra trip
      "review-011", // Kalyan Boyapati  — knew the city, never inflated the fare
      "review-013", // Sudhir Chavan    — monuments, ticketing lines
      "review-003", // Ansh Chauhan     — Sadar Bazar, parking spots
      "review-014", // Deepu Singh Chahar — airport and station runs
      "review-020", // Veerendra Chaudhary — 8-minute pickup, WhatsApp rate
      "review-015", // Keshav sharma    — polite driver, clean car
      "review-002", // Shashank Dauhaliya — local cab service, no price argument
      "review-031"  // Kuldeep Dhakrey  — urgent local pickup in 15 minutes
    ],

    /* Outstation / long-distance. No Jaipur review exists — these are the
       genuine highway trips: Firozabad, Aligarh, Shikohabad. */
    'agra-to-jaipur': [
      "review-022", // shyamal vinod    — business trip, punctual, smooth ride
      "review-004", // Shivank Yadav    — outstation, price as quoted
      "review-010", // Sonu Kumar       — first choice for outstation from Agra
      "review-025", // Hotel vinayaka retreat's Birari etawah — 8 months regular
      "review-027", // Rajat Khambra    — 4-hour wait, no extra charge
      "review-028", // Dyaram Mishra    — highway, no unnecessary stops
      "review-008", // Tomar "Aryan Tomar" Singh220 — odd hours, reaches safely
      "review-020", // Veerendra Chaudhary — paid exactly the quoted rate
      "review-002"  // Shashank Dauhaliya — no argument over price
    ],

    /* Explicit Mathura / Vrindavan / Govardhan / Barsana / Nandgaon trips. */
    'agra-to-mathura-vrindavan': [
      "review-023", // Raj Tomar        — Mathura, Vrindavan, Govardhan in a day
      "review-001", // Aakash Sharma    — waited at each temple
      "review-006", // vikas kumar      — no rush at any temple, pilgrimage trip
      "review-012", // Rohit Bhardwaj   — Lathmar Holi, Barsana and Nandgaon
      "review-009", // Jitendra Singh   — regular Mathura devotee
      "review-016", // Hemant Tomar     — Agra to Vrindavan leg, three trips
      "review-017", // HITENDRA SINGH   — Mathura round trip for Holi
      "review-026", // Akash Chauhan    — experienced with the temple routes
      "review-029"  // Rajeevyadav Yadav — Vrindavan 30+ times, no waiting charge
    ],

    /* Agra sightseeing / monuments / tourist travel / driver waiting.
       No Fatehpur Sikri review exists; none has been altered to invent one. */
    'agra-to-Fatehpur-Sikri': [
      "review-013", // Sudhir Chavan    — knew each monument, ticketing lines
      "review-011", // Kalyan Boyapati  — knew the city, on time
      "review-024", // Himanshu Singh   — repeat local use across an Agra trip
      "review-007", // Shubham Upadhyay — day trip out of Agra, knew the route
      "review-027", // Rajat Khambra    — driver waited 4 hours, no extra charge
      "review-005", // Shreshtha Narwariya — comfortable, well-managed journey
      "review-021", // Vishanu Baghel   — visiting relative, AC car, smooth route
      "review-019", // Imbhupendra Singh — very good service, excellent driver
      "review-018"  // Raj Sekhar Sen   — good behaviour, clean car
    ],

    /* Temple / pilgrimage / family journeys / long routes / patient drivers. */
    'agra-karauli-kaila-devi-balaji': [
      "review-023", // Raj Tomar        — family of 4, long route, temple stops
      "review-012", // Rohit Bhardwaj   — full day, knew timing for each place
      "review-009", // Jitendra Singh   — driver respects religious nature
      "review-029", // Rajeevyadav Yadav — no extra charge for waiting
      "review-026", // Akash Chauhan    — drivers experienced with temple routes
      "review-007", // Shubham Upadhyay — family, fair and temple, ghats route
      "review-017", // HITENDRA SINGH   — fair price on a festival day
      "review-028", // Dyaram Mishra    — long trip, on time, clean fare
      "review-008"  // Tomar "Aryan Tomar" Singh220 — reliability, reaches safely
    ]
  };

  /* Public Google profile — used by the "View More Reviews on Google" link. */
  const PROFILE_URL = 'https://g.page/r/CUjtXu1x_3bPEBM';

  /* Resolve a page key to its 9 review objects (falls back to first 9). */
  function forPage(key) {
    const byId = new Map(POOL.map(r => [r.id, r]));
    const ids  = PAGES[key] || [];
    const picked = ids.map(id => byId.get(id)).filter(Boolean);
    return (picked.length ? picked : POOL).slice(0, 9);
  }

  return { POOL, PAGES, PROFILE_URL, forPage };
})();
