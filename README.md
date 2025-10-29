# SmartGrant Opportunity Builder

A modular React application for managing grant opportunities across SMEs, Vendors, and Consultants.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Demo (90 seconds)

### SME Flow
1. **Dashboard** → Click "Start New Opportunity"
2. **Step 1** → Enter goal: "We want to upgrade our ERP system"
3. **Step 2** → Select "Cloud ERP Implementation" (PSG eligible)
4. **Step 3** → Choose "Limited" visibility, enable matching
5. **Step 4** → Select "Consultant-Managed" mode
6. **Step 5** → Review shortlist, dispatch invitations

### Vendor/Consultant Flow
1. Switch persona in header
2. View lead marketplace with masked previews
3. Accept lead (spends 1 credit)
4. Submit indicative proposal/quotation

### Comparison View
1. After both sides submit indicatives
2. SME can compare proposals side-by-side
3. Award preferred vendor/consultant

## Architecture

```
src/
├── app/routes/          # React Router setup
├── components/common/   # Shared UI components
├── features/           # Feature-specific components
│   ├── dashboard/      # Persona dashboards
│   ├── opportunityBuilder/ # SME workflow steps
│   └── leads/          # Lead management
├── mocks/              # Mock data and API
├── state/              # Zustand store and types
└── styles/             # Global styles
```

## Key Features

- **Modular Architecture**: Easy to extend with new features
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand with Immer for immutable updates
- **Mock API**: Simulated backend with realistic latency
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Mode**: Built-in theme switching

## Data Flow

1. **SME** creates ReqDoc → selects TRHLS → sets privacy → chooses mode
2. **System** generates matches and masked leads
3. **Vendors/Consultants** accept leads → submit indicatives
4. **SME** compares options → awards winner

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## Mock Data

All data is static but internally consistent. Changes to seeds automatically update across all personas. The system simulates a real workflow while remaining deterministic for demos.
