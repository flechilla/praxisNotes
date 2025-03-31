# PraxisNote: RBT Daily Report Assistant

PraxisNote is a specialized application designed to help Registered Behavior Technicians (RBTs) efficiently document and manage daily session data for clients, while facilitating input from Board Certified Behavior Analysts (BCBAs) and automatically generating comprehensive reports.

## Documentation

### Core Documentation

- [Technical Specification](docs/technical-specification.md) - Technical architecture and implementation details
- [Database Specification](docs/database-specification.md) - Database schema and data relationships
- [UI/UX Specification](docs/ui-ux-specification.md) - User flows and interface design
- [Audience Definition](docs/audience-definition.md) - User personas and audience analysis
- [Accessibility Specification](docs/accessibility-specification.md) - Accessibility requirements and guidelines
- [RBT User Flow](docs/rbt-user-flow.md) - Detailed flow for RBT users
- [Implementation Plan](docs/implementation-plan.md) - Step-by-step implementation plan
- [AI-SDK with Anthropic Integration](docs/ai-sdk-anthropic-integration.md) - Integration details for AI-assisted report generation

### Original Design Document

- [PraxisNote Implementation](docs/praxisnote-implementation.md) - Original implementation document

## Key Features

- **User Authentication** - Secure login with role-based access (RBT, BCBA, Administrator)
- **Client Management** - Manage client profiles and therapy programs
- **Session Reports** - Structured multi-step form for session documentation
- **Report Generation** - AI-assisted report generation using ai-sdk with Anthropic models
- **Review System** - Workflow for BCBA review and feedback
- **Dashboards** - Role-specific dashboards with relevant information

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (via Supabase)

### Technologies

- Next.js 14+ with App Router
- React with TypeScript
- TailwindCSS & ShadCN UI
- React Hook Form with Zod
- Drizzle ORM
- Next-Auth
- ai-sdk with Anthropic for report generation

### Getting Started

```bash
# Clone the repository
git clone [repository URL]

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

## Contributing

Please see the [Implementation Plan](docs/implementation-plan.md) for details about the development roadmap. The MVP focuses on report generation from form data.

## License

[License details]
