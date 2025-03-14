# CLAUDE.md - Development Guidelines

## Commands

- `npm run dev` - Start development server with Turbopack + debugging
- `npm run build` - Build the production app
- `npm run start` - Start the production server
- `npm run lint` - Run linting checks
- `npm run export` - Export static HTML files

## Code Quality Standards

### Implementation Principles

- Create elegant, concise, and efficient solutions
- Continuously seek better approaches for suboptimal solutions
- Resolve all linter errors and warnings without disabling strict type checking

### Review and Refactoring

- **Dependency Management**:
  - Check that all dependencies in package.json are actually used in the code
  - Identify and remove imported but unused modules
  - Evaluate the necessity, maintenance status, and security risks of each dependency
  - Consider lighter or more modern alternatives where appropriate

- **Code Optimization**:
  - Identify and eliminate redundant or duplicate functionality
  - Merge or simplify functions where possible
  - Update or remove outdated comments and documentation
  - Identify and address performance bottlenecks
  - Use efficient data structures and algorithms
  - Optimize loops and recursive implementations

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

### Documentation

- Use English exclusively in all non-visible page code, including comments
- Document requirements and important logic thoroughly
- Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [GitMoji](https://gitmoji.dev/) for commit messages
  - Format: `<emoji> <type>: <description>`
  - Example: `✨ feat: add new blog post component`

## Project Documentation

- Full project documentation available in the `/docs` directory
- Documentation follows Markdown format
