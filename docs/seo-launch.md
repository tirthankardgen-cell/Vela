# Vela search, content and AdSense launch

Production domain: **https://velastudio.space**. Public support: **contact@velastudio.space**. Search Console was already connected by the owner. AdSense publisher: **pub-6693217545827146**.

## Included in this change

The site has 18 public, crawlable HTML pages: home, about, features, how it works, flat templates, current pricing, FAQ, blog index, contact, privacy, terms, cookies and six individual planning articles. Each page has its own canonical URL and sharing metadata. The home page links to the guides instead of sample testimonials.

JSON-LD describes Vela as an Organization, WebSite and SoftwareApplication; public pages include WebPage types and breadcrumbs, articles include BlogPosting metadata, and FAQ schema uses the same answers that readers can open. The contact page uses ContactPage. No invented reviews, ratings, addresses, paid plans or service locations are included.

The sitemap uses the custom domain and real content dates. Account and workspace routes emit noindex and stay out of the sitemap; robots.txt allows them to be crawled so that noindex can be read. The legacy Vercel hostname and www hostname redirect permanently to the primary domain when those hosts are attached to this deployment.

`/feed.xml` is the blog RSS feed. `/llms.txt` provides a concise product description and source links for AI discovery. It is an optional discovery convention, not a guarantee that an AI system will use or recommend the website. Clear answers, crawlable content and structured data support SEO, answer-engine discovery and generative-engine discovery; rankings, indexing and rich-result display are controlled by the search providers. Google generally limits FAQ rich results to eligible authoritative health and government sites.

## Search Console: owner steps after deployment

1. Open the existing property for velastudio.space in [Search Console](https://search.google.com/search-console).
2. Submit **https://velastudio.space/sitemap.xml** in Sitemaps. Replace any old Vercel sitemap submission.
3. Inspect the home page, FAQ, blog index and a guide. Run the live URL test and request indexing where appropriate. Review the reported canonical after Google recrawls.
4. Check Page indexing and Core Web Vitals as traffic and crawl data become available. Test representative pages with [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/).

No new verification token is needed for an already verified property. If HTML-tag verification is needed later, set `GOOGLE_SITE_VERIFICATION` to the tag's content value in Vercel and redeploy. A Domain property uses DNS verification instead.

## AdSense: owner steps

The publisher ID supplied is for **AdSense**, which displays ads. It is not a Google Ads AW- tag for running promotion campaigns.

1. Add **velastudio.space** in [AdSense](https://www.google.com/adsense/) Sites if it is not already listed. Request the site review. Verification is prepared through the `google-adsense-account` meta tag and `/ads.txt`.
2. Confirm the publicly served ads.txt contains exactly:

   ```text
   google.com, pub-6693217545827146, DIRECT, f08c47fec0942fa0
   ```

3. Configure **Auto ads** for the approved site. Exclude account and application paths (`/login`, `/signup`, `/reset-password`, `/projects`, `/start`, `/studio`) in the AdSense account as well. The application already keeps the AdSense script out of these pages. Review ad formats and preview placements so they do not interfere with navigation or reading.
4. In AdSense **Privacy & messaging**, configure and publish the required privacy messages. For visitors in the EEA, UK and Switzerland, Google requires a Google-certified CMP with the applicable IAB TCF integration. Use Google's certified message option or another certified CMP; the site's browser preference panel alone is not that certified CMP. Confirm the published account message works before enabling ad delivery.
5. Set **`NEXT_PUBLIC_ADSENSE_ENABLED=true`** in Vercel production environment settings and redeploy. It defaults to false while account review and messaging are pending. After enablement, the asynchronous AdSense script loads only on public pages and only after advertising consent. Google controls approval, availability and ad delivery.

The website provides Necessary only, Customise and Accept all controls. Preferences persist for 180 days. Changing an active choice, including in another tab, reloads the page to stop existing tags and removes accessible first-party Google cookies. A full document navigation into account/workspace pages prevents scripts from remaining active there. Project data is not used for advertising events. Never click your own ads or ask visitors to do so.

## Optional GA4 analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the actual G- measurement ID and redeploy. Leave it empty to disable Analytics. Public page views load after analytics consent and use the canonical page path without query parameters. Google Signals and advertising personalisation for Analytics are disabled. Names, emails and project contents are not part of the configured events.

In the GA4 web stream, disable automatic browser-history page views and enhanced-measurement form interactions. The site sends its own page views and keeps account/project pages out of measurement. Do not enable automatic form or user-provided-data collection for the account workflow. No Google Ads conversion tag, campaign, AdSense account change or Analytics property is created by this repository.

## Publishing more guides

Add an object to **`src/lib/blog.js`** with a permanent unique slug, title, description, category, publication/update dates, image and alt text, a direct answer, useful sections, and related article slugs. The page, metadata, JSON-LD, reading time, blog cards, sitemap and RSS feed use this collection automatically. Rebuild to publish new slugs; unknown article slugs return 404.

Use real dates when publishing or revising content. Update `contentUpdated` in `src/lib/site.js` when the core public pages change. Keep claims aligned with the actual product, write specific guidance, and use images with permission and accurate provenance. `public/llms.txt` is intentionally a curated overview; update its guide links when the collection changes.

The contact page opens an email application. The repository does not provision a mailbox; the owner must ensure contact@velastudio.space receives mail. The current account integration uses Firebase Authentication and Firestore for private signed-in plans; guest projects, recovery drafts and tracing images stay local. Review the public copy and policies whenever data handling or account settings change.

## Validation

Use Node 24.x, install dependencies and run `npm run build`. Run `npm run start` on port 8767, then use:

```powershell
$env:VELA_BASE_URL='http://127.0.0.1:8767'
python tests/seo_smoke.py
python tests/landing_smoke.py
npm run test:branding
```

The Google-services test needs a separate test build with `NEXT_PUBLIC_ADSENSE_ENABLED=true` and `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST123`. It mocks all Google script requests and checks consent categories, persistence, query privacy, withdrawal, cross-tab updates and navigation into account pages. Never deploy that test measurement ID. Clear those environment variables and rebuild for the production configuration afterward.
