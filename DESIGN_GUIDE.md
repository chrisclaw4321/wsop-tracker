# WSOP Tracker - Visual Design Guide

## Color Palette

### Primary Colors
```
White:        #ffffff
Blue:         #3b82f6 (primary)
Green:        #10b981 (secondary)
Yellow:       #fbbf24 (accent)
```

### Information-Specific Colors
```
Start Time:   Yellow-100 (#fef3c7) background, Yellow-400 (#60a5fa) border
Buy-in:       Green-100 (#dcfce7) background, Green-400 (#4ade80) border
Rake:         Cyan-100 (#cffafe) background, Cyan-400 (#22d3ee) border
Total:        Red-100 (#fee2e2) background, Red-400 (#f87171) border
Stack:        Green-100 (#dcfce7) background, Green-400 (#4ade80) border
Blinds:       Orange-100 (#ffedd5) background, Orange-400 (#fb923c) border
Guarantee:    Purple-100 (#f3e8ff) background, Purple-400 (#d946ef) border
```

## Typography

### Font Family
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
Fallback: 'Helvetica Neue', sans-serif
```

### Font Sizes & Weights
```
h1:  48px  font-bold
h2:  36px  font-bold
h3:  28px  font-bold
H4/Labels: 20-24px font-bold or font-black
Body:      18px  font-normal (with bold for labels)
Small:     16px  font-normal
```

### Font Weights Used
- `font-normal` - 400: Base body text
- `font-semibold` - 600: Label text
- `font-bold` - 700: Important labels, headers
- `font-black` - 900: Totals, most critical info (red total)

## Layout Components

### Tournament Card Structure
```
┌────────────────────────────────────────────────────────────┐
│ Event #  Tournament Name         [Format Badge]  [Chevron] │
├────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────┐ │
│ │📅 Start  │ │💰 Buy-in │ │+ Rake    │ │= Total   │ │GTD │ │
│ │Mar 31    │ │€1,100    │ │€100      │ │€1,200    │ │ € │ │
│ │12:00 PM  │ │          │ │          │ │(bold)    │ │10M │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────┘ │
└────────────────────────────────────────────────────────────┘
    ↓ (Click to expand)
┌────────────────────────────────────────────────────────────┐
│ ┌──────────────────┐ ┌──────────────────┐                   │
│ │💎 Starting Stack │ │⏱️ Blind Levels  │                   │
│ │50,000 chips      │ │40-minute         │                   │
│ └──────────────────┘ └──────────────────┘                   │
│ [🎯 Bounty] [⚡ Turbo] [📅 Multi-Day]                       │
│ Description text...                                         │
└────────────────────────────────────────────────────────────┘
```

### Information Boxes

Each key piece of information is in its own colored box:

1. **Start Time** (Yellow)
   - Always visible
   - Format: Date HH:MM AM/PM
   - Icon: 📅
   - Used in main tournament row

2. **Buy-in** (Green)
   - Always visible
   - Format: €X,XXX
   - Icon: 💰
   - Used in main tournament row

3. **Rake** (Cyan)
   - Always visible
   - Format: €XX
   - Icon: +
   - Used in main tournament row

4. **Total** (Red - BOLD)
   - Always visible
   - Format: €X,XXX
   - Font: text-2xl font-black
   - Calculated: Buy-in + Rake
   - Most prominent cost indicator

5. **Starting Stack** (Green)
   - Expanded view only
   - Format: XX,XXX chips
   - Icon: 💎

6. **Blind Levels** (Orange)
   - Expanded view only
   - Format: XX-minute
   - Icon: ⏱️

7. **Guarantee** (Purple)
   - Always visible (if available)
   - Format: €X,XXX,XXX
   - Icon: 🏆

## Spacing & Padding

```
Card padding:      px-6 py-5 (main), px-4 py-3 (info boxes)
Border radius:     rounded-lg (cards), rounded-xl (large sections)
Border thickness:  2-4px on all colored elements
Gap between items: gap-3 to gap-6
Line height:       1.6
```

## Borders & Shadows

```
Card borders:      border-4 border-blue-300
Info boxes:        border-2 border-[color]-400
Shadows:           shadow-md (standard), shadow-lg (hover)
Focus states:      border-green-500 + ring-2 ring-green-300
```

## Responsive Design

```
Mobile: Single column, larger touch targets
Tablet: 2-3 columns for info boxes
Desktop: Full grid layout with all info side-by-side
```

## Accessibility

- **Color Contrast**: All text meets WCAG AA standard (4.5:1 minimum)
- **Focus States**: Visible focus outlines on all interactive elements
- **Text Sizes**: Base 18px ensures readability for all users
- **Touch Targets**: All buttons/selects minimum 44x44px
- **Semantic HTML**: Proper heading hierarchy (h1 > h3)

## State Changes

### Hover Effects
- Cards: Border changes to green-400, shadow increases
- Buttons: Background becomes slightly darker
- Links: Underline appears, color slightly lighter

### Focus Effects
- Dropdowns: Border becomes green-500, ring added
- Inputs: Border becomes green-500, ring added
- Links: Outline visible

### Expanded State
- Chevron rotates 180°
- Background changes to blue-50
- Border becomes green-400
- Additional info animates in

## Special Features

### Event Type Badges
- **Bounty**: Red background, red text (🎯)
- **Turbo**: Orange background, orange text (⚡)
- **Multi-Day**: Blue background, blue text (📅)
- **Main Event**: Yellow background, yellow text (👑)

### Format Color Coding
- **NLHE**: Blue (#3b82f6)
- **PLO**: Purple (#a855f7)
- **Mixed**: Green (#10b981)
- **Bounty**: Red (#ef4444)
- **Other**: Yellow (#fbbf24)

## Font Rendering

```
-webkit-font-smoothing: antialiased
-moz-osx-font-smoothing: grayscale
```

This ensures crisp, clear text rendering across all browsers.

## Print Styles

The site is not optimized for printing, but if needed:
- Remove gradients (replace with solid colors)
- Remove shadows
- Reduce opacity effects
- Use print-friendly font sizes (12-14px)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dark Mode

Currently not supported. The bright theme is intentional for readability and WSOP tournament information visibility.
