# CLAUDE.md - Development Guidelines

## Commands
- `npm run dev` - Start development server with Turbopack + debugging
- `npm run build` - Build the production app
- `npm run start` - Start the production server
- `npm run lint` - Run linting checks
- `npm run export` - Export static HTML files

## Code Style
- **Imports**: Group by external libraries first, then internal components/utils
- **TypeScript**: Use strict mode, explicit types for props via interfaces/types
- **Naming**: 
  - Components: PascalCase
  - Functions/variables: camelCase
  - Files: Same case as their exports (PascalCase for components)
- **Components**: 
  - Function components with type annotations
  - Destructure props in function parameters
- **Styling**: Use Tailwind CSS with class-variance-authority for components
- **Error Handling**: 
  - Use try/catch for filesystem operations
  - Add logging for debugging (but comment out in production)
- **Path Aliases**: Use `@/*` import alias for project files
- **Architecture**: Follow Next.js App Router patterns with page.tsx components