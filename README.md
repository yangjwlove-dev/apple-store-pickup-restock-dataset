---
license: cc-by-4.0
task_categories:
  - tabular-classification
  - time-series-forecasting
tags:
  - retail-telemetry
  - apple-store
  - inventory
  - restock
  - time-series
  - open-data
size_categories:
  - n<1K
pretty_name: Apple Store In-Store Pickup Restock & Telemetry Dataset
---

# Apple Store In-Store Pickup Restock & Telemetry Dataset (v1.0.0)

An open, CC BY 4.0 empirical dataset of Apple Store in-store pickup restock transitions, sellout window durations, local-hour restock histograms, and polling latency quantiles across **31 hub Apple Stores** in four countries (`US`, `GB`, `CN`, `JP`), exported from public telemetry endpoints published by [RestockCheck](https://restockcheck.com/service-report).

- **Snapshot timestamp**: `2026-11-25T05:54:14Z`
- **Monitored hub stores**: 31 stores (`12 US`, `11 JP`, `5 CN`, `3 GB`)
- **Exported restock transitions**: **818 timestamped events** (`810` closed events with observed duration)
- **Empirical sellout duration (`n = 810` closed events)**: **P25 = 20.0 s**, **Median = 120.0 s**, **P75 = 422.1 s**
- **Polling telemetry scale**: **5,259,265 total checks** across 4 public tiers (`evidence 5s` tier: `3,990,466` checks, check interval P50 = `6.0 s`, P95 = `8.0 s`; observation age P50 = `7.0 s`, P95 = `15.0 s`)
- **Alert dispatch latency (`n = 56`)**: P50 = `3.43 s`, P90 = `5.69 s`, P95 = `7.59 s`
- **License**: [CC BY 4.0](./LICENSE)

## Files

- `data/stores.csv` — 31 monitored hub stores with store code, city, timezone, polling tier, check cadence, and 24h/7d restock counts.
- `data/restock_events.csv` — 818 observed SKU-store restock transitions (`started_at_utc`, `ended_at_utc`, `duration_seconds`, `duration_minutes`, `is_closed`).
- `data/hourly_distribution.csv` — 336 store-hour rows capturing local-timezone restock frequency histograms (00:00–23:00).
- `data/polling_tier_telemetry.csv` — Aggregated check interval and observation age quantiles (`P50`/`P90`/`P95`) and sample sizes across all public tiers.
- `data/snapshot_metadata.json` — Machine-readable snapshot timestamp, summary statistics, and SHA-256 checksums for all CSV files.
- `DATA_DESCRIPTOR.md` / `DATA_DESCRIPTOR.pdf` — Technical data descriptor documenting collection methodology, measurement bounds, and known limitations.
- `scripts/fetch_snapshot.mjs` — Standalone Node.js script to reproduce or refresh a snapshot directly from public anonymous JSON endpoints.

## Quick Start (Python / pandas)

```python
import pandas as pd

events = pd.read_csv("data/restock_events.csv")
closed = events[events["is_closed"] == True]

print("Closed restock events:", len(closed))
print("Duration quantiles (seconds):")
print(closed["duration_seconds"].quantile([0.25, 0.5, 0.75]))
print("\nEvents by country:")
print(events["country"].value_counts())
```

## Reproduce or Refresh Snapshot

No API key or account is required. All source routes are public, read-only JSON endpoints documented on the [RestockCheck Performance & Telemetry](https://restockcheck.com/performance) and service report pages:

```bash
node scripts/fetch_snapshot.mjs ./fresh-snapshot
```

## Citation

If you use this dataset in research, data journalism, or benchmark analysis, please cite using [`CITATION.cff`](./CITATION.cff):

```bibtex
@dataset{restockcheck_apple_pickup_2026,
  author       = {{RestockCheck Open Telemetry Project}},
  title        = {{Apple Store In-Store Pickup Restock \& Telemetry Dataset (v1.0.0)}},
  year         = {2026},
  month        = nov,
  version      = {1.0.0},
  license      = {CC-BY-4.0},
  url          = {https://github.com/yangjwlove-dev/apple-store-pickup-restock-dataset}
}
```

## Disclaimer & Scope

Independent open retail availability dataset. Not affiliated with or endorsed by Apple Inc. Contains zero personal data, zero user credentials, and zero proprietary retail internals.
