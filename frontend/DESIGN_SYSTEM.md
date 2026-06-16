# Premium UI/UX Design System — WorkPodd AI Refund Agent

## Overview
This document outlines the premium design system and component library for the WorkPodd AI Refund Agent frontend application. The design transforms the platform into a polished AI SaaS dashboard comparable to OpenAI Platform, Vercel Dashboard, Linear, and Stripe.

## Design Philosophy
- **Dark Theme**: Premium dark mode with sophisticated gradients
- **Glassmorphism**: Frosted glass effect cards with backdrop blur
- **Modern Typography**: Clear hierarchy with Inter font family
- **Smooth Animations**: Framer Motion micro-interactions
- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliance with focus states and keyboard navigation

## Color Palette

### Core Colors
- **Background**: `#0F172A` (Deep slate)
- **Card**: `#111827` (Card background)
- **Border**: `#1F2937` (Glass borders)
- **Text Primary**: `#F1F5F9` (White text)
- **Text Secondary**: `#CBD5E1` (Secondary text)
- **Text Muted**: `#94A3B8` (Muted text)

### Semantic Colors
- **Primary**: `#3B82F6` (Blue - Primary actions)
- **Success**: `#10B981` (Emerald - Approvals)
- **Danger**: `#EF4444` (Red - Denials/Errors)
- **Warning**: `#F59E0B` (Amber - Warnings/Fraud)

## Component Library

### 1. MetricCard
Premium statistic card with icon, trend indicator, and animations.
```tsx
<MetricCard
  label="Total Requests"
  value="1,247"
  icon={TrendingUp}
  trend={{ value: 12, isPositive: true }}
  variant="primary"
/>
```
**Features:**
- Animated value appearance
- Optional trend indicator
- Icon support with color variants
- Gradient background effect
- Hover lift animation

### 2. DecisionCard
Displays refund decisions with policy rules and confidence score.
```tsx
<DecisionCard
  decision="approved"
  reason="Purchase within 30-day window"
  policyApplied={["Refund window (1)", "No fraud flag (6)"]}
  confidence={92}
  timestamp="2026-06-16T10:30:00Z"
/>
```
**Features:**
- Color-coded status (approved/denied/escalated)
- Policy rule badges
- Confidence scoring
- Timestamp display
- Icon indicators

### 3. Timeline
Animated workflow visualization for agent reasoning steps.
```tsx
<Timeline
  steps={[
    { id: "1", label: "Customer Found", status: "completed", latency: 45 },
    { id: "2", label: "Policy Loaded", status: "completed", latency: 32 },
    { id: "3", label: "Decision Made", status: "completed", latency: 58 },
  ]}
/>
```
**Features:**
- Sequential step visualization
- Status indicators (completed/pending/error)
- Latency metrics
- Animated connecting lines
- Loading spinner for active steps

### 4. StatusBadge
Compact status indicator with color coding.
```tsx
<StatusBadge status="success" label="Approved" />
<StatusBadge status="danger" label="Denied" />
<StatusBadge status="warning" label="Review" />
```
**Variants:** success, danger, warning, info, pending

### 5. ChatBubble
Modern chat message bubble with typing animation.
```tsx
<ChatBubble
  message="Process refund for order: ORD-001"
  isUser={true}
  timestamp="2026-06-16T10:30:00Z"
/>
<ChatBubble
  message=""
  isUser={false}
  isLoading={true}
/>
```
**Features:**
- User/agent differentiation
- Typing animation
- Timestamp display
- Auto-scroll support

### 6. LoadingSkeleton
Skeleton loader for loading states.
```tsx
<LoadingSkeleton variant="card" count={3} />
<LoadingSkeleton variant="text" />
<LoadingSkeleton variant="avatar" />
<LoadingSkeleton variant="chart" />
```
**Variants:** card, text, avatar, chart

## Page Designs

### Homepage
- **Hero Section**: Animated gradient background with CTA buttons
- **Feature Highlights**: 4-column feature grid
- **KPI Cards**: 5-card metric display with icons
- **Feature Comparison**: 4-column feature card layout
- **CTA Section**: Final call-to-action with dual buttons

### Customer Chat Page
- **Sidebar Navigation**: Quick scenario buttons
- **Main Chat Area**: Message history with typing indicators
- **Decision Cards**: Prominent result display
- **Timeline**: Agent reasoning visualization
- **Copy Actions**: Easy result sharing

### Admin Dashboard
- **Top Metrics**: 5 KPI cards with trend indicators
- **Charts**: 4 different chart types (Line, Pie, Bar)
- **Recent Activity**: Scrollable activity feed
- **Risk Matrix**: High-risk customer list
- **Real-time Status**: Live connection indicator

## Animations & Interactions

### Fade In
Elements fade in from bottom with 0.3s timing.
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Slide In
Elements slide in from left with 0.3s timing.
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### Pulse Soft
Subtle pulsing effect for active elements.
```css
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Hover Effects
- **Glass Cards**: Border brightens, background lifts
- **Buttons**: Scale and shadow changes
- **Links**: Color transitions with underline effects

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Layout Adjustments
- 1-column layout on mobile
- 2-column on tablet
- 3-4 column on desktop
- Sidebar collapses on mobile

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in menus
- Escape to close modals

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 
         focus:ring-offset-2 focus:ring-offset-slate-950;
}
```

### Color Contrast
- All text meets WCAG AA standards
- Color-blind safe palette
- Status not conveyed by color alone

### Screen Reader Support
- Semantic HTML elements
- ARIA labels on icons
- Role attributes for components

## Dependencies

### Production
- `next`: 15.2.1
- `react`: 19.0.0
- `framer-motion`: 11.0.0 (animations)
- `recharts`: 2.12.0 (charts)
- `lucide-react`: 0.481.0 (icons)
- `@tanstack/react-query`: 5.0.0 (data fetching)
- `clsx`: 2.1.1 (className utility)

### Development
- `typescript`: 5.6.2
- `tailwindcss`: 3.4.4
- `autoprefixer`: 10.4.19
- `postcss`: 8.4.35

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

## Code Quality

### TypeScript
- Full type safety across all components
- Strict mode enabled
- Type definitions for all props

### Component Structure
- Functional components only
- Reusable hooks
- Proper prop interfaces
- JSDoc documentation

### Performance
- Code splitting per route
- Image optimization
- CSS-in-JS minimization
- Lazy loading for charts

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest 2 versions

## Future Enhancements
1. Dark/Light theme toggle
2. Custom dashboard widgets
3. Advanced filtering on logs
4. Real-time WebSocket updates
5. Export reports as PDF
6. Custom theme colors
7. Advanced analytics
8. Mobile app version

## Design Tokens

### Spacing
- Base unit: 4px
- Common spacing: 0, 2, 4, 6, 8, 12, 16, 20, 24

### Border Radius
- Small: 6px
- Medium: 12px
- Large: 16px (default cards)
- Full: 9999px (pills)

### Typography
- Heading: 2.5rem (40px)
- Subheading: 1.875rem (30px)
- Title: 1.5rem (24px)
- Body: 1rem (16px)
- Caption: 0.875rem (14px)
- Label: 0.75rem (12px)

### Box Shadows
- Small: `0 4px 20px rgba(15, 23, 42, 0.2)`
- Medium: `0 8px 32px rgba(15, 23, 42, 0.3)`
- Large: `0 20px 60px rgba(15, 23, 42, 0.3)`

## Maintenance

### Adding New Components
1. Create component file in `components/ui/`
2. Export from index if applicable
3. Add TypeScript interfaces
4. Include animation variants
5. Update this documentation

### Theme Changes
1. Edit `tailwind.config.ts` for colors
2. Update `globals.css` for global styles
3. Test across all pages
4. Update color palette section above

## Contact & Support
For design system updates and component requests, refer to this document.
