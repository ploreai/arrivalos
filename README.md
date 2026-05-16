# Sense of Arrival — Rosewood Hong Kong

A hackathon MVP demonstrating **autonomous arrival orchestration** for Rosewood
Hotels. Not a staff copilot — an automated system. The front desk sees what
the system is doing and can intervene; the default mode is automation.

> "The guest has not arrived yet, but the hotel has already changed."

## Run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`). Strict
TypeScript check: `npm run typecheck`. Production build: `npm run build`.

## The four panes

1. **Next Four Arrivals** — Four upcoming guest cards. Each shows ETA, need
   state, the key trigger driving the choreography, the headline automated
   action, and the forecast NPS the hotel is shooting for. The "Override"
   button lets the front desk intervene.

2. **Arrival Intelligence** — When you click a card, this pane shows the full
   reasoning: flight status, meal gap, circadian state, body-clock
   equivalent, local context, prior preference, the full list of automated
   actions, and the in-room display copy the guest will see.

3. **Owner Metrics** — Forecast NPS, Actual NPS, ADR, RevPAR, ancillary per
   stay, upgrade cost today vs the 7-day average, and upgrade cost avoided.
   Today vs trailing 7-day deltas in green/red. Upgrades are not eliminated;
   they are allocated where they protect relationship value.

4. **Context + Learning** — Three columns: a local context radar (Art Week,
   weather, flight disruption clusters, occupancy, nearby conferences); a
   contextual-bandit view of which arrival package is currently winning
   reward; and the intervention log that records every front-desk override.

## Simulation

Everything runs locally with synthetic data. No backend, no auth, no real
APIs. Press **Advance 15 min** (or the spacebar) to step time forward:

- ETAs decrement.
- Guests whose ETA passes zero arrive — their card flips to show Actual NPS,
  and the next guest in the queue slides into the pane.
- Owner metrics shift slightly (actual NPS converges, upgrade costs drift).
- Bandit weights re-balance toward state-aware choreography (Quiet Recovery,
  Local Cultural Access) and away from Generic Premium Welcome.

Deltas are deterministic — seeded from the offset and guest id — so each
demo plays back identically. Use **Reset** to return to the opening state.

### Keyboard

- `↑` / `↓` cycle the selected guest card
- `Space` advances time by 15 minutes

## What is mocked

Everything. None of these are real:

- Flight status, meal timing, circadian state
- PMS room state, occupancy, displacement cost
- CRM guest preferences, anniversary history
- Local context signals (Art Week, weather, conferences)
- The contextual bandit, the NPS forecaster, the upgrade ROI model

The guest cards, the bandit weights, and the metrics are all seed data living
in `src/data/`. The rule-based helpers in `src/lib/` (`meal`, `circadian`,
`nps`, `bandit`, `simulation`) stand in for what would be real services.

## What becomes real later

| Mock | Real integration |
| --- | --- |
| Flight status | Amadeus / FlightAware / Cirium |
| Room state, occupancy | Opera Cloud PMS |
| Guest history, preferences | Salesforce / native Rosewood CRM |
| Weather | OpenWeather or in-house feed |
| Local events | Curated events feed (PredictHQ + editorial) |
| NPS forecaster | Internal model trained on stay-level NPS + arrival signals |
| Contextual bandit | Vowpal Wabbit / Sagemaker / in-house service |
| Room controls | Honeywell INNcontrol or equivalent IoT control plane |

## Brand language

Sense of Place · arrival choreography · PMS · CRM · RevPAR · ADR · ancillary
revenue · NPS · Affluential Explorers · local context · autonomous
orchestration.

Personalization as choreography, not memory.
