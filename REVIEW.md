# Code Review Policy

The default policy for the shared Claude Code Review workflow. It lives in [`xdanger/xdanger`](https://github.com/xdanger/xdanger) and applies to every repository that calls the workflow. A calling repository may add its own `REVIEW.md` on its default branch: its rules take precedence where the two conflict, and this policy covers the rest.

## Scope

- Review the diff for correctness, security, and code quality, in the context of the full codebase.
- Report only specific, actionable findings, at most 10.

## Severity

Prefix every finding with its label (for example, `P1:`).

- **P0 — Critical:** an immediately exploitable vulnerability, irreversible data loss, or a similarly catastrophic failure.
- **P1 — Blocking:** serious incorrect behavior, security exposure, or operational failure that should block merging.
- **P2 — Meaningful:** a substantive correctness, reliability, compatibility, or maintainability issue below P1.
- **P3 — Minor:** a low-impact improvement, nit, or preference.

Code: report P0–P2. Skip P3, and never inflate or reframe a minor issue as P2.

Documentation: report only verifiable factual errors at P0 or P1, so wording, detail, or style never blocks CI.

## Always check

- Logic errors, off-by-one bugs, and boundary conditions
- Security: injection, XSS, SSRF, secrets in code, etc.
- Race conditions and concurrency
- Error handling: unhandled exceptions, swallowed errors, missing edge cases
- API contracts: mismatched types, missing required fields
- Backward-compatible database migrations

## Skip

- Formatting (handled by Prettier and linters)
- Generated files, lock files (`pnpm-lock.yaml`, etc.), and vendored code
- Naming preferences that don't affect readability
- Authoring preferences: early returns, structured logging, focused functions. They guide new code but are not findings; if a violation causes a reportable problem, report that problem instead.
