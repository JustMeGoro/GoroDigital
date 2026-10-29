# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners of small local businesses in Česko: craftsmen, auto shops, hair salons, bistros and pubs, small practices. They are not technical and often browse on a phone. A typical visitor lands on the site for the first time, wants to see the price and what they get for it right away, and only then cares who the person is and how the work is done. Many of these businesses have no website at all, only a Facebook page.

## Product Purpose

GoroDigital is the business card site of a one-person web design business. It exists so that a local business owner can understand the offer in seconds, trust the person behind it, and get in touch. Success is a visitor sending an enquiry through the contact form, calling, or emailing. The site also has to show that the owner can build very different, good-looking websites, since there are no client projects to show yet.

## Positioning

- One person: the client talks directly to the owner, with no middlemen.
- Fixed prices shown upfront, visible without asking for a quote.
- Fast delivery: 3 to 7 working days from start to finished site.
- Serious about quality: no half work, perfectionist about details.

## Operating Context

- Czech-language site for the Czech market.
- Contact paths: a contact form that sends to the owner's email (Web3Forms), email, and phone.
- Hosted as static files on Cloudflare (Workers assets), deployed from the GitHub repository `JustMeGoro/GoroDigital` on every push to `main`.
- Visitors discover it through direct outreach by the owner, a Google Business Profile (currently suspended, appeal pending), Firmy.cz, and later search.

## Capabilities and Constraints

- Plain static HTML, CSS and JavaScript; no build step.
- Sections, in order: hero with the price, pricing packages, process, portfolio of demo sites, a quote, about, contact.
- Current packages: Start (one-page site) 4 900 Kč; Standard (3–5 pages, contact form, basic local SEO, Google Business Profile link) 8 900 Kč; Péče & Provoz (hosting, SSL, small monthly edits) 390 Kč per month.
- The site is on a temporary `workers.dev` address until a custom domain is bought; canonical URLs, the sitemap, `robots.txt` and the share image reference that address and must be updated when the domain changes.
- Three demo sites live under `/demo/` (autoservis, salon, bistro). They are fictional, labelled as concepts, and excluded from search indexing.
- Terminology: the owner calls the packages "Start (Vizitka)", "Standard", and "Péče & Provoz (Měsíčně)".

## Brand Commitments

- Name: GoroDigital (written as one word, capital G and D).
- Voice: direct and plain; funny in small places, serious when the work matters. Uses "Svěřte web někomu, kdo to myslí vážně." as the hero promise.

## Evidence on Hand

- Three fictional demo sites at `demo/autoservis/`, `demo/salon/`, `demo/bistro/`.
- Real contact details: kontakt.gorodigital@gmail.com and 731 061 199.
- Absent, and not to be fabricated: client testimonials, client logos, completed client projects, statistics, awards, certifications, a photo of the owner, and a custom domain.

## Product Principles

1. Price and what is included come first; never hide cost behind "ask for a quote".
2. Never invent proof. Say plainly what exists (demos, offer, direct contact) and let real references replace placeholders when they arrive.
3. Make contacting the owner effortless on a phone: one clear action at a time.
4. Sound like one accountable person, not an agency: direct, brief, a little humor, no filler.
5. Keep it light and uncluttered; a first-time visitor should find what they came for without scrolling through noise.
