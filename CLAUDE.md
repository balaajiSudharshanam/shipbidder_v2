this is logistic management platform where the user can add jobs and truck owners can bid for each job, lowest bid wins. this project will contain a reverse auction engine and ability to accomodate several bids at once also a route optimization module for driver to pickup other job on their way, and an AI assitant for both driver and the job poster, employer will have a dashboard to manage the fleet.

### before every build
- before every build i asking to build trigger /grill me skill
- ask me how it should be built or created, dont take the architectural being said you are still allowed to provide suggestions
-

### backedn logic
- this project follows ddd pattern, every domain, application and mapper
- use the mapper to map the response with the required DTO
- every database functions like model definition and repository should be inside the domain including any required enum


### frontend
- this project uses react as frontend use typescript to be type safe,
- Frontend should follow feature based patterns
every pattern 
- every component should be under the particular feature it belongs along the with api calls under api folder of each feature
name each folder with apps feature
- write every api calls in api file
- put all the pages of the feature under pages folder in feature folder
- use the common folder to encoporate common components that can be used across several feature examples button, banner,..etc.
### Type Safety

- **Never use `any`**. Explicit types for all parameters, return values, and variables.
- **Limit `unknown`** — avoid `unknown`, `Record<string, unknown>`, and `as unknown as T` assertions. A `Record<string, unknown>` almost always signals a missing explicit type definition.
- **Don't duplicate types** — before defining a new type, check whether it already exists in the project (especially `packages/data-provider`). Reuse and extend existing types rather than creating redundant definitions.
- Use union types, generics, and interfaces appropriately.
- All TypeScript and ESLint warnings/errors must be addressed — do not leave unresolved diagnostics.
- ### Comments and Documentation

- Write self-documenting code; no inline comments narrating what code does.
- JSDoc only for complex/non-obvious logic or intellisense on public APIs.
- Single-line JSDoc for brief docs, multi-line for complex cases.
- Avoid standalone `//` comments unless absolutely necessary.

### Import Order

Imports are organized into three sections:

1. **Package imports** — sorted shortest to longest line length (`react` always first).
2. **`import type` imports** — sorted longest to shortest (package types first, then local types; length resets between sub-groups).
3. **Local/project imports** — sorted longest to shortest.

Multi-line imports count total character length across all lines. Consolidate value imports from the same module. Always use standalone `import type { ... }` — never inline `type` inside value imports.

### JS/TS Loop Preferences

- **Limit looping as much as possible.** Prefer single-pass transformations and avoid re-iterating the same data.
- `for (let i = 0; ...)` for performance-critical or index-dependent operations.
- `for...of` for simple array iteration.
- `for...in` only for object property enumeration.

### style
- use color palatte that includes only #1c1b1b #474545 #f3f3f3
- text style Source sans pro


### DRY

- Extract repeated logic into utility functions.
- Reusable hooks / higher-order components for UI patterns.
- Parameterized helpers instead of near-duplicate functions.
- Constants for repeated values; configuration objects over duplicated init code.
- Shared validators, centralized error handling, single source of truth for business rules.
- Shared typing system with interfaces/types extending common base definitions.
- Abstraction layers for external API interactions.

### format
- dont hardcode routes anywhere, you use apiroutes from common for backend,
- create a endpoint file in frontend if not present and use endpoints from there
- create a routes file in frontend if not present and use route from there all over the project

### before every commit or push
- trigger the /commit skill before every git commit or push — no exceptions
- the skill checks for merge conflicts, updates README.md changelog, and drafts the commit message
- never commit or push until the skill has run and the user has confirmed the message

### before every feature

