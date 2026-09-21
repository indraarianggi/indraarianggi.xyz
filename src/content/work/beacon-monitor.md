---
title: Beacon monitor
summary: A small uptime and drift monitor for services that do not justify a full observability stack.
role: Backend and data
status: shipped
date: 2026-03-02
endDate: 2026-06-30
stack: [Go, Postgres, Grafana]
website: https://example.com/beacon
featured: true
draft: false
image: ./beacon-monitor-cover.png
imageAlt: Poster-style cover with stacked rules in black and one thick red rule
---

*Placeholder project. Replace this entry with real material before publishing.*

Most of my services are small enough that a full observability stack costs more attention than the services themselves. **Beacon monitor** checks a list of endpoints on a schedule, stores the results, and shouts when something changes state. That is the entire product.

The constraint that shaped it: a monitor that needs maintenance is worse than no monitor, because it produces silence and you mistake silence for health.

## Requirements

Written down before any code, in the order they mattered:

1. Tell me within two minutes when a service stops answering.
2. Distinguish **down** from **slow**, because the response is different.
3. Keep a year of history on a small disk.
4. Survive a restart without losing an in-flight check.
5. Never page twice for the same incident.

Requirement five is the one that decides the design. Deduplication is not a feature you add to a monitor; it is the shape of the alerting loop.

## Architecture

Three processes, one database, and no message bus.

### Checker

One goroutine per endpoint with a bounded worker pool. Each check writes a single row and returns.

```go
type Result struct {
	Endpoint  string
	Started   time.Time
	LatencyMS int
	Status    int
	Err       error
}

func (c *Checker) Run(ctx context.Context, endpoint string) Result {
	started := time.Now()
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)

	resp, err := c.client.Do(req)
	defer func() {
		if resp != nil {
			resp.Body.Close()
		}
	}()

	result := Result{Endpoint: endpoint, Started: started}
	if err != nil {
		result.Err = err
		return result
	}

	result.Status = resp.StatusCode
	result.LatencyMS = int(time.Since(started).Milliseconds())
	return result
}
```

### Evaluator

Runs every thirty seconds and converts raw results into state transitions. A service is **down** after two consecutive failures and **slow** when the rolling median crosses its budget.

```bash
beacon list                     # configured endpoints
beacon state                    # current state per endpoint
beacon history api.example.com  # last 24 hours, one line per transition
```

### Reporter

Writes a digest to a webhook when a transition happens, and nothing otherwise. Silence is the default state, which is why the monitor stays trusted.

![Five horizontal rules of decreasing weight, standing for check history](./beacon-monitor-architecture.png)

## Measurements

| Signal | Window | Used for |
|---|---|---|
| Availability | 30 days | Monthly summary |
| Latency median | 5 minutes | Slow alerts |
| Latency p95 | 24 hours | Capacity notes |
| Error count | 1 hour | Incident context |
| Transition count | All time | Alert fatigue check |

If the transition count climbs while availability holds steady, the thresholds are wrong and the monitor is the thing that needs fixing.

## Failure handling

- A check that times out is retried once after two seconds.
- A run that crashes mid-check leaves its work uncommitted, so the next run repeats it.
- The webhook is fire and forget, because a monitor that blocks on its notifier stops monitoring.
- The database is written with `synchronous=NORMAL`, so an unclean shutdown may lose the last second of results. That is an acceptable trade for a personal dashboard.

> Alerting is a budget. Every page spends attention you will want later, so spend it on state changes and nothing else.

## Notes on the build

~~The first version polled from a cron job~~ The scheduler moved into the process, because cron silently dropped runs under load and the gaps were invisible.

The parts worth reusing in other tools:

```json
{
  "interval_seconds": 30,
  "down_after_failures": 2,
  "slow_budget_ms": 800,
  "retention_days": 400,
  "webhook": "https://example.com/hooks/beacon"
}
```

*Placeholder project. Replace this entry with real material before publishing.*
