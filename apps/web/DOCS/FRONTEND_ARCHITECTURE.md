# Frontend Architecture Overview

## Overview

The Wordpool web application is a **Next.js 16+ server-first application** using the App Router, Tailwind CSS, and modern React patterns. It provides a seamless event discovery, creation, and ticketing experience powered by the Stellar blockchain.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                  │
│  (Pages, Components, UI Elements - Server & Client)    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               State & Data Fetching Layer                │
│  (SWR Hooks, Auth Context, localStorage)                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Services & Utilities Layer             │
│  (Stellar SDK, Blockchain Interactions, Formatters)    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend API Layer                     │
│  (/api/* routes with PostgreSQL & Prisma ORM)          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Blockchain & Database                   │
│  (Stellar Smart Contracts, PostgreSQL)                  │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

```
apps/web/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes (server)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── email/
│   │   │   ├── google/
│   │   │   └── apple/
│   │   ├── events/               # Event CRUD operations
│   │   │   ├── route.ts          # GET /api/events, POST create
│   │   │   ├── [id]/route.ts     # GET /api/events/[id]
│   │   │   ├── discover/         # GET /api/events/discover
│   │   │   └── following/        # GET /api/events/following
│   │   ├── payments/             # Payments & ticketing
│   │   │   └── ticket/route.ts   # POST /api/payments/ticket
│   │   ├── profile/              # User profile
│   │   ├── rates/                # Currency rates
│   │   └── v1/                   # Versioned endpoints
│   │       └── profile/[address] # GET /api/v1/profile/[address]
│   │
│   ├── (layout pages)            # Client-side pages
│   │   ├── auth/                 # Authentication UI
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── create-event/         # Event creation
│   │   ├── discover/             # Event discovery
│   │   ├── events/[id]/          # Event details
│   │   ├── faqs/                 # FAQ page
│   │   └── help/[category]/[slug] # Help/documentation
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   └── favicon.ico
│
├── components/                   # React components
│   ├── events/
│   │   ├── event-card.tsx        # Event card component
│   │   ├── event-detail.tsx      # Full event details
│   │   ├── event-location-map.tsx # Map with location
│   │   ├── map-client.tsx        # React Leaflet wrapper
│   │   ├── registration-box.tsx  # Ticket purchase UI
│   │   ├── TicketModal.tsx       # Ticket purchase modal
│   │   ├── mockups.ts            # Mock event data
│   │   └── EventCard.tsx         # Alternative card variant
│   │
│   ├── landing/                  # Homepage sections
│   │   ├── hero-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── pricing.tsx
│   │   ├── testimonials.tsx
│   │   └── faq-section.tsx
│   │
│   ├── profile/
│   │   ├── profile-header.tsx    # User profile display
│   │   ├── profile-events.tsx    # User's events
│   │   ├── profile-settings.tsx  # Settings
│   │   └── organizer-profile.tsx # Organizer branding
│   │
│   ├── recommendations/          # Event recommendations
│   │   ├── recommended-list.tsx
│   │   └── recommendation-card.tsx
│   │
│   ├── layout/                   # Shared layouts
│   │   ├── navbar.tsx            # Navigation bar
│   │   ├── footer.tsx            # Footer
│   │   ├── sidebar.tsx           # Mobile sidebar
│   │   ├── seo.ts                # SEO utilities
│   │   └── layout-wrapper.tsx
│   │
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── icons/
│       ├── loading-bar.tsx
│       ├── modal.tsx
│       └── badge.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useRecommendedEvents.ts   # Event recommendations hook
│   ├── useAuth.ts                # Authentication state
│   ├── useEvent.ts               # Single event fetching
│   ├── useEvents.ts              # Events list fetching
│   ├── useTicketAvailability.ts  # Real-time ticket status
│   └── useWallet.ts              # Wallet connection
│
├── lib/                          # Utilities & helpers
│   ├── api-handler.ts            # Error handling middleware
│   ├── api-errors.ts             # Error types & messages
│   ├── auth.ts                   # JWT verification
│   ├── events-store.ts           # Event data store
│   ├── prisma.ts                 # Prisma client singleton
│   └── client-utils.ts           # Client-side utilities
│
├── utils/                        # Utility functions
│   ├── stellar.ts                # Stellar SDK integration
│   ├── formatters.ts             # Date, number formatting
│   ├── validators.ts             # Input validation
│   ├── ticket-calculator.ts      # Ticket quantity logic
│   └── blockchain-utils.ts       # Blockchain helpers
│
├── prisma/
│   └── schema.prisma             # Database schema
│
├── __tests__/                    # Test files
│   ├── button.test.tsx
│   ├── event-card.test.tsx
│   ├── event-location-map.test.tsx
│   ├── gift-tickets.test.ts
│   └── navbar.test.tsx
│
├── DOCS/                         # Documentation
│   ├── COMPONENTS.md             # Component reference
│   ├── TESTING_STRATEGY.md       # Testing guide
│   ├── FRONTEND_ARCHITECTURE.md  # This file
│   └── MIGRATION_GUIDE.md        # Upgrade guides
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── event*.png
│   │   ├── pfp.png
│   │   └── hero.png
│   ├── icons/
│   │   ├── stellar-logo.svg
│   │   ├── arrow.svg
│   │   └── ...
│   └── fonts/
│
├── vitest.config.ts              # Test configuration
├── vitest.setup.ts               # Test environment
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind configuration
├── postcss.config.js             # PostCSS config
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
└── README.md                     # Project README
```

## Key Concepts

### 1. Server vs Client Components

**Server Components (Default)**

```typescript
// app/events/[id]/page.tsx - Server Component
export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = await fetchEvent(id);  // Direct DB access

  return (
    <main>
      <EventDetail event={event} />
      {/* Client component passed as children */}
      <RegistrationBox event={event} />
    </main>
  );
}
```

**Client Components**

```typescript
// components/events/registration-box.tsx
'use client';  // Opt-in to client rendering

import { useState } from 'react';

export function RegistrationBox({ event }) {
  const [quantity, setQuantity] = useState(1);  // State on client

  return (
    <div>
      {/* Interactive elements */}
      <button onClick={() => setQuantity(q => q + 1)}>+</button>
    </div>
  );
}
```

**Benefits:**

- Server components reduce JavaScript bundle size
- Direct database access without API calls
- Secrets stay on server
- Better SEO (content on server)
- Client components handle interactivity

### 2. Data Fetching Patterns

#### API Routes (Server-Side)

```typescript
// app/api/events/[id]/route.ts
export async function GET(request: NextRequest, { params }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { tickets: true }, // Include related data
  });

  return NextResponse.json(event);
}
```

#### Client-Side Fetching (SWR)

```typescript
// hooks/useRecommendedEvents.ts
import useSWR from "swr";

export function useRecommendedEvents(limit = 12) {
  const { data, error, isLoading } = useSWR(
    `/api/v1/recommendations/events?limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  return { events: data?.events ?? [], isLoading, error };
}
```

#### Server-Side Rendering

```typescript
// In server components
const event = await fetchEvent(id); // No loading state needed
```

### 3. Authentication Flow

```
User Login
    ↓
POST /api/auth/{provider} → JWT Token
    ↓
Token stored in cookie (secure, httpOnly)
    ↓
getAuthFromRequest() → Extract from cookie
    ↓
Protected endpoints check auth before proceeding
```

**Implementation:**

```typescript
// lib/auth.ts
export function getAuthFromRequest(
  request: NextRequest,
): AuthTokenPayload | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// app/api/events/route.ts
const auth = getAuthFromRequest(request);
if (!auth?.email) {
  throwApiError("Unauthorized", 401);
}
```

### 4. Blockchain Integration

**Ticket Minting Flow:**

```
User clicks "Buy Ticket"
    ↓
POST /api/payments/ticket { eventId, quantity, buyerWallet, recipientWallet }
    ↓
Check availability in PostgreSQL
    ↓
Call mintTicket() → Stellar Smart Contract
    ↓
Update event.mintedTickets in database
    ↓
Return ticketId to client
    ↓
User sees confirmation
```

**Stellar SDK Wrapper:**

```typescript
// utils/stellar.ts
export async function mintTicket(eventId: string, buyer: string, qty: number) {
  const contract = new Contract(STELLAR_CONTRACT_ADDRESS);
  const tx = new TransactionBuilder(sourceAccount)
    .addOperation(
      contract.call(
        "mint_ticket",
        nativeToScVal(eventId, { type: "string" }),
        nativeToScVal(buyer, { type: "address" }),
        nativeToScVal(qty, { type: "u32" }),
      ),
    )
    .build();

  tx.sign(sourceKeypair);
  const prepared = await server.prepareTransaction(tx);
  const submitted = await server.sendTransaction(prepared);

  return { ticketId: `ticket_${submitted.hash}` };
}
```

### 5. Component Communication

**Props Drilling (Direct)**

```typescript
<EventCard event={event} onSelect={handleSelect} />
```

**Context (Limited Use)**
Currently no global context providers. Authentication is per-request.

**State Management (SWR)**

```typescript
const { data: events } = useSWR("/api/events");
// Automatic revalidation on focus, tab switch
```

## State Management

### Current Approach

- **Per-Component State**: `useState` for UI state (modals, inputs)
- **Data Fetching**: SWR with automatic caching and revalidation
- **Authentication**: JWT cookies (server-validated)
- **No Global State Manager**: Zustand/Redux not needed yet

### Pattern Example

```typescript
'use client';

export function EventCard({ event }: EventCardProps) {
  // UI state
  const [isExpanded, setIsExpanded] = useState(false);

  // Data fetching
  const { organizer, isLoading } = useOrganizer(event.organizerWallet);

  // Derived state
  const availableTickets = event.totalTickets - event.mintedTickets;

  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* Content */}
    </div>
  );
}
```

## Styling Architecture

### Tailwind CSS

- **Version**: v4 with PostCSS integration
- **Custom Config**: `tailwind.config.ts`
- **Design Tokens**: Colors, spacing, typography defined in config
- **Responsive Design**: Mobile-first (`sm:`, `md:`, `lg:`, `xl:` prefixes)

### Utility Classes

```typescript
// Component styling with utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-white shadow-sm border border-black/5">
  <img src={...} className="w-12 h-12 rounded-full object-cover" />
  <div className="flex-1">
    <h3 className="font-bold text-lg text-black">Title</h3>
    <p className="text-gray-600 text-sm">Subtitle</p>
  </div>
</div>
```

### Custom Components

```typescript
// components/ui/button.tsx - Reusable button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-colors';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }[variant];

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses}`} {...props} />
  );
}
```

## Performance Optimizations

### 1. Image Optimization

```typescript
import Image from 'next/image';

// Automatic optimization with next/image
<Image
  src={eventImageUrl}
  alt={eventTitle}
  width={800}
  height={600}
  priority        // For above-the-fold images
  placeholder="blur" // Blur effect while loading
/>
```

### 2. Code Splitting

- Next.js automatically code-splits at route level
- Dynamic imports for heavy components:

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});
```

### 3. SWR Caching

```typescript
useSWR(url, fetcher, {
  revalidateOnFocus: false, // Don't refetch on window focus
  dedupingInterval: 5 * 60 * 1000, // 5 min cache
});
```

### 4. Server Components

- Reduces JavaScript sent to browser
- Direct database queries avoid extra API calls
- Server-side data transformation

## Data Flow: Event Detail Page

```
User visits /events/[id]
    ↓
EventDetailPage (Server Component)
    ├─ await params (get ID)
    ├─ await fetchEvent(id) from Prisma
    ├─ await fetchOrganizerProfile(wallet)
    └─ Render with data
        ↓
    Layout (image, title, description)
        ↓
    HostedBy (organizer info)
        ↓
    EventLocationMap (Leaflet map)
        ↓
    RegistrationBox (Client Component)
        ├─ State: quantity, isModalOpen
        ├─ On click: Open ticket modal
        ├─ On submit: POST /api/payments/ticket
        ├─ Call stellar.mintTicket()
        └─ Show confirmation
```

## API Response Patterns

### Success Response

```typescript
{
  status: 200,
  body: {
    id: 'evt_123',
    title: 'Event Name',
    // ... event data
  }
}
```

### Error Response

```typescript
{
  status: 400,
  body: {
    error: 'Invalid eventId',
    code: 'VALIDATION_ERROR'
  }
}
```

### List Response

```typescript
{
  status: 200,
  body: {
    items: [{ ... }, { ... }],
    tab: 'upcoming',
    type: 'my'
  }
}
```

## Error Handling

### API Error Handler

```typescript
// lib/api-handler.ts
export const withErrorHandler = (handler: RouteHandler) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(err.toJSON(), { status: err.status });
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
};
```

### Component Error Boundaries

```typescript
// Wrap components that might throw
import { Suspense } from 'react';

<Suspense fallback={<LoadingCard />}>
  <EventCard eventId={id} />
</Suspense>
```

## Testing Architecture

See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for complete testing guide.

**Quick Overview:**

- Unit tests: Individual components
- Integration tests: Component combinations
- API tests: Route handlers
- Test location: `__tests__/` directory
- Runner: Vitest with jsdom environment

## SEO & Metadata

### Server-Side Metadata

```typescript
// app/events/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await fetchEvent(params.id);

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      image: event.imageUrl,
      url: `${baseUrl}/events/${event.id}`,
    },
  };
}
```

### SEO Utilities

```typescript
// components/layout/seo.ts
export function buildMetadata(props: SEOProps): Metadata {
  return {
    title: props.title,
    description: props.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: props.path,
      siteName: "Wordpool",
      images: [{ url: props.image }],
    },
    twitter: {
      card: "summary_large_image",
      image: props.image,
    },
  };
}
```

## Deployment

### Build Process

```bash
pnpm build    # Generates .next/ directory
pnpm start    # Starts production server
```

### Environment Variables (`.env.local`)

```
NEXT_PUBLIC_API_URL=https://api.Wordpool.dev
JWT_SECRET=your_jwt_secret
STELLAR_CONTRACT_ADDRESS=CABC...
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://user:pass@host/db
```

## Common Patterns & Best Practices

### ✅ DO:

- Use server components by default
- Fetch data on server when possible
- Keep client components small and focused
- Use Tailwind utilities over CSS files
- Type everything with TypeScript
- Test user-facing behavior

### ❌ DON'T:

- Overuse client components
- Fetch sensitive data on client
- Use inline CSS in components
- Leave TypeScript errors
- Test implementation details

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Testing Library](https://testing-library.com)
- [Stellar SDK](https://js.stellar.org)
