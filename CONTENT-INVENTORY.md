# Content inventory

Maps every part of the case study to where it appears on the site, and its current status.

## A · Original report (source document)

| Report part | Website location | Data key (`js/report-content.js`) | Status |
|---|---|---|---|
| 1. Introduction and chosen scenario | `#introduction` (01) | `introduction` | Awaiting source text |
| 2. Business structure: Pty Ltd versus sole trader | `#structure` (02) | `structure` | Awaiting source text |
| 3. Business registration and manufacturing contracts | `#registration` (03) | `registration` | Awaiting source text |
| 4. Legal risks involving misleading product information | `#risks` (04) | `risks` | Awaiting source text |
| 5. Risk management recommendations | `#risk-management` (05) | `riskManagement` | Awaiting source text |
| 6. Conclusion | `#conclusion` (06) | `conclusion` | Awaiting source text |
| In-text citations | Inside each section's text | (part of each section) | Awaiting source text |
| Nine original references | `#original-refs` | `references` | Awaiting source text (9 labelled slots) |

If the report contains more sections, add them to `index.html` as additional chapters, with a matching `data-report-slot` key and a matching entry in `report-content.js`.

## B · Additional Legal Considerations (new research, not part of the original report)

| Topic | Location | Sources |
|---|---|---|
| Customer Privacy & Data Protection (Privacy Act 1988 (Cth), small-business exemption and exceptions, APPs, practices) | `#privacy` (B1) | S1, S2 |
| Online Store Terms & Consumer Rights (consumer guarantees, store policies, ACCC sweep, change-of-mind vs statutory rights) | `#online-terms` (B2) | S3, S4, S8 |
| ABN, ACN, GST & business identity (extends sections 02 and 03) | `#abn-gst` (B3) | S6, S7, S9, S10 |
| Supplementary references | `#supplementary-refs` | S1–S10 |

## C · Practical website recommendations (illustrative)

| Component | Location |
|---|---|
| Supplier-contract checklist | `#supplier-checklist` (in 03) |
| Risk-analysis cards | `#risk-cards` (in 04) |
| Pre-checkout transparency checklist | `#checkout-checklist` (in B2) |
| Sample store footer | B2 |
| Footer policy outlines (Privacy Policy, Terms & Conditions, Shipping Policy, Returns & Refunds, Contact Us) | Site footer and sample footer → dialog |
