# WSOP Europe Prague 2026 - Complete Tournament List

## All 15 Bracelet Events (Deployed Live)

Website: **https://wsop-tracker.pages.dev**

### Updated Features (March 24, 2026)

✅ **All 15 WSOP bracelet events** (expanded from 10)
✅ **Detailed tournament information:**
- Buy-in + Rake (separate display)
- Total cost calculation
- Multiple start dates & times per tournament
- Flight counts
- Starting stack sizes (where applicable)
- Blind level durations (10-min, 30-min, 40-min, 60-min variants)
- Guaranteed prize pools (€10M Main, €1.5M Circuit Championship)
- Special event markers (Bounty, Turbo, Multi-day, Main Event)

✅ **Interactive UI:**
- Search by tournament name, number, or format
- Filter by: NLHE, PLO, Mixed, Bounty, Turbo, High Rollers
- Sort by: Event #, Buy-in, Start Date, Guarantee
- Expandable cards showing detailed information
- Compact list view (2-3 lines per entry)
- Format badges with color coding

✅ **Google OAuth Security:**
- Only sazan4321@gmail.com can access
- Access denied alert for other emails
- Client-side email verification

---

## The 15 Bracelet Events

| # | Event Name | Format | Buy-in | Total Cost | Start Date | Flights |
|---|-----------|--------|--------|-----------|-----------|---------|
| 1 | The Opener Mystery Bounty | NLH + Bounty | €1,100 | €1,200 | Mar 31 - Apr 1 | 4 |
| 2 | Mixed PLO / PLO8 / Big O | Mixed PLO | €3,300 | €3,600 | Mar 31 | 1 |
| 3 | COLOSSUS NLH | NLH | €565 | €615 | Apr 2 | 2 |
| 4 | PLOSSUS Bounty | PLO + Bounty | €565 | €615 | Apr 3 | 2 |
| 5 | Europe Main Event | NLH | €5,300 | €5,600 | Apr 3-5 | 3 |
| 6 | Ladies Championship | NLH | €1,000 | €1,090 | Apr 4 | 1 |
| 7 | Turbo Bounty NLH | NLH Turbo + Bounty | €2,200 | €2,450 | Apr 5 | 1 |
| 8 | MONSTER STACK NLH | NLH | €1,650 | €1,800 | Apr 6 | 1 |
| 9 | PLO European Championship | PLO | €5,300 | €5,600 | Apr 6 | 1 |
| 10 | Rounder Cup (EU vs. World) | NLH | €2,750 | €3,000 | Apr 7 | 2 |
| 11 | Super High Roller NLH | NLH | €20,800 | €22,000 | Apr 8 | 1 |
| 12 | European Circuit Championship | NLH | €1,500 | €1,635 | Apr 8-9 | 4 |
| 13 | GGMillion$ High Roller NLH | NLH | €8,400 | €9,000 | Apr 9 | 1 |
| 14 | PLO Double Board Bomb Pot | PLO | €1,100 | €1,200 | Apr 10 | 1 |
| 15 | The Closer Turbo Bounty | NLH Turbo + Bounty | €2,750 | €3,000 | Apr 10 | 1 |

---

## Key Tournament Details

### €10,000,000 GUARANTEED MAIN EVENT (Event #5)
- **Buy-in:** €5,300 (+ €300 rake) = €5,600 total
- **Flights:** 3 (Apr 3, 4, 5 @ 12:00 PM each)
- **Starting Stack:** 5,000 chips
- **Blind Levels:** 10-minute
- **Late Registration:** 130 minutes
- **Re-entries:** Unlimited
- **Largest prize pool guarantee in European poker history**

### €1,500,000 GUARANTEED CIRCUIT CHAMPIONSHIP (Event #12)
- **Buy-in:** €1,500 (+ €135 rake) = €1,635 total
- **Flights:** 4 (Apr 8-9, multiple times)
- **Nickname:** "Mini Main Event"
- **Significance:** NEW EVENT for Prague

### OTHER HIGHLIGHTS

**Lowest Buy-in:** Event #3 & #4 (COLOSSUS/PLOSSUS) @ €565
**Highest Buy-in:** Event #11 (Super High Roller) @ €20,800
**Most Flights:** Events #1, #5, #12 (3-4 flights for casual entry)
**First-Ever:** Ladies Championship (Event #6) with custom gemstone bracelet
**New Format:** PLO Double Board Bomb Pot (Event #14) - from high-stakes streams
**Turbo + Bounty Events:** Events #1, #7, #15 (fast action, hunter rewards)

---

## Technical Implementation

### Component Architecture
- **App.tsx** - Main container, Google OAuth integration, data loading
- **TournamentList.tsx** - Searchable, filterable list with expandable details
- **types/index.ts** - Complete Tournament interface with all fields
- **TournamentCard.tsx** - (Unused in new design, replaced by compact list)

### Data Fields Per Tournament
```typescript
{
  id: number;
  eventNum: string;
  name: string;
  format: string; // NLH, PLO, Mixed, Bounty, Turbo, etc.
  buyIn: number; // in euros
  rakeFee: number; // in euros
  currency: string;
  startDates: string[]; // multiple dates
  startTimes: string[]; // multiple times
  flights: number;
  gtd?: number; // guaranteed prize pool
  startingStack?: number;
  blindLevels?: string;
  isMultiday?: boolean;
  isBounty?: boolean;
  isTurbo?: boolean;
  description: string;
  location: string;
}
```

### UI/UX Features
1. **Compact List View:** 2-3 lines per tournament with max visibility
2. **Format Badges:** Color-coded (Blue=NLHE, Purple=PLO, Green=Mixed, Red=Bounty)
3. **Expandable Cards:** Click to reveal full tournament details
4. **Search Bar:** Find by event #, name, or format
5. **Multi-filter Dropdown:** Filter by tournament type
6. **Sort Dropdown:** 4 sort options (Event #, Buy-in, Date, Guarantee)
7. **Total Cost Highlight:** Buy-in + Rake prominently displayed
8. **Special Badges:** Bounty 🎯, Turbo ⚡, Multi-day 📅, Main Event 👑
9. **Responsive Grid:** Details in 2-column layout for compact display

---

## Data Sources

- **WSOP Official Schedule:** https://www.wsop.com/tournaments/2026-wsop-europe/
- **PokerNews Coverage:** https://www.pokernews.com/tours/wsope/2026-wsop-europe/
- **VIP Grinders Complete Guide:** Detailed structure, starting stacks, blind levels
- **Hendon Mob Database:** Comprehensive 86-event schedule including side events

---

## Deployment Status

**Site:** https://wsop-tracker.pages.dev
**Repository:** https://github.com/chrisclaw4321/wsop-tracker
**Last Commit:** Complete redesign with all 15 bracelet events
**Build Status:** ✅ Successful
**Google OAuth:** ✅ Configured & Restricted to sazan4321@gmail.com

### What You Can Do Now
1. **Visit the site** and sign in with your Google account
2. **Search** for tournaments by name or event #
3. **Filter** by format (NLHE, PLO, Bounty, etc.)
4. **Sort** by buy-in, date, or guarantee
5. **Expand** any tournament to see complete details
6. **View costs:** Both breakdown (buy-in + rake) and total
7. **See structure info:** Starting stacks, blind levels, flight counts
8. **Identify specials:** Bounty events, turbo formats, multi-day tournaments

---

## Next Enhancements (Optional)

- Add satellite tournament information (€350-€500 buy-ins)
- Link to GGPoker satellite system details
- Player of the Year scoring/points calculator
- Calendar view of tournament schedule
- "My Tournaments" bookmarking
- Prize pool breakdown (based on field size projections)
- Chipstack-to-blind-level calculator

