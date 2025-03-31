# PraxisNote - RBT Daily Report Assistant

PraxisNote is a specialized web application designed to streamline the documentation process for Registered Behavior Technicians (RBTs) working with clients in Applied Behavior Analysis (ABA) therapy. The application simplifies data collection, supports input from Board Certified Behavior Analysts (BCBAs), and automatically generates comprehensive daily reports for each client session.

## Project Overview

### Key Features

- **Efficient Session Documentation**: Streamlined forms for RBTs to document session data
- **AI-Assisted Report Generation**: Automated report creation using Anthropic's Claude AI models
- **Client Management**: Track and manage client information and history
- **Secure Authentication**: Role-based access for different types of users
- **Draft Saving**: Auto-save functionality to prevent data loss
- **Mobile Responsive**: Designed to work on desktop and mobile devices

### Business Value

- Reduces documentation time for healthcare professionals
- Improves data accuracy and consistency
- Enhances collaboration between team members
- Provides better insights into client progress
- Ensures compliance with documentation requirements

## Tech Stack

PraxisNote is built as a modern web application using:

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) 14+ with App Router
- **UI**: [React](https://react.dev/) with [TailwindCSS](https://tailwindcss.com/) and [ShadCN UI](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **AI Integration**: [AI SDK](https://sdk.vercel.ai/docs) with Anthropic's Claude models

### Backend

- **API Routes**: Next.js API Routes
- **Database**: PostgreSQL (via [Supabase](https://supabase.com/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT token-based with [Next-Auth](https://next-auth.js.org/)

### Development

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Management**: npm workspaces with [Turborepo](https://turbo.build/)
- **Linting & Formatting**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged

## Project Structure

The project is set up as a monorepo using Turborepo with the following structure:

```
praxisNotes/
├── apps/
│   ├── web/          # Main Next.js application
│   └── docs/         # Documentation site
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/ # Shared ESLint configuration
│   ├── tailwind-config/ # Shared Tailwind configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── docs/             # Project documentation
└── implementation-plans/ # Implementation planning documents
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 10 or later

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-organization/praxisNote.git
   cd praxisNote
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the apps/web directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

### Linting and Type Checking

```bash
npm run lint
npm run check-types
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact [support@example.com](mailto:support@example.com).
