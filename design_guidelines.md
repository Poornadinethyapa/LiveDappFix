# Design Guidelines: Catch Items Web3 Game

## Design Approach

**Selected Approach:** Reference-Based with Gaming Focus

**Key References:**
- **Axie Infinity / Web3 Gaming**: Modern crypto gaming aesthetics with clean interfaces
- **Duolingo**: Gamification patterns, progress indicators, and friendly UI
- **Discord**: Dark mode execution, vibrant accents without overwhelming users
- **Coinbase Wallet**: Clean wallet connection patterns and Base Network integration

**Core Design Principles:**
1. Immediate playability - minimize friction to game start
2. Clear visual hierarchy separating game canvas from UI chrome
3. Satisfying micro-interactions without distracting from gameplay
4. Professional Web3 aesthetic that appeals to both crypto natives and casual gamers

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI elements, buttons, scores
- Secondary: JetBrains Mono - Wallet addresses, chain IDs, numerical displays
- Display: Space Grotesk - Game title, headings, leaderboard headers

**Type Scale:**
- Hero/Title: text-5xl md:text-6xl lg:text-7xl (font-bold)
- Section Headers: text-2xl md:text-3xl (font-semibold)
- Score Display: text-4xl md:text-5xl (font-bold, tabular-nums)
- Body Text: text-base md:text-lg (font-normal)
- Small UI Text: text-sm (buttons, labels)
- Micro Text: text-xs (wallet addresses truncated, timestamps)

**Typography Hierarchy:**
- Game score: Largest, center-dominant during gameplay
- Wallet address: Monospace, truncated (0x1234...5678)
- Button labels: Medium weight, clear letterSpacing
- Leaderboard entries: Tabular layout with aligned numbers

---

## Layout & Spacing System

**Tailwind Spacing Primitives:** 2, 4, 6, 8, 12, 16
- Micro spacing (gaps, padding): p-2, gap-2
- Standard component spacing: p-4, m-4, gap-4
- Section padding: py-8, px-6
- Large spacing (page sections): py-12, my-16

**Game Canvas Layout:**
- Full-screen game area: min-h-screen relative container
- Fixed header bar: h-16 sticky top-0 with game controls
- Game canvas: flex-1 relative (contains falling items and basket)
- Overlay UI (score, lives): absolute positioning with consistent spacing from edges

**Viewport Management:**
- Desktop: Game canvas takes remaining height after fixed header (calc-based)
- Mobile: Full viewport height experience, header collapses to minimal controls
- Landscape mobile: Optimize for horizontal play, minimal chrome

**Grid & Alignment:**
- Header: flex justify-between items-center
- Wallet menu: absolute top-16 right-4 (dropdown pattern)
- Leaderboard modal: Centered overlay with max-w-2xl
- Game controls (mobile): Fixed bottom bar with touch targets

---

## Component Library

### A. Navigation & Header

**Top Game Bar (Fixed):**
- Left: Game logo/title + current score display
- Center: Lives/missed items indicator
- Right: Wallet connection button OR connected address with dropdown
- Height: h-16 with backdrop-blur effect
- Spacing: px-6 py-4, gap-8 between elements

**Wallet Connection Dropdown:**
- Trigger: Wallet icon button with truncated address or "Connect Wallet"
- Dropdown: Absolute positioned, w-72, rounded-lg shadow-2xl
- Menu items: py-3 px-4 with icons (MetaMask fox, OKX logo)
- Include: Network indicator, disconnect option, guest mode toggle
- Spacing: gap-2 between menu items

### B. Game Canvas Components

**Main Game Area:**
- Container: relative w-full overflow-hidden
- Background: Subtle gradient or pattern (not solid)
- Falling Items: Absolute positioned, animated transforms
- Item size: w-12 h-12 md:w-16 md:h-16
- Item spacing: Random X-axis, consistent fall speed

**Basket (Player Control):**
- Size: w-20 h-16 md:w-24 md:h-20
- Position: absolute bottom-8 (player controlled X-axis)
- Visual: Rounded basket/container illustration or emoji-based
- Smooth transitions: transition-transform duration-100

**Score Overlay:**
- Position: absolute top-24 left-1/2 -translate-x-1/2
- Display: text-5xl font-bold with score counter
- Include: Combo multiplier indicator (when applicable)
- Spacing: mb-4 between score and secondary stats

**Lives Display:**
- Position: absolute top-24 right-6
- Visual: Heart icons or item icons representing lives
- Layout: flex gap-2, horizontal row
- Size: w-8 h-8 per life indicator

### C. Modal Overlays

**Leaderboard Modal:**
- Overlay: fixed inset-0 backdrop-blur-sm
- Modal: max-w-2xl w-full mx-auto my-16
- Header: py-6 px-8 with title and close button
- Content: Scrollable list, max-h-96 overflow-y-auto
- Entry layout: grid grid-cols-[auto_1fr_auto] gap-6
  - Rank number (w-12 text-center)
  - Address/username (truncate)
  - Score (text-right tabular-nums)
- Spacing: py-4 px-8 per entry, divide-y pattern

**Game Over Screen:**
- Overlay: Similar to leaderboard
- Content: Centered layout with final score
- Elements: 
  - Game over message (text-4xl)
  - Final score display (text-6xl my-8)
  - Stats recap (items caught, accuracy percentage)
  - Action buttons: "Play Again" and "View Leaderboard"
- Button layout: flex gap-4 justify-center mt-8

**Pre-Game / Start Screen:**
- Centered hero layout
- Elements stacked: 
  - Game title (text-7xl font-bold)
  - Subtitle/tagline (text-xl my-4)
  - Controls explanation (grid grid-cols-2 gap-4 max-w-md)
  - Primary CTA: "Start Game" button (large, w-64 h-16)
  - Secondary: "Connect Wallet" or "Play as Guest"
- Spacing: gap-8 between major sections

### D. Form Elements & Controls

**Buttons:**
- Primary: py-3 px-8 rounded-lg (large click targets)
- Secondary: py-2 px-6 rounded-lg
- Icon buttons: w-10 h-10 rounded-lg (equal dimensions)
- Mobile touch targets: Minimum 44x44px (p-3 at minimum)

**Wallet Connection Button:**
- Disconnected state: "Connect Wallet" with wallet icon
- Connected state: Truncated address (0x1234...5678) with dropdown chevron
- Badge: Network indicator (Base chain icon/name)

**Toggle Switches:**
- Dark/Light mode: Icon-only toggle, top-right of header
- Size: w-10 h-10 rounded-full
- Icons: Moon and Sun from Lucide

**Mobile Game Controls:**
- Touch area: Full-width bottom section, h-32
- Visual feedback: Pressed state with opacity change
- Left/Right zones: grid grid-cols-2 gap-0
- Control hints: Arrow indicators or hand gesture icons

### E. Data Display

**Leaderboard Entry Card:**
- Layout: Horizontal flex with space-between
- Left section: Rank badge (w-10 h-10 rounded-full) + address
- Right section: Score (prominent, tabular-nums)
- Highlight: Current user's entry (distinct treatment)
- Spacing: py-4 px-6, gap-4 between elements

**Stats Display (Post-Game):**
- Grid: grid-cols-2 gap-6 for stat pairs
- Each stat: Vertical layout (label above value)
- Value: text-3xl font-bold
- Label: text-sm opacity-70
- Examples: "Items Caught", "Accuracy", "Best Combo"

**Live Game Stats:**
- Compact horizontal display
- Icons + numbers: flex items-center gap-2
- Size: text-lg for active gameplay visibility
- Examples: ❤️ x3 (lives), 🎯 250 (score)

---

## Animation & Interaction Patterns

**Game Animations (Minimal but Essential):**
- Falling items: Smooth transform translateY with constant speed
- Basket movement: transition-transform duration-100 (responsive to input)
- Item catch: Brief scale pulse (scale-110 duration-200) on successful catch
- Miss feedback: Shake animation on basket when item missed

**UI Animations:**
- Modal entry: Fade in with slide up (translateY-4)
- Button hover: Subtle scale-105 (desktop only)
- Score increment: Number count-up animation
- Leaderboard entries: Stagger fade-in (animate-in with delays)

**State Transitions:**
- Game start: 3-2-1 countdown overlay (text-8xl, fade sequence)
- Game over: Slow-motion final item fall, then overlay fade-in
- Wallet connection: Loading spinner during connection

---

## Responsive Breakpoints

**Mobile (default):**
- Single column layout
- Touch controls: Fixed bottom bar for basket movement
- Simplified header: Icon-only buttons
- Leaderboard: Full-screen modal

**Tablet (md: 768px+):**
- Expanded header with text labels
- Larger game canvas elements
- Side-by-side stats in game over screen

**Desktop (lg: 1024px+):**
- Keyboard controls (arrow keys) with on-screen hints
- Maximum game width: max-w-6xl mx-auto
- Leaderboard as overlay (not full screen)
- Richer visual details (particle effects, etc.)

---

## Images

**Hero/Start Screen:**
- Background: Abstract geometric pattern or Web3-themed illustration
- Style: Low-opacity overlay, doesn't compete with text
- Placement: absolute inset-0 -z-10
- Treatment: Subtle blur or grain texture

**Game Canvas Background:**
- Pattern: Subtle grid or gradient
- Could include: Floating blockchain-themed elements (very subtle)
- No hero image - focus on gameplay area

**Wallet Provider Icons:**
- MetaMask fox logo
- OKX Wallet logo  
- Base Network logo
- Size: w-6 h-6 inline with text

**Game Items:**
- Emoji-based or simple SVG illustrations
- Examples: 💎 (gem), ⭐ (star), 🪙 (coin)
- Consistent size and style across all falling items

---

## Special Considerations

**Web3 Elements:**
- Wallet addresses: Always monospace, always truncated
- Network badge: Small pill (px-2 py-1 rounded-full text-xs)
- Transaction states: Loading, success, error indicators
- Base Network branding: Subtle integration, not overwhelming

**Touch Optimization:**
- All interactive elements: Minimum 44x44px
- Game controls: Large zones, visual feedback on touch
- Swipe gestures: Optional basket control (in addition to tap zones)

**Accessibility:**
- Keyboard navigation: Full game playable with arrow keys
- Focus indicators: Visible ring on all interactive elements
- Reduced motion: Respect prefers-reduced-motion for non-essential animations
- Screen reader: Announce score changes, game state changes

**Performance:**
- Game loop: RequestAnimationFrame for smooth 60fps
- Item sprites: Use CSS transforms (not position changes)
- Modal backdrop: backdrop-filter blur (hardware accelerated)