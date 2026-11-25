# Data Descriptor: Apple Store In-Store Pickup Restock & Telemetry Dataset (v1.0.0)

**Snapshot Timestamp:** `2026-11-25T05:54:14Z`  
**License:** Creative Commons Attribution 4.0 International (CC BY 4.0)  
**Primary Telemetry Source:** RestockCheck Public Service Report (`https://restockcheck.com/service-report`) & Live Performance Logs (`https://restockcheck.com/performance`)  
**Repository:** `https://github.com/yangjwlove-dev/apple-store-pickup-restock-dataset`

---

## 1. Abstract & Motivation

High-demand consumer electronics frequently transition between "in stock" and "unavailable" for retail in-store pickup within seconds to minutes. While anecdotal launch-day reports exist on forums, structured, timestamped, cross-regional observations with verifiable measurement latency are rarely published openly.

This dataset provides a reproducible, CC BY 4.0 empirical snapshot of **818 observed Apple Store in-store pickup restock transitions** (`810` closed events with measured in-stock duration) across **31 hub retail stores** in four countries (`US`, `GB`, `CN`, `JP`), paired with **5,259,265 underlying polling checks** and histogram-derived latency quantiles (`P50`, `P90`, `P95`).

---

## 2. Empirical Summary (Snapshot `2026-11-25T05:54:14Z`)

### 2.1 Geographic Coverage & Event Counts
- **United States (`us`)**: 12 monitored hub stores, **356** exported restock events
- **China (`cn`)**: 5 monitored hub stores, **305** exported restock events
- **United Kingdom (`gb`)**: 3 monitored hub stores, **146** exported restock events
- **Japan (`jp`)**: 11 monitored hub stores, **11** exported restock events
- **Total**: **31** hub stores, **818** exported restock transitions (`810` closed, `8` active/open at snapshot time)

### 2.2 In-Stock Window Duration (`n = 810` Closed Events)
- **25th Percentile (P25)**: **20.0 seconds**
- **Median (P50)**: **120.0 seconds** (2.0 minutes)
- **75th Percentile (P75)**: **422.1 seconds** (~7.0 minutes)

These measurements quantify why manual page refreshes or 5–10 minute polling cadences routinely miss over half of pickup restock windows in metropolitan flagship stores.

### 2.3 Polling Cadence & Observation Freshness Quantiles
Measured across four public telemetry tiers beginning `2026-11-15T08:17:11Z`:

- **`evidence` (5s target tier)**: `3,990,466` checks (`n = 3,987,428` interval samples) — Check interval **P50 = 6.0 s**, **P90 = 7.0 s**, **P95 = 8.0 s**; Observation age **P50 = 7.0 s**, **P90 = 10.0 s**, **P95 = 15.0 s**.
- **`watch` (5s target tier)**: `423,414` checks (`n = 423,400` interval samples) — Check interval **P50 = 6.0 s**, **P90 = 7.0 s**, **P95 = 10.0 s**; Observation age **P50 = 7.0 s**, **P90 = 10.0 s**, **P95 = 15.0 s**.
- **`evidence` (60s target tier)**: `845,320` checks (`n = 842,046` interval samples) — Check interval **P50 = 75.0 s**, **P90 = 75.0 s**, **P95 = 300.0 s**.
- **`instant` (on-demand)**: `65` checks (`n = 37` interval samples).
- **Alert dispatch latency (`n = 56` valid alert events)**: **P50 = 3.43 s**, **P90 = 5.69 s**, **P95 = 7.59 s** (measured from stock transition ingestion to first email/Web Push dispatch; excludes device-side notification rendering delay).

---

## 3. File & Schema Dictionary

### 3.1 `data/stores.csv` (31 rows)
- `country`: ISO-style lowercase country code (`us`, `gb`, `cn`, `jp`)
- `store_code`: Apple Store retail identifier (e.g., `R095`, `R032`, `R245`)
- `slug`: URL-safe store slug (e.g., `fifth-avenue-r095`)
- `store_name`, `city`, `timezone`: Store display name, city, and IANA timezone
- `polling_tier`, `check_interval_seconds`, `evidence_interval_seconds`: Active public polling cadence metadata
- `median_in_stock_minutes`, `restocks_24h`, `restocks_7d`, `history_events_exported`, `reliability_rate`, `monitoring_started_utc`

### 3.2 `data/restock_events.csv` (818 rows)
- `country`, `store_code`, `slug`, `store_name`, `city`, `timezone`
- `config_sku`: Apple part number (e.g., `MK1F4LL/A`, `MK2V4CH/A`)
- `config_name`: Human-readable model/storage/finish descriptor
- `started_at_utc`, `ended_at_utc`: ISO-8601 UTC timestamps of observed in-stock transition start and close (`ended_at_utc` empty if still in stock at snapshot time)
- `duration_seconds`, `duration_minutes`: Observed window duration (`ended_at - started_at`)
- `is_closed`: Boolean (`true` / `false`)

### 3.3 `data/hourly_distribution.csv` (336 rows)
- `country`, `store_code`, `slug`, `store_name`, `city`, `timezone`
- `local_hour`: Integer `0`–`23` in store local timezone
- `restock_count`: Count of config restock transitions observed during that local hour
- `store_sample_size`: Total transitions counted for that store

### 3.4 `data/polling_tier_telemetry.csv` (4 rows)
- `source`, `target_interval_seconds`, `first_measured_utc`, `total_checks`
- `check_interval_sample_size`, `check_interval_p50_ms`, `check_interval_p90_ms`, `check_interval_p95_ms`
- `observation_age_sample_size`, `observation_age_p50_ms`, `observation_age_p90_ms`, `observation_age_p95_ms`

---

## 4. Methodology, Integrity & Known Limitations

1. **Public Read-Only Ingestion**: All records are exported exclusively from public, anonymous JSON telemetry routes (`/api/stock/public/stores`, `/api/stock/public/summary`, `/api/stock/public/service-report`, `/api/stock/public/store/<country>/<slug>`). Anyone can regenerate a fresh snapshot using `scripts/fetch_snapshot.mjs`.
2. **Discrete Sampling Quantization**: Because availability is observed via periodic polling (5s or 60s tiers), true continuous stock durations are bounded by ±1 polling interval around observed `started_at_utc` and `ended_at_utc`. Histogram quantiles represent bucket upper bounds as documented in the public service report.
3. **Hub Store Selection Scope**: This snapshot covers 31 continuously monitored metropolitan hub stores rather than all 531 global Apple Stores. Regional totals reflect monitored hubs only (`nationwide: false`).
4. **Simultaneous SKU Counting**: Hourly counts treat simultaneous configuration restocks (e.g., two storage capacities restocking at the same store at 08:00 local time) as separate SKU transitions.
5. **Privacy & Independence**: The dataset contains zero personal data, zero buyer identities, and zero non-public retail interfaces. Independent research dataset, not affiliated with Apple Inc.
