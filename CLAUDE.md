# PraxisNotes Project Guidelines

## Commands

- `npm run dev` - Development mode with turbopack (web: port 3000)
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run check-types` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run validate` - Run lint and format check

## Code Standards

- **TypeScript**: Use strict typing with proper JSDoc documentation
- **File naming**: kebab-case for files, PascalCase for components/types, camelCase for variables
- **API**: Use standard response utilities, validation, and error handling (refer to implementation plans)
- **Types**: Use `type` instead of `interface` except for NextAuth declaration merging
- **Error handling**: Use custom error classes and the central error handler
- **Commits**: Follow conventional commit format (feat, fix, docs, etc.)
- **State Management**: Avoid redundant state, use optimistic updates where appropriate

## API Implementation

All API endpoints must:

1. Use standardized response formats
2. Validate input with Zod schemas
3. Apply middleware for auth/validation/error handling
4. Follow RESTful principles
5. Implement proper error handling with appropriate status codes

## Database Guidelines

- Use Drizzle ORM with defined table schemas and relationships
- Export types from database schema definitions
- Use prepared statements for all queries
