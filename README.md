# 313Space

**A MySpace revival for Detroit's independent businesses.** Every business gets a MySpace-style profile with a **Top 8**: other local businesses it vouches for. Residents take a quick quiz, land on a business that fits them, and browse friend to friend, the way people clicked through Top 8s on MySpace in 2006.

## How to run

No build step, no backend, no API keys.

- **Double-click `index.html`** (works from `file://`), or
- `python3 -m http.server 8000` in this folder, then open <http://localhost:8000/>

Routes (hash-based): `#/` home · `#/browse` · `#/search?q=cozy` · `#/quiz` · `#/b/<id>` profile · `#/edit/<id>` owner mode · `#/impact` KPI dashboard.

## Data

All business content comes from `data/businesses.js` (`window.BUSINESSES` + `window.DIRECTORY_META`). It has 21 verified, currently open Detroit businesses across 11 neighborhoods, each with a `source` link showing where it was verified. The app never invents businesses, facts or links. Top 8 size is `min(8, number of businesses - 1)`, so a smaller or larger file drops in without code changes.

After editing the data, run `node scripts/validate-data.js`. It checks for unique ids, required fields, exactly 8 valid Top 8 friends per business, http(s) sources, and the minimum appearances per business in other Top 8s.

## How AI was used

- **Ahead of time, not at runtime.** Claude (Anthropic) wrote each business's headline, mood, "About me" and "Who I'd like to meet" from the verified facts in the data file. Claude also generated an AI-suggested Top 8 for every business, balanced so each business appears in at least 5 other Top 8s (`DIRECTORY_META.minAppearances`).
- **Owners stay in control.** In owner mode (`#/edit/<id>`) an owner can review the AI picks or pick from scratch. Their picks replace the AI's, and profiles show a "Top 8 picked by the owner" or "Top 8 suggested by AI" badge.
- **The app makes no live AI calls.** The quiz is a transparent scoring function: +3 category, +2 per tag, +1 neighborhood, −2 over budget.
- Claude Code also helped build the app itself, using parallel agents.

## KPIs (Impact page, `#/impact`)

Every number on the page is labeled **MEASURED** (computed live from this device's localStorage + the data) or **PROJECTED**.

- **Time per task:** seconds to choose a Top 8 from scratch vs. reviewing AI picks (n per mode, % time saved)
- **Task success:** % of AI-suggested Top 8 picks rated "Good match? Yes" on profiles
- **Community value:** businesses, cross-promotion links, min/avg appearances in other Top 8s, neighborhoods covered
- **Quiz:** average seconds to a match, quizzes taken
- "Copy results" copies a plain-text summary. "Reset test data" clears ratings, timings, quiz results and owner picks.

## Decisions & assumptions

- Plain `<script>` tags (no ES modules) so it runs from `file://`. All state lives in localStorage, every access is wrapped in try/catch, and it falls back to memory if storage is blocked.
- Profile pics are original illustrations: each business gets a colored square with category line-art (coffee cup, vinyl record, book stack and so on), its initials and its category. Where a freely licensed photo verified to show that specific business exists on Wikimedia Commons, `data/images.js` adds it, credited on the profile. If a photo fails to load (e.g. offline), the illustration shows instead. "313Space" is an original wordmark. No MySpace logos or assets are used.
- No profile song, music player or audio anywhere.
- Contacting-box buttons (Add to Friends, etc.) only show playful toasts.
- When an owner picks a business the AI didn't suggest, its Friends Comment reads "Hand-picked by the owner of …" instead of inventing a reason.
- "Reset test data" also clears owner Top 8 overrides, so each KPI session starts clean.
- Quiz timer starts when the quiz page renders and stops when results show.
- "Good match?" ratings are stored per page load. Several testers sharing one device don't overwrite each other, and changing your vote within a visit replaces it. The Impact page ignores stored data for businesses that aren't in the current data file.
- Quiz free text matches whole tag words only (e.g. "vegan" or "cozy"), and filler words like "and" or "for" are ignored.

## Photo credits

Profile photos are hotlinked from Wikimedia Commons under their free licenses:

- Source Booksellers: "What an amazing selection at Source Booksellers in Detroit!" by Senator Stabenow, CC BY 2.0
- John K. King Used & Rare Books: "John K. King Books (exterior)" by Mx. Granger, CC0
- Cliff Bell's: "Cliff Bell's" by Mx. Granger, CC0
- Garden Bowl: "Detroit December 2018 16 (Garden Bowl)" by Michael Barera, CC BY-SA 4.0
- Redford Theatre: "RedfordTheatreMarquee" by Dave Parker, CC BY 3.0

All other profile pics are original illustrations.
