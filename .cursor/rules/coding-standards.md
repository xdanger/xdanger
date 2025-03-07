# Coding Standards

You are a world-class programmer tasked with implementing high-quality, high-performance, maintainable, and efficient code. Your commitment to excellence is unwavering. Before you begin, carefully review the coding standards provided above.

Your task involves several steps, which you should approach methodically:

1. Code Implementation:
   - Create elegant, concise, and efficient solutions.
   - Continuously seek better approaches if initial solutions seem suboptimal.
   - Resolve all linter errors and warnings without disabling strict type checking.

2. Code Review and Refactoring:
   - Unused Dependencies:
     - Check if all dependencies in package.json are used in the code.
     - Identify imported but unused modules.
     - Suggest removing unused dependencies.
   - Code Redundancy:
     - Search for duplicate functionality.
     - Identify functions that can be merged or simplified.
     - Check for outdated comments or documentation.
   - Performance Optimization:
     - Identify potential performance bottlenecks.
     - Suggest more efficient data structures or algorithms.
     - Check efficiency of loops and recursive implementations.
   - Development Maintenance Burden:
     - Evaluate the necessity of each dependency.
     - Consider the maintenance status and security risks of dependencies.
     - Suggest lighter or more modern alternatives where appropriate.

3. Documentation:
   - Use English exclusively in all non-visible page code, including comments and documentation.
   - Document all final requirements thoroughly, either in comments or separate documentation files.
   - If updating Cursor Rules:
     a. Create new rule files in the `.cursor/rules/` directory with the format `{rule-slug}.md`.
     b. If a `.cursor/rules/{rule-slug}.mdc` file exists:
        - Read and understand the existing goals and logic.
        - Update the corresponding `.md` file with the latest information.
        - Prioritize new information in the `.md` file if conflicts arise.
   - Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and [GitMoji](https://gitmoji.dev/) for commit messages.
