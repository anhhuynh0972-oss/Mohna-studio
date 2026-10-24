# MŌnah Studio — Designing a Startup with a Strong Legal Foundation

A bilingual (English | Tiếng Việt) editorial website for the MŌnah Studio academic case study.
Static HTML, CSS and vanilla JavaScript: no build step, backend, database, API keys or paid services.

## Run it locally in VS Code

1. Unzip `monah-studio.zip` and open the `monah-studio` folder in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (by Ritwick Dey). VS Code will suggest it when the folder opens.
3. Right-click `index.html` and choose **Open with Live Server**, or click **Go Live** in the status bar.
4. The site opens at `http://127.0.0.1:5500/` (Live Server's default port).

No VS Code? From the project folder you can also run `python3 -m http.server 5500` and open `http://localhost:5500`.
You can also open `index.html` directly in a browser; everything works except saving checklist ticks in some browsers.

## Important: adding the original report

The original report file was **not available** when this edition was built. To protect academic integrity, sections 01–06 and the nine original references are shown as clearly labelled "awaiting original report text" slots. No report wording, citations or references were invented.

To complete the site:

1. Open `js/report-content.js`.
2. Paste each section's text, as HTML, into `en` (the original) and `vi` (a faithful Vietnamese translation):
   `introduction`, `structure`, `registration`, `risks`, `riskManagement`, `conclusion`.
   Keep every in-text citation exactly as written.
3. Add the nine references, in their original order, to `references`.
4. Save and refresh. The slots fill in both languages, and the "Source status" notice disappears once every section and the references are present.
5. Put a copy of the report file itself in `assets/original-report/`.

If a section has English text but no Vietnamese yet, the VI view shows the English original with a note that the translation is being prepared.

## What's in the site

| Content type | Where | Label on page |
|---|---|---|
| **A · Original Report** | Sections 01–06, Original references | outlined "A · Original Report" tag |
| **B · Additional Legal Considerations** | B1 Privacy, B2 Online store terms, B3 ABN/ACN/GST, Supplementary references [S1]–[S10] | burgundy "B · Additional Research" tag |
| **C · Website Recommendations** | Supplier-contract checklist (03), risk-analysis cards (04), pre-checkout checklist and sample footer (B2), footer policy outlines | dashed "C · Website Recommendation" tag |

Features:

- An EN | VI switcher. Switching is instant, keeps your reading position and is remembered on the next visit. `?lang=vi` opens in Vietnamese.
- A sticky navigation bar, a reading progress bar, and a section rail on wide screens.
- Interactive risk cards with filters.
- Two checklists with progress meters. Ticks are saved in your browser only.
- Footer links (Privacy Policy, Terms & Conditions, Shipping Policy, Returns & Refunds, Contact Us) that open illustrative policy outlines.
- Responsive layouts, keyboard support and reduced-motion support.

## Opening hero (scroll-expansion)

The page opens with a scroll-expansion hero, a vanilla port of the `ScrollExpandMedia` React component.

**How it behaves:**

1. The editorial photo (`assets/images/hero-editorial.webp`) starts as a portrait card between the words *MŌnah* and *Studio*.
2. As you scroll, it expands to full-bleed while the words slide apart.
3. The headline and call-to-action then appear over the open wall on the left of the photo.

**How it works:**

- One CSS variable, `--p` (0→1), drives the effect on a sticky stage. It is set in `js/main.js`, function `updateHero`.
- Unlike the React original, it does not intercept wheel or touch events. Nav links, keyboard scrolling and the reading-progress bar keep working.
- With "reduce motion" turned on, the hero shows its final, expanded state.

**Why it isn't the React file:** the component in `components/ui/scroll-expansion-hero.tsx` needs Next.js, Tailwind, TypeScript and framer-motion, plus a build step. This project is plain HTML so it runs under Live Server with no build.

To move to that stack later:

1. Run `npx create-next-app@latest` with TypeScript, Tailwind and the App Router.
2. Run `npx shadcn@latest init`, which creates `components/ui`. shadcn-style components are copied into that folder and imported as `@/components/ui/...`.
3. Run `npm i framer-motion`.

## Other imagery

The remaining editorial frames use original illustrated artwork in `assets/images/art-*.svg`: a woven care label, an atelier table and a gift box.
To use your own photographs:

1. Copy them into `assets/images/`.
2. Set the paths in `js/images.js`, e.g. `atelier: "assets/images/atelier.jpg"`.

If a photo is missing, the illustration stays in place. If the hero photo is missing, the draped-silk illustration (`art-hero.svg`) is shown instead.

Fonts (Playfair Display, DM Sans) load from Google Fonts when online. Offline, the site falls back to Georgia and Helvetica.

## Verification notes for the supplementary research

- **Checked directly on official pages:**
  - OAIC "Small business" and "APP quick reference".
  - business.gov.au pages on GST, ABN and the Australian Consumer Law.
  - ASIC pages on the ACN and on registering a company.
- **ACCC pages:** the ACCC website blocked automated access. The sweep findings were checked against iTWire's 4 February 2025 report of the release, which is cited as [S4].
- **ACCC "Buying online" [S5]:** listed because it was a suggested source, but no claim on the site relies on it.
- **Legal obligations vs recommended practice:** the site separates them throughout. It does not claim that every small business is covered by the Privacy Act, or that every online seller must display an ABN.

Nothing on this site is legal advice.

## Project structure

```
monah-studio/
├── index.html                 Page structure and all bilingual text
├── css/styles.css             Editorial design system
├── js/main.js                 Language switching, navigation, checklists, cards, dialogs
├── js/report-content.js       ← paste the original report here
├── js/images.js               Optional photography paths
├── assets/images/             Hero photo (hero-editorial.webp), illustrated artwork (SVG) + your photos
├── assets/original-report/    Place the original report file here
├── CONTENT-INVENTORY.md       Map of every report section to its website location
└── README.md
```
