# NYC Access Wheelchair Transportation
## Premium Website Blueprint & Technical Architecture

> A complete build specification for a healthcare-grade, high-converting, WCAG 2.2 AA wheelchair transportation website.
> Intended audience: the developer (or agency) implementing the production Next.js version, plus the business owner making launch decisions.

---

## 0. How to read this document

This blueprint describes the **full production build** (Next.js 15 stack). You already have a **launch-ready static version** of this site (the HTML/CSS/JS files alongside this document) that implements the most important 80% today — homepage, six local landing pages, the smart multi-step booking wizard, payment page, and all schema. Treat the static site as **Phase 1 (live now)** and this blueprint as the **Phase 2 upgrade path** when the business is ready to invest in a developer.

A note on claims: anywhere this document mentions "licensed," "insured," "certified," or "background-checked," only publish it once it is verifiably true for the business. The copy is written so those trust elements live in clearly-swappable slots.

---

## 1. Information Architecture

Top-level navigation (max 6 items — cognitive load):

- **Home**
- **Services** (dropdown → individual service pages)
- **Service Areas** (dropdown → regional + borough pages)
- **How It Works**
- **FAQ**
- **Contact**
- Persistent: **Call (347) 806-9680** + **Book a Ride** (always visible)

Design principle: every page is at most 2 clicks from Home, and "Book a Ride" / "Call" is reachable from any scroll position (sticky header + mobile bar + floating buttons).

---

## 2. Sitemap

```
/                                 Home
/about                            About / trust story
/services                         Services hub
  /services/wheelchair-transportation
  /services/wheelchair-taxi
  /services/ambulette
  /services/nemt
  /services/hospital-discharge
  /services/dialysis
  /services/chemotherapy
  /services/medical-appointments
  /services/airport
  /services/senior
  /services/school
  /services/long-distance
/service-areas                    Areas hub
  /service-areas/manhattan
  /service-areas/brooklyn
  /service-areas/queens
  /service-areas/bronx
  /service-areas/staten-island
  /service-areas/long-island
  /service-areas/nassau-county
  /service-areas/suffolk-county
  /service-areas/westchester
  /service-areas/yonkers
  /service-areas/new-rochelle
  /service-areas/new-jersey
/how-it-works
/fleet
/safety
/faq
/book                             Multi-step booking wizard
/contact
/pay                              Payment / reservation
/accessibility                    Accessibility statement (WCAG)
/privacy
/terms
/thank-you                        Post-booking confirmation
```

Programmatic SEO note: service pages × area pages can generate high-value combination landing pages (e.g. `/services/dialysis/brooklyn`) once base pages rank. Do this only with genuinely unique copy per combination — thin duplicated pages are penalized.

---

## 3. Wireframe Layout (homepage, top to bottom)

1. Sticky header — logo, nav, phone, Book button
2. Hero — headline, subheadline, 2 CTAs, trust badges, key stats (24/7 · Areas served · Rated)
3. Trust bar — insured/licensed badges [SLOT], ADA, trained drivers
4. Services grid — 12 service cards
5. How It Works — 5-step visual flow
6. Why Choose Us — 6 benefit points + supporting imagery
7. Service Areas — grouped region list + embedded map
8. Compassionate-care band — human imagery + copy
9. Testimonials — [PLACEHOLDER until real reviews]
10. FAQ — accordion (20+ Q&A)
11. Final CTA — call + book
12. Footer — services, areas, company, legal, contact

Floating/persistent: WhatsApp button, mobile sticky Call/Book bar.

---

## 4. Homepage Structure & Copy

**Hero H1:** Wheelchair transportation that treats every rider with dignity, on every route.

**Subheadline:** Safe, ADA-friendly rides for medical appointments, hospital discharge, dialysis, and daily school transportation — across NYC, Westchester, Long Island, and New Jersey. Professional drivers and trained helpers, available 24/7.

**Primary CTA:** Book a Ride  |  **Secondary CTA:** Call (347) 806-9680

**Trust stats:** 24/7 Availability · 13+ Areas Served · Door-to-Door Assistance

---

## 5. Service Page Template

Each of the 12 service pages follows this structure for consistency and SEO:

1. **H1** — "[Service] in NYC & the Metro Area"
2. **Intro paragraph** — what it is, who it's for, reassurance
3. **Benefits list** — 4-6 bullets specific to that service
4. **"What to expect"** — 3-4 steps
5. **Related areas** — internal links to area pages
6. **Service-specific FAQ** — 3-5 Q&A
7. **CTA band** — book + call
8. **Schema** — `Service` + `FAQPage` + `BreadcrumbList`

### Service copy + keyword clusters

| Service | Primary keyword | Supporting keywords |
|---|---|---|
| Wheelchair Transportation | wheelchair transportation NYC | wheelchair accessible transportation, wheelchair van service |
| Wheelchair Taxi | wheelchair taxi NYC | accessible taxi, wheelchair cab near me |
| Ambulette | ambulette NYC | ambulette service, ambulette transportation |
| NEMT | NEMT NYC | non-emergency medical transportation, medical transport |
| Hospital Discharge | hospital discharge transportation | discharge transport, hospital to home transport |
| Dialysis | dialysis transportation NYC | dialysis rides, recurring dialysis transport |
| Chemotherapy | chemotherapy transportation | cancer treatment transport, oncology rides |
| Medical Appointments | doctor appointment transportation | medical appointment rides |
| Airport | wheelchair airport transportation | JFK/LGA/EWR accessible transport |
| Senior | senior transportation NYC | elderly transportation, senior medical rides |
| School | wheelchair school transportation | special needs school transport, daily student transport |
| Long Distance | long distance medical transportation | out-of-state medical transport |

---

## 6. Booking System UX (implemented in static site)

**Pattern:** 5-step wizard with progress bar. One decision cluster per step reduces abandonment vs. one long form.

- **Step 1 — Trip:** pickup, destination, date, time, one-way/round/recurring
- **Step 2 — Mobility:** uses wheelchair? → (conditional) has one / type
- **Step 3 — Access:** stairs at pickup/destination → (conditional) count + elevator
- **Step 4 — Assistance & medical:** transfer ability, companions, facility, appointment type, notes
- **Step 5 — Contact + review:** name, phone, email + auto dispatch-flag summary

**Auto dispatch logic** (runs client-side, sent with submission):
- Wheelchair = Yes → flag ADA lift van
- Has wheelchair = No → flag loaner wheelchair
- Type = Bariatric → flag bariatric vehicle
- Type = Power/Scooter → flag lift capacity check
- Stairs = Yes AND elevator ≠ Yes → flag extra helper
- Transfer = needs assistance → flag transfer assistance
- Appointment = dialysis/chemo/PT → flag likely recurring schedule

**UX standards:** address autocomplete (Google Places in production), real-time validation, mobile-first, WCAG 2.2 AA, click-to-call fallback, instant confirmation page, data structured for an admin dashboard.

---

## 7. Dispatch Workflow

```
Booking submitted
      ↓
Email to dispatch (with auto-computed flags)
      ↓
Dispatch reviews flags → determines:
   • Vehicle type (standard / bariatric / power-capable)
   • Helper required? (stairs, transfer assistance)
   • Loaner wheelchair needed?
   • Estimated trip duration
   • Driver assignment
      ↓
Confirmation to rider (phone + email) with pickup window
      ↓
Driver dispatched → door-to-door service → completion
```

In production, replace email-only intake with a lightweight database (bookings table) + admin dashboard so dispatch can manage status, assign drivers, and track recurring schedules.

---

## 8. Content Strategy

- **Tone:** calm, competent, warm. Healthcare-grade trust, not rideshare hype.
- **Reading level:** ~8th grade. Many users are seniors or stressed caregivers.
- **Every page** answers: Is this safe? Can they handle my specific need? How fast can I book?
- **Blog (Phase 2):** target informational queries ("how to arrange transport after hospital discharge," "does Medicaid cover ambulette in NY") to capture top-of-funnel search and build topical authority.

---

## 9. SEO Strategy

- **Per-page unique** title, meta description, H1, canonical.
- **Local landing pages** (already built) are the core ranking mechanism — one page per area, each genuinely unique.
- **Schema.org JSON-LD** on every page (see §13).
- **Google Business Profile** is co-equal with the website for a local service business — claim it, complete every field, match NAP exactly, gather reviews.
- **Internal linking:** every service links to relevant areas and vice versa.
- **Core Web Vitals** as a ranking factor — the static build is already lightweight; keep it that way.

**Title tag formula:** `[Service/Area] Wheelchair Transportation | NYC Access Wheelchair Transportation`
**Meta description formula:** benefit + area + service + phone CTA, under 155 chars.

---

## 10. Accessibility Strategy (WCAG 2.2 AA)

This is both an ethical requirement and a competitive advantage for a disability-serving business.

- Semantic heading hierarchy (one H1 per page, ordered H2/H3)
- Skip-to-content link
- Full keyboard navigation, visible focus states (never `outline:none` without replacement)
- ARIA labels on icons, form controls, and landmark regions
- Form fields with associated `<label>`, error messages tied via `aria-describedby`
- Color contrast ≥ 4.5:1 body / 3:1 large text — the navy/amber/teal palette meets this
- Touch targets ≥ 44×44px (WCAG 2.2 target-size)
- Respect `prefers-reduced-motion`
- Alt text on all meaningful images
- Test with: axe DevTools, Lighthouse, VoiceOver/NVDA, keyboard-only pass

---

## 11. Performance Optimization

Target: LCP < 2.5s, CLS < 0.1, INP < 200ms.

- Modern image formats (WebP/AVIF), explicit width/height to prevent layout shift
- Lazy-load below-fold images
- Font: preconnect + `font-display: swap` (already done)
- Minimal JS (static site ships almost none)
- In Next.js: server-side rendering / static generation, code splitting, `next/image`, prefetching
- CDN caching (Netlify/Vercel automatic)
- Monitor with Lighthouse CI + Vercel Analytics / Search Console Core Web Vitals report

---

## 12. Technical Architecture (production Next.js)

**Stack:** Next.js 15 (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · React Hook Form + Zod · Google Maps/Places API · Schema.org JSON-LD · GA4 · Vercel.

**Folder structure:**
```
/app
  /(marketing)
    page.tsx                    # home
    /services/[slug]/page.tsx
    /service-areas/[slug]/page.tsx
    /how-it-works/page.tsx
    /fleet/page.tsx
    /safety/page.tsx
    /faq/page.tsx
    /about/page.tsx
    /contact/page.tsx
  /book/page.tsx                # wizard
  /pay/page.tsx
  /thank-you/page.tsx
  /api
    /booking/route.ts           # POST → validate (Zod) → store + notify
  layout.tsx
  sitemap.ts
  robots.ts
/components
  /ui                           # shadcn primitives
  Header.tsx  Footer.tsx  MobileBar.tsx  WhatsAppFloat.tsx
  Hero.tsx  ServiceCard.tsx  AreaCard.tsx
  /booking
    BookingWizard.tsx  StepTrip.tsx  StepMobility.tsx
    StepAccess.tsx  StepAssistance.tsx  StepContact.tsx
    useDispatchFlags.ts         # the auto-flag logic
/lib
  services.ts  areas.ts  faqs.ts   # single source of truth for content
  schema.ts                        # JSON-LD builders
  validation.ts                    # Zod schemas
/content                           # optional MDX for blog
```

**Best practices:** content in typed data files (not hardcoded in JSX) so pages generate from one source; Zod validation shared client + server; environment variables for API keys (never committed); `generateStaticParams` for all service/area pages; `generateMetadata` per route.

---

## 13. Structured Data (Schema.org JSON-LD)

Implement these types (the static site already includes LocalBusiness, FAQPage, BreadcrumbList):

- **LocalBusiness** (+ consider `MedicalBusiness` subtype) — name, phone, email, areaServed, openingHours, priceRange
- **Organization** — brand, logo, contactPoint
- **Service** — one per service page, with `provider` and `areaServed`
- **FAQPage** — on home, service, and area pages
- **Review** / **AggregateRating** — ONLY once real reviews exist (never fabricate)
- **BreadcrumbList** — every non-home page
- **ContactPoint** — phone, contactType "customer service", 24/7 hours

---

## 14. Component Structure

Reusable components (props-driven, content from `/lib` data files):

- `Hero` (title, subtitle, ctas, stats)
- `ServiceCard` (icon, title, blurb, href) — mapped over `services.ts`
- `AreaCard` (region, name, href) — mapped over `areas.ts`
- `FAQAccordion` (items[]) — with FAQPage schema auto-generated
- `TrustBar`, `StepFlow`, `Testimonial` (gated behind real-data flag)
- `BookingWizard` + step components + `useDispatchFlags` hook
- `Header` / `Footer` / `MobileBar` / `WhatsAppFloat` (site chrome)

---

## 15. Conversion Optimization Strategy

- **Sticky Call + Book** always visible (header, mobile bar, floats) — implemented
- **Click-to-call** everywhere the phone appears — implemented
- **WhatsApp float** for low-friction contact — implemented
- **Multi-step wizard** (higher completion than one long form) — implemented
- **Trust indicators** near CTAs (badges, stats)
- **FAQ** placed to resolve objections before the final CTA — implemented
- **Google Reviews** widget once reviews exist
- **Analytics:** GA4 events on call clicks, book starts, step completions, submissions — instrument the wizard's step transitions to find drop-off
- **Exit-intent** (Phase 2): offer "Call us now" modal on desktop exit
- **A/B test** hero headline and CTA copy once traffic supports it

---

## 16. Future Scalability

- **Admin dashboard + database** — move bookings from email to a managed store (bookings, riders, recurring schedules, driver assignments)
- **Real payment** — Stripe/Square payment links now; hosted checkout or invoicing later
- **Reviews pipeline** — automate Google review requests post-trip; display with Review schema
- **Driver app / dispatch tooling** — assignment, status, ETA
- **Programmatic service×area pages** — once base pages rank, with unique copy
- **Blog / content engine** — MDX, targeting informational queries
- **Insurance/Medicaid documentation** — receipt generation for reimbursement (a real differentiator competitors advertise)

---

*Prepared as a build specification. Phase 1 (static site) is live-ready today; Phase 2 (Next.js) is the upgrade path when developer investment is justified.*
