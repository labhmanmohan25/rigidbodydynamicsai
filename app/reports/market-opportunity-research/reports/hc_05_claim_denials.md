# Insurance Claim Denial Management

**Prepared:** 2026-02-24
**Data vintage:** Primarily 2023-2025 sources (from analyst training data; live web verification was unavailable)
**Caveat:** WebSearch and WebFetch tools were blocked during this session. All figures below are drawn from the analyst's training corpus (cut-off May 2025) and cite the original publication sources. Numbers should be independently verified before use in investment memos.

---

## 1. PROBLEM MARKET SIZE

### Revenue at Risk from Claim Denials

| Metric | Value | Source |
|--------|-------|--------|
| Total US hospital revenue billed to insurers (2024) | ~$1.5 trillion | AHA Annual Survey / CMS NHE data |
| Initial denial rate (industry average) | 10-15% of all claims; up to 20-25% at some systems | HFMA 2023 "Denial Benchmarking" report; Experian Health 2024 survey |
| Revenue initially denied | **$150B - $225B annually** | Derived from above |
| Net write-off from denials (after appeals) | ~1.5-3% of net patient revenue | HFMA; Crowe RCA benchmarking |
| Estimated annual write-offs from denials | **$20B - $45B** | Derived; aligns with KFF and Advisory Board estimates |

### Cost Hospitals Spend on Denial Management

| Metric | Value | Source |
|--------|-------|--------|
| Average cost to rework/appeal a single denied claim | $25 - $118 per claim (varies by complexity) | AAPC 2023; Change Healthcare 2024 Revenue Cycle Index |
| Estimated total industry spend on denial management (staff, appeals, outsourcing, write-offs combined) | **$19.7B - $25B+** | Becker's Hospital Review 2023; derived from FTE and outsourcing data |
| Average hospital employs dedicated denial FTEs | 15-50 FTEs per mid-large hospital system | HFMA workforce surveys |
| Avg fully loaded cost per denial management FTE | $55,000 - $75,000/year | Bureau of Labor Statistics; Becker's |

**Bottom line:** Denials put $150B-225B of hospital revenue at risk annually. Hospitals collectively spend $20B+ fighting them, and still write off $20B-45B.

---

## 2. CURRENT SPEND TO MANAGE

### Revenue Cycle Management (RCM) Software Market

| Metric | Value | Source |
|--------|-------|--------|
| 2023 market size | $154B - $160B (includes services + software) | Grand View Research 2024; Verified Market Research |
| 2024 estimated | ~$176B | Grand View Research |
| 2030 forecast | $329B - $398B | Grand View Research; Fortune Business Insights |
| CAGR (2024-2030) | 10.3% - 11.5% | Multiple analyst firms |

*Note: The broader RCM market includes outsourced services, not just software. The software-only segment is a subset (~$20-25B in 2024).*

### Denial Management Software (Sub-Segment)

| Metric | Value | Source |
|--------|-------|--------|
| 2023 estimated market size | $4.5B - $5.5B | Derived from Grand View Research RCM segmentation |
| CAGR | 12-14% | Market Research Future; Allied Market Research |
| 2030 forecast | $10B - $13B | Projected |

### Medical Billing Outsourcing Market

| Metric | Value | Source |
|--------|-------|--------|
| 2023 market size | $13.5B - $14.8B | Polaris Market Research; Grand View Research |
| CAGR (2024-2030) | 10.1% - 12.3% | Multiple sources |
| 2030 forecast | $26B - $30B | Projected |

---

## 3. COST OF INACTION

| Metric | Value | Source |
|--------|-------|--------|
| % of denied claims never appealed | **50-65%** | Premier Inc. 2023 analysis; Advisory Board 2024 |
| Reason most not appealed | Cost-to-appeal exceeds claim value, or staff bandwidth exhausted | HFMA |
| Average cost to work one denial | $25 (simple) to $118 (complex/clinical) | Change Healthcare 2024 Index; AAPC |
| Average cost to file a formal appeal | $48 - $118 per claim | AAPC; Experian Health |
| Revenue lost from uncontested denials annually | **$10B - $27B** (est. 50-65% of $20B-$45B write-off pool) | Derived |
| Appeal overturn/success rate (when pursued) | 50-70% | MGMA 2023; HFMA |

**Key insight:** More than half of denied claims are never contested, yet when hospitals do appeal, they win 50-70% of the time. This represents a massive recoverable revenue pool that is abandoned due to operational capacity constraints.

---

## 4. VOLUME FREQUENCY

| Metric | Value | Source |
|--------|-------|--------|
| Total medical claims submitted/year (US, all payers) | **~6 billion** claims (professional + institutional combined) | CAQH 2024 Index; CMS data |
| Hospital/facility claims specifically | ~1.2 - 1.5 billion | AHA; derived from CMS |
| Initial denial rate (all claims) | 10-15% | Experian Health 2024; Change Healthcare |
| Initial denial rate (hospital inpatient) | 15-25% (higher complexity) | HFMA 2023; KFF |
| Claims denied on first submission annually | **~200-350 million** hospital claims | Derived |
| Prior authorization denial rate (Medicare Advantage) | 13-18% of prior auth requests | KFF 2024 Medicare Advantage report; OIG |
| Appeals filed as % of denials | **35-50%** | Premier; Advisory Board |
| Estimated appeals filed annually (hospital) | ~70-175 million | Derived |
| Average time to resolve a denial (rework + appeal) | **30-60 days** (simple); **90-180+ days** (complex/multi-level appeal) | HFMA; Waystar benchmarking data |
| Average days in A/R for denied claims | 45-90 days beyond initial billing cycle | MGMA benchmarks |

---

## 5. WHY STILL UNSOLVED

Despite billions invested in RCM technology, denial rates have **risen ~23% over the past decade** (Change Healthcare Index, 2024). Key structural reasons:

### 5.1 Payer Algorithm Changes (Moving Target Problem)
- Insurers continuously update clinical criteria, coverage policies, and prior auth rules
- Medicare Advantage plans use proprietary AI/ML algorithms to auto-adjudicate (and auto-deny) claims
- OIG found MA plans denied 13-18% of prior auths, many of which met Medicare coverage criteria
- Payer rule changes outpace provider RCM software update cycles

### 5.2 Coding Complexity Explosion
- ICD-10 has ~72,000 diagnosis codes vs. ~14,000 in ICD-9
- CPT code updates annually (300+ changes/year)
- Modifier requirements increasingly complex
- Clinical documentation must precisely match coding requirements

### 5.3 Staff Turnover and Workforce Crisis
- Medical coder/biller turnover: 25-40% annually (AAPC 2024 salary survey)
- Average time to train a denial management specialist: 6-12 months
- Post-COVID burnout accelerated departures from revenue cycle roles
- Experienced coders retiring faster than replacements entering

### 5.4 Data Fragmentation
- Average hospital uses 15+ disparate systems (EHR, PM, clearinghouse, payer portals)
- Lack of real-time eligibility/benefit verification at point of care
- Clinical documentation lives in EHR; billing data in PM system; payer rules on external portals
- No single source of truth connecting clinical, financial, and payer data

### 5.5 Misaligned Incentives
- Payers benefit financially from denials (float, write-offs)
- Payers face minimal penalties for inappropriate denials
- Provider appeals process is deliberately cumbersome
- CMS has been slow to enforce payer accountability

### 5.6 Legacy RCM Software Limitations
- Most RCM platforms are rules-based, not predictive
- Retrospective denial tracking vs. prospective denial prevention
- Batch processing vs. real-time intervention
- Limited NLP/AI capability for clinical documentation analysis

---

## 6. WILLINGNESS TO PAY SIGNALS

### What Hospitals Pay Today

| Category | Annual Spend | Source |
|----------|-------------|--------|
| In-house RCM team (avg mid-size hospital, ~50 FTEs) | $3M - $5M/year | BLS; HFMA |
| In-house RCM team (large health system, 200+ FTEs) | $12M - $20M/year | Becker's |
| Outsourced RCM services (% of collections model) | 4-8% of net patient revenue | HFMA; vendor benchmarks |
| Outsourced RCM for a $500M revenue hospital | $20M - $40M/year | Derived |
| Denial management software (per-provider pricing) | $50K - $500K/year per facility | Vendor pricing; KLAS |
| AI-powered denial prevention platforms | $200K - $1M+/year per health system | KLAS 2024; vendor data |

### VC/PE Investment Activity (2023-2025)

| Company / Deal | Amount | Date | Investor(s) |
|----------------|--------|------|-------------|
| Waystar IPO | ~$968M raised (IPO) | June 2024 | Public markets (backed by EQT, CPPIB) |
| Akasa (AI for RCM) | $60M Series B | 2023 | Andreessen Horowitz (a16z) |
| AKASA total raised | $120M+ | Through 2024 | a16z, BOND, others |
| Olive AI (RCM automation) | Wound down; assets acquired by Waystar, others | 2023 | Previously raised $900M+ |
| Infinx (AI prior auth) | $75M+ total | 2023-2024 | Multiple PE/VC |
| Apixio/ClaimLogiq (AI denials) | Acquired by New Mountain Capital | 2023 | PE |
| R1 RCM | Acquired by TowerBrook/CD&R for $8.9B | 2024 | PE |
| Ensemble Health Partners | Acquired by Bon Secours for strategic partnership | 2024 | Health system |
| Nividous / Autonomize AI | $15-30M rounds for RCM AI startups | 2023-2024 | Various VC |
| Medallion (credentialing/RCM adjacent) | $44M Series C | 2024 | Various |

**Signal strength:** The R1 RCM acquisition at $8.9B and Waystar IPO at ~$3.7B market cap on listing day demonstrate massive PE/public market appetite. Multiple AI-native startups raising $50M-$120M rounds specifically for denial management signals strong WTP for next-gen solutions.

---

## 7. MARKET GROWTH RATE

| Segment | 2024 Size (Est.) | 2030 Forecast | CAGR |
|---------|-------------------|---------------|------|
| Total RCM Market (services + software) | $176B | $329B - $398B | 10.3% - 11.5% |
| RCM Software Only | $20B - $25B | $48B - $55B | 11% - 13% |
| Denial Management Software | $5B - $6B | $10B - $13B | 12% - 14% |
| Medical Billing Outsourcing | $14B - $15B | $26B - $30B | 10% - 12% |
| AI in Healthcare RCM (sub-segment) | $2B - $3B | $8B - $12B | 20% - 25% |

**Key growth drivers:**
- Regulatory complexity increasing (No Surprises Act, prior auth reform)
- Labor shortages forcing automation adoption
- Medicare Advantage enrollment growth (more complex payer mix)
- AI/ML maturation enabling predictive denial prevention
- CMS interoperability mandates creating data availability

---

## 8. KEY PLAYERS TODAY

### Major RCM / Denial Management Companies

| Company | Est. Revenue (2024) | Segment Focus | Notes |
|---------|---------------------|---------------|-------|
| **Waystar** | ~$770M-$850M | RCM software, clearinghouse, denial mgmt | IPO June 2024; EQT-backed; acquired Olive AI assets |
| **R1 RCM** | ~$2.2B | End-to-end RCM outsourcing + tech | Acquired by TowerBrook/CD&R for $8.9B (2024) |
| **Cotiviti** (Verscend) | ~$1.0B-$1.2B | Payment accuracy, analytics, risk adjustment | Owned by Veritas Capital; serves payer + provider |
| **Change Healthcare** (Optum) | ~$3.5B+ (segment) | Clearinghouse, RCM, payment integrity | Part of UnitedHealth/Optum after $7.8B acquisition (2022); major cyberattack Feb 2024 |
| **nThrive** (now part of R1 RCM) | Folded into R1 | Coding, CDI, denial management | Merged with R1 RCM |
| **Omega Healthcare** | ~$500M-$700M | RCM outsourcing (India-based operations) | Large offshore BPO for RCM |
| **Ensemble Health Partners** | ~$1.0B+ | End-to-end RCM outsourcing | Strategic deals with health systems |
| **GeBBS Healthcare** | ~$200M-$300M | RCM outsourcing, coding | India-based |
| **AGS Health** | ~$150M-$250M | RCM outsourcing, denial management | India-based |
| **Experian Health** | ~$500M-$700M (health segment) | Eligibility, claims, patient access | Part of Experian plc |

### AI-Native Disruptors

| Company | Funding / Stage | Focus |
|---------|-----------------|-------|
| **AKASA** | $120M+ raised | AI-powered RCM automation |
| **Infinx** | $75M+ raised | AI prior authorization |
| **Apixio / ClaimLogiq** | PE-backed (New Mountain) | AI-powered denial management |
| **Adonis** | ~$20M+ raised | AI denial prevention for physician groups |
| **Rhyme Health** | Early stage | AI denial appeals automation |
| **Valer** | Early stage | Denial prediction and prevention |

---

## 9. KEY SOURCES

All sources referenced in this report. Note: URLs are provided as best-known links; some may require subscription access.

### Industry Associations and Government

1. **HFMA (Healthcare Financial Management Association)** - Denial benchmarking reports and workforce surveys
   - https://www.hfma.org/topics/financial-sustainability/
2. **KFF (Kaiser Family Foundation)** - Medicare Advantage denial data
   - https://www.kff.org/medicare/issue-brief/over-35-million-prior-authorization-requests-were-submitted-to-medicare-advantage-plans-in-2021/
3. **CMS National Health Expenditure Data** - Total healthcare spending
   - https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data
4. **OIG (HHS Office of Inspector General)** - MA denial investigations
   - https://oig.hhs.gov/reports/
5. **AHA (American Hospital Association)** - Hospital statistics
   - https://www.aha.org/statistics
6. **CAQH Index** - Claims volume and automation data
   - https://www.caqh.org/explorations/caqh-index

### Market Research Firms

7. **Grand View Research** - RCM market analysis
   - https://www.grandviewresearch.com/industry-analysis/revenue-cycle-management-market
8. **Fortune Business Insights** - RCM market forecast
   - https://www.fortunebusinessinsights.com/revenue-cycle-management-market-103045
9. **Polaris Market Research** - Medical billing outsourcing
   - https://www.polarismarketresearch.com/industry-analysis/medical-billing-outsourcing-market
10. **Allied Market Research** - Denial management market
    - https://www.alliedmarketresearch.com/
11. **Market Research Future** - Healthcare RCM
    - https://www.marketresearchfuture.com/

### Industry Publications and Data

12. **Change Healthcare / Optum Revenue Cycle Index** - Denial rate trends and cost-to-appeal data
    - https://www.changehealthcare.com/insights/revenue-cycle-denials-index
13. **Experian Health** - State of Claims survey (2024)
    - https://www.experian.com/healthcare/
14. **Becker's Hospital Review** - RCM workforce and spending
    - https://www.beckershospitalreview.com/finance/
15. **Fierce Healthcare** - Denial rate trends
    - https://www.fiercehealthcare.com/finance
16. **KLAS Research** - RCM software vendor ratings
    - https://klasresearch.com/
17. **Advisory Board (Optum)** - Denial management analytics
    - https://www.advisory.com/topics/revenue-cycle-management
18. **Premier Inc.** - Denial analytics and benchmarking
    - https://www.premierinc.com/
19. **AAPC** - Coding workforce and salary data
    - https://www.aapc.com/
20. **MGMA** - Practice management benchmarks
    - https://www.mgma.com/

### Deal / Investment Sources

21. **Waystar S-1 / IPO Filing** - SEC Edgar
    - https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=waystar
22. **R1 RCM Take-Private** - Press coverage
    - https://www.beckershospitalreview.com/finance/r1-rcm-acquired-for-8-9b.html
23. **AKASA Funding** - Crunchbase / press releases
    - https://www.akasa.com/

---

## EXECUTIVE SUMMARY

The US insurance claim denial management problem represents one of the largest inefficiencies in healthcare:

- **$150B-$225B** in hospital revenue is initially denied annually
- **$20B-$45B** is permanently written off, with **50-65% of denials never even appealed**
- When hospitals do appeal, they win **50-70% of the time** -- revealing a massive recoverable revenue pool abandoned due to operational constraints
- Hospitals spend **$20B+ annually** on denial management through a combination of in-house staff, outsourced services, and technology
- The RCM market is growing at **10-13% CAGR** with AI-specific sub-segments growing at **20-25%**
- PE/VC conviction is high: **R1 RCM acquired for $8.9B**, **Waystar IPO at ~$3.7B**, and **$200M+ deployed into AI-native denial management startups** in 2023-2024

The problem persists because it is structurally adversarial (payers benefit from denials), operationally complex (72,000 ICD-10 codes, constantly changing payer rules), and plagued by workforce challenges (25-40% coder turnover). Legacy RCM tools are rules-based and retrospective. The market is ripe for AI-native solutions that can predict denials before submission, auto-generate appeals, and adapt in real-time to payer algorithm changes.

**Largest opportunity vector:** Converting the 50-65% of denials that are currently abandoned into appealed and recovered revenue using AI-powered automation. At a 60% appeal success rate, this represents **$6B-$16B in recoverable revenue annually** -- a value proposition that can support premium SaaS pricing.
