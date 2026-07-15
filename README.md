# OVX — Omni Venture Express Website

**Tagline:** "Where Global Access Becomes Local Opportunity"

A modern, multi-page marketing + light client-service website for **Omni Venture Express (OVX)**, a Kigali, Rwanda-based venture offering five service lines: Global Shipping & Logistics, Real Estate Negotiation, Fashion & Interior Design Marketing, Affiliate Marketing Network, and Study & Work Abroad Consultation.

> ⚠️ **Backend note:** The project brief requested Supabase as the backend. This environment does not support connecting to an external Supabase project — instead, all dynamic data is powered by the built-in **RESTful Table API** (a fully hosted, per-project data store with the same REST semantics: GET/POST/PUT/PATCH/DELETE on `tables/{name}`). This preserves the "no hardcoded content" requirement — every stat, service, testimonial, country entry, form submission, etc. is read from and written to real backend tables, just via the platform's native Table API rather than Supabase specifically. If real Supabase is a hard requirement, the `js/api.js` wrapper is the single file that would need to be swapped for the Supabase JS client — every page calls only `OVX.*` helper methods, not raw fetch calls, to make that swap straightforward later.

---

## ✅ Completed Features

### Pages
| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, live stats counter, services grid, "Why Choose OVX", testimonials, CTA banner |
| Services (listing) | `services.html` | Grid of all 5 services from the `services` table |
| Service Detail | `service-detail.html?slug=...` | Dynamic single-service page with description, "what's included" list, and inquiry form (→ `inquiries` table) |
| Study & Work Abroad | `study-abroad.html` | Searchable/filterable country guide (14 countries) with a "Book Advisory Session" modal (→ `bookings` table) |
| Affiliate Program | `affiliate.html` | How-it-works, signup form (auto-generates referral code → `affiliates` table), and email-based dashboard lookup |
| Client Portal | `portal.html` | Email-based lookup of a client's shipment / real estate / consultation status (`client_records` table) |
| About Us | `about.html` | Vision, Mission, Core Values — all pulled from `about_content` table |
| Contact | `contact.html` | Contact form (→ `contact_messages`), office info, WhatsApp button, Google Maps embed |

### Shared components
- `js/main.js` — renders header/nav (with mobile menu), footer (with dynamic social links + newsletter signup → `subscribers` table), floating WhatsApp button, fade-in scroll animations, animated stat counters.
- `js/api.js` — single data-access layer (`OVX.list`, `OVX.create`, `OVX.listAll`, `OVX.getSetting`, `OVX.getSettingsMap`, `OVX.genReferralCode`) used by every page — no page talks to `fetch('tables/...')` directly except through this wrapper.
- `css/style.css` — full design system (navy `#0B1F3A` / blue `#2F5DFF` / gold accent), responsive grid layouts, card components, forms, modal, dashboard styling.

### Design
- Brand colors and uploaded OVX logo (`images/ovx-logo.png`) applied across header/footer/favicon.
- Mobile-first responsive layout (breakpoints at 992px / 860px / 768px / 640px / 560px).
- Subtle fade-in-on-scroll animations and hover effects — no heavy JS frameworks.
- Font Awesome icons + Google Fonts (Inter).

---

## 🔗 Functional Entry Points (Pages & Params)

- `/index.html`
- `/services.html`
- `/service-detail.html?slug={shipping-logistics|real-estate|design-marketing|affiliate-network|study-work-abroad}`
- `/study-abroad.html`
- `/affiliate.html`
- `/portal.html`
- `/about.html`
- `/contact.html`

No server-side routing is required — all navigation is static links between `.html` files, and query params (`?slug=`) drive client-side data fetching only.

---

## 🗄️ Data Model (RESTful Table API)

All tables include the standard system fields (`id`, `gs_project_id`, `gs_table_name`, `created_at`, `updated_at`) in addition to the fields below.

| Table | Purpose | Key Fields |
|---|---|---|
| `stats` | Home page stat counters | label, value, suffix, icon, sort_order |
| `services` | 5 core services | slug, title, summary, description, icon, image_url, whats_included (array), sort_order |
| `testimonials` | Client testimonials | name, role_company, message, rating, avatar_url, sort_order |
| `why_choose` | "Why Choose OVX" cards | title, description, icon, sort_order |
| `countries` | Study/Work abroad guide | name, region, key_cities, avg_living_cost, work_study_pathway, food_lifestyle_note, visa_route, flag_url |
| `about_content` | Vision / Mission / Values | section (vision/mission/value), title, description, icon, sort_order |
| `site_settings` | Contact info & social links | key, value |
| `inquiries` | Service inquiry submissions | name, email, phone, service_type, message |
| `bookings` | Advisory session bookings | name, email, phone, country, preferred_date, message, status |
| `affiliates` | Affiliate signups | name, email, phone, referral_code, signup_count |
| `subscribers` | Newsletter signups | email |
| `contact_messages` | Contact form submissions | name, email, phone, subject, message |
| `client_records` | Client Portal status records | client_email, record_type, title, status, details, last_update_note |

All read-only content tables (`stats`, `services`, `testimonials`, `why_choose`, `countries`, `about_content`, `site_settings`) have been seeded with real content sourced from the OVX Institutional Blueprint. Form-writing tables (`inquiries`, `bookings`, `affiliates`, `subscribers`, `contact_messages`) start empty and populate as visitors interact with the site. Two sample rows exist in `client_records` under `demo@ovx.rw` so the Client Portal can be tested immediately.

---

## 🚧 Not Yet Implemented / Simplified vs. Original Spec

- **Supabase Auth login/register** for the Affiliate Dashboard and Client Portal was requested, but true authenticated sessions require a real auth backend. Instead, both dashboards use a **simple email-based lookup** (no password) against the Table API, which keeps the "static site" constraint intact while still giving clients/affiliates a way to view their own records. If real authentication is needed later, this project would need to integrate an auth-capable backend (e.g. Supabase Auth, or the platform's own access-control rules for page-level gating).
- Real-time "live" updates (e.g. testimonials appearing without refresh) are not implemented as WebSocket subscriptions — data is fetched fresh on every page load, which satisfies "not hardcoded" but is not push-based real-time.
- Payment processing / affiliate payouts are out of scope for a static site and are not implemented.

---

## 🛣️ Recommended Next Steps

1. Replace placeholder contact details (`site_settings` table) with OVX's real office address, phone, and social handles.
2. Add real client photos/testimonial avatars and service images if OVX has brand photography.
3. If real user authentication is required for the Client Portal / Affiliate Dashboard, evaluate the platform's Hosted Access Rules or a dedicated auth backend.
4. Consider adding an admin-only page (or use the Table API directly) to manage `inquiries`, `bookings`, and `contact_messages` as they come in.
5. Add analytics (e.g. Plausible or GA4) once the site is live.

---

## 🌍 Public URLs

Publish this project via the **Publish tab** to obtain a live production URL. All table data is powered by the project's built-in Table API — no external environment variables or API keys are required.

---

## 🎨 Brand

- **Name:** Omni Venture Express (OVX)
- **Colors:** Navy `#0B1F3A`, Blue accent `#2F5DFF`, White, Gold `#D4AF37` highlight
- **Logo:** `images/ovx-logo.png` (user-provided)
- **Font:** Inter (Google Fonts)
- **Icons:** Font Awesome 6
