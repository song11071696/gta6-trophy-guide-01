# Leonida Trophy Guide — GTA VI, all 55 PS5 trophies

[![make.fun competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/song11071696/gta6-trophy-guide-01/rank.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/song11071696/gta6-trophy-guide-01/reward.svg)](https://make.fun/competitions/gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of **Grand Theft Auto VI** (launched 19 November 2026). Every trophy is shown with its **official name, description and grade exactly as PlayStation publishes them**, plus a guide written in our own words that names its sources, a roadmap to the platinum, and a checklist tracker that saves in your browser.

## What it does

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation. Each card shows the official name, official description, grade badge, kind tag, count where PlayStation tracks one (e.g. 42 Shooting Range challenges), and a **MISSABLE** badge where it applies.
- **Guides with sources** — every trophy has a 2–5 sentence guide in our own words, with two cited sources per trophy (linked by name). Where a method was still unconfirmed at launch, the card says so honestly instead of inventing one.
- **Tracker** — tick trophies off; progress is saved in `localStorage` and survives reloads. Export progress to a JSON file and import it back; reset with one click.
- **Filters** — search by name, filter by kind (Story / Missable / Collectibles / Activities / Online), by grade, or earned-only. There are no online trophies in GTA VI — the Online filter says so.
- **Spoiler setting** — “Hide story spoilers” hides the names and descriptions of hidden story trophies until you earn them.
- **Roadmap to the platinum** — four phases in order (story Chapters 1–5 → the 100% checklist → collectibles & counts → cleanup/activities), built from the official descriptions, with the one missable trophy called out: **Positive Mental Attitude** (do Lucia's balcony meditation in Chapter 1 or it is gone).
- **Original look, fully offline** — a dark “Vice City neon sunset” theme in pure CSS. No Rockstar logo, artwork or game screenshots; no external fonts or images; the app fetches nothing at runtime except its own `data/trophies.json`.

## How to use it offline

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Or serve `app/` with any static file server (e.g. `python3 -m http.server` from `app/`). Open `index.html` in desktop Chrome, then turn the network off — everything still works. Tick trophies as you earn them; use **Export progress** to back up your checklist as a file and **Import progress** to restore it on another machine.

Handy links (the app reads these itself):

- `?demo=1` — preview the tracker with 12 trophies ticked
- `?view=roadmap` — show just the roadmap; `?view=guide` — show just the checklist
- `?trophy=<id>` — open one trophy's guide (e.g. `?trophy=28`)
- `?q=<text>` — pre-fill the search (e.g. `?q=Positive`)
- `?spoilers=1` — turn spoiler-hiding on

## Sources used for verification

The 55 names, descriptions and grades were verified on 19 November 2026 against:

- **Push Square, via Exophase** — [GTA 6 Trophy Guide & Roadmap](https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap) (55 trophies incl. the Platinum; gold “A Long Road” needs 100% completion)
- **PlanetGTA6** — [GTA 6 Trophies](https://www.planetgta6.com/en/gta-6-trophies/) (names/descriptions taken 18 November from Exophase, cross-checked with PSNProfiles and TrueAchievements)
- **GTABase** — [GTA 6 Trophy Guide](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series) (full 55-trophy list with grades, hidden flags and unlock tips — read in full)

All three agree on all 55 names, descriptions and grades; **no discrepancy was found** against the list the kit's starter carried. Guide details (locations, steps, counts) come from GTABase, Push Square, KeenGamer, OutputLag and Radio Times, cited per trophy:

- [KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [Output Lag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/)
- [Radio Times — GTA 6 trophy guide](https://www.radiotimes.com/technology/gaming/gta-6-trophies-achievements-list/)

Unofficial fan guide. Not affiliated with Rockstar Games, Take-Two Interactive or Sony Interactive Entertainment.

## Building / handing in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts` (unchanged). Run it twice into two different directories and `diff -r` them — both runs must write identical bytes.

## Screenshots

In `screenshots/`, taken as real renders of this app in headless Chromium at 1280×800 (see `shots.json` for the view each one shows):

1. `1-cover.jpg` — checklist top: progress, filters and the platinum guide open
2. `2-guide.jpg` — Positive Mental Attitude, the missable trophy, guide + sources open (focused checklist view)
3. `3-roadmap.jpg` — the roadmap and missable callout
4. `4-spoilers.jpg` — spoiler mode on, story trophies hidden
