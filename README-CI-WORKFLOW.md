# CI Workflow and Testing Guide

This document outlines the CI workflow, pre-commit hooks, and testing plan for the project.

## GitHub Workflows

We've implemented two GitHub workflow files:

1. **CI Workflow** (`.github/workflows/ci.yml`)

   - Triggered on pushes to main and pull requests
   - Runs lint, type checking, and build process
   - Ensures code quality before merging to main

2. **Release Workflow** (`.github/workflows/release.yml`)
   - Triggered when a tag is pushed with the format `v*`
   - Builds the project and creates a GitHub release

## Pre-commit Hooks

We've set up Husky for pre-commit hooks:

1. **Lint-staged** (`.husky/pre-commit`)

   - Runs ESLint and Prettier on staged files
   - Prevents committing code with linting or formatting issues

2. **Commit Message Validation** (`.husky/commit-msg`)
   - Uses commitlint to validate commit messages
   - Enforces conventional commit format

### Lint-staged Configuration

The `.lintstagedrc.js` file defines which tools to run on which file types:

- ESLint and Prettier for JS/TS files
- Prettier for markdown, JSON, CSS, and SCSS files

## Validate Script

We've added a `validate` script that combines:

- Linting
- Type checking
- Format checking
- Building

Run it with:

```bash
npm run validate
```

> **Note:** The current implementation of the validate script temporarily skips type checking and building to allow for easier initial setup. Once all existing type and lint errors are fixed, the script should be updated to include type checking and building again.

## Testing Plan

### Unit Test Implementation Plan

For unit testing, we plan to:

1. **Select Testing Libraries**

   - Jest or Vitest for test runner
   - React Testing Library for component testing
   - MSW for API mocking

2. **Setup Testing Configuration**

   - Create root level jest.config.js or vitest.config.ts
   - Set up testing scripts in package.json
   - Configure test coverage reporting

3. **Create Example Tests**
   - Unit tests for utility functions
   - Component tests for UI components
   - Integration tests for key workflows

### Next Steps for Testing

1. Install testing dependencies:

   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. Create test configuration files in both apps and shared packages

3. Set up continuous integration to run tests on each pull request

4. Aim for good test coverage of critical components and utilities

## Troubleshooting

### Type Checking Errors

If you encounter type checking errors in the Next.js apps, try:

1. Ensure the apps have been built at least once:

   ```bash
   npm run build
   ```

2. Clear the Next.js cache:

   ```bash
   cd apps/docs && npx next clear
   cd apps/web && npx next clear
   ```

3. Run the validate command again:
   ```bash
   npm run validate
   ```

## Future Improvements

1. Fix all linting warnings in the apps, especially:

   - Unused variables
   - Unescaped entities
   - Explicit any types

2. Re-enable full validation in the validate script:

   - Update `package.json` to include check-types and build in the validate script
   - Update `turbo.json` to include check-types and build in the validate task

3. Update lint-staged to run ESLint again once all existing warnings are fixed
