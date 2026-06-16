# WorkPodd AI Refund Agent — Frontend

Premium Next.js frontend application for AI-powered customer refund processing with real-time observability dashboard.

## ✨ Features

### 🎨 Premium UI/UX
- Dark theme with glassmorphism design
- Smooth animations and micro-interactions
- Responsive layout (mobile, tablet, desktop)
- Professional component library
- Enterprise-grade styling

### 💬 Customer Chat Interface
- ChatGPT-like modern interface
- Real-time decision display
- Agent reasoning timeline
- Quick scenario buttons
- Typing indicators and animations

### 📊 Admin Dashboard
- Real-time metrics and KPIs
- Interactive charts (approval trends, fraud distribution, processing time)
- Recent activity feed
- High-risk customer matrix
- Live connection status

### 🤖 AI Integration
- LangGraph agent visualization
- Policy rule breakdown
- Decision confidence scoring
- Tool call tracking with latency
- AI-generated explanations

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage with hero section
│   ├── chat/
│   │   └── page.tsx        # Customer chat interface
│   └── dashboard/
│       └── page.tsx        # Admin dashboard with charts
├── components/
│   ├── ui/
│   │   ├── metric-card.tsx      # KPI statistic card
│   │   ├── decision-card.tsx    # Refund decision display
│   │   ├── timeline.tsx         # Agent workflow timeline
│   │   ├── chat-bubble.tsx      # Chat message component
│   │   ├── status-badge.tsx     # Status indicator
│   │   ├── loading-skeleton.tsx # Loading placeholder
│   │   ├── nav.tsx             # Top navigation
│   │   ├── button.tsx          # Button component
│   │   ├── input.tsx           # Input field
│   │   ├── textarea.tsx        # Textarea field
│   │   ├── badge.tsx           # Badge component
│   │   ├── card.tsx            # Card container
│   │   └── table.tsx           # Table component
│   └── providers.tsx        # React Query provider
├── lib/
│   └── api.ts              # API client functions
├── styles/
│   └── globals.css         # Global styles and animations
├── types.ts                # TypeScript type definitions
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── DESIGN_SYSTEM.md        # Design system documentation
└── UI_UX_UPGRADE_SUMMARY.md # Upgrade summary
```

## 🎯 Pages

### Homepage (`/`)
- Hero section with animated background
- Feature highlights
- KPI cards with trends
- Feature comparison grid
- Call-to-action buttons

### Customer Chat (`/chat`)
- Modern chat interface
- Quick scenario selection
- Real-time agent responses
- Decision cards
- Timeline visualization
- Copy explanation button

### Admin Dashboard (`/dashboard`)
- KPI metrics with icons
- Approval trend chart
- Fraud risk distribution pie chart
- Processing time bar chart
- Decision distribution
- Recent activity feed
- High-risk customer list

## 🎨 Design System

### Components
- **MetricCard**: Display statistics with icons and trends
- **DecisionCard**: Show refund decisions with policy rules
- **Timeline**: Visualize agent reasoning steps
- **ChatBubble**: Modern message display
- **StatusBadge**: Status indicators
- **LoadingSkeleton**: Loading placeholders

### Colors
- Primary: `#3B82F6` (Blue)
- Success: `#10B981` (Emerald)
- Danger: `#EF4444` (Red)
- Warning: `#F59E0B` (Amber)
- Background: `#0F172A` (Dark slate)
- Card: `#111827`
- Border: `#1F2937`

### Animations
- Fade-in on component load
- Slide-in for navigation
- Hover lift effects
- Typing indicator
- Pulse animations
- Smooth transitions

## 📦 Dependencies

### Core
- `next@15.2.1`: React framework
- `react@19.0.0`: UI library
- `react-dom@19.0.0`: React DOM

### UI & Animation
- `framer-motion@11.0.0`: Smooth animations
- `tailwindcss@3.4.4`: Utility CSS framework
- `lucide-react@0.481.0`: Icon library

### Data & State
- `@tanstack/react-query@5.0.0`: Data fetching and caching

### Utilities
- `clsx@2.1.1`: Classname utility
- `autoprefixer@10.4.19`: CSS post-processor
- `postcss@8.4.35`: CSS parser

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 Environment Variables

Create `.env.local`:

```env
# API endpoint (optional, defaults to relative URL)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📊 API Integration

The frontend connects to the refund-agent backend API:

### Endpoints Used
- `GET /api/health` - Health check
- `GET /api/metrics` - KPI metrics
- `GET /api/logs` - Activity logs
- `GET /api/customers` - Customer data
- `GET /api/orders` - Order data
- `POST /api/refund` - Process refund request
- `POST /api/chat` - Chat endpoint

## ♿ Accessibility

- WCAG AA color contrast compliance
- Keyboard navigation support
- Focus states on interactive elements
- ARIA labels on icons
- Semantic HTML structure
- Screen reader friendly

## 📱 Responsive Design

- Mobile: `< 640px` - Stacked layout
- Tablet: `640px - 1024px` - 2-column layout
- Desktop: `> 1024px` - Multi-column layout

All pages are optimized for mobile, tablet, and desktop viewing.

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Docker
```bash
# Build image
docker build -t workpodd-frontend .

# Run container
docker run -p 3000:3000 workpodd-frontend
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Charts Not Rendering
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors

### Animations Janky
- Verify GPU acceleration enabled in browser
- Check for performance bottlenecks in DevTools

## 📖 Documentation

- **[Design System](./DESIGN_SYSTEM.md)** - Complete design system documentation
- **[UI/UX Upgrade Summary](./UI_UX_UPGRADE_SUMMARY.md)** - Detailed upgrade documentation

## 🎬 Demo Scenarios

### Scenario 1: Approved Refund
Order: `ORD-APPROVED-001`
Expected: APPROVED with reasoning

### Scenario 2: Denied (Digital Product)
Order: `ORD-DENIED-DIGITAL-001`
Expected: DENIED (digital product policy)

### Scenario 3: Denied (Fraud)
Order: `ORD-DENIED-FRAUD-001`
Expected: DENIED (high fraud score)

### Scenario 4: Approved (Defective)
Order: `ORD-DEFECTIVE-001`
Expected: APPROVED (defective product exception)

## 🤝 Contributing

To add new components:

1. Create component in `components/ui/`
2. Include TypeScript interfaces
3. Add animations with Framer Motion
4. Document in DESIGN_SYSTEM.md
5. Test on all breakpoints

## 📄 License

WorkPodd © 2026

## 🙋 Support

For issues and feature requests, check the main README in the project root.

---

**Status**: Production Ready ✓
**Version**: 1.0.0
**Last Updated**: June 16, 2026
