# Skills.md — Claude Code Skills Reference

This file documents all available Claude Code skills (slash commands) for this repository. Skills are defined in `.claude/commands/` and can be invoked from any Claude Code session.

---

## What Are Skills?

Skills are reusable, packaged workflows that load on demand when you type a `/command` in a Claude Code session. They are different from CLAUDE.md rules (always loaded) — skills only activate when you invoke them explicitly.

Skill definitions live in `.claude/commands/<name>.md`.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

**Purpose:** Inspect the live website and produce a comprehensive structural report.

**What it does:**
1. Fetches the homepage and key sub-pages using `WebFetch`
2. Extracts: page title, meta description, all nav items and their URLs, forms (fields, types, required), CTAs, headings (h1–h4), viewport meta tag, HTTPS status, favicon
3. Discovers all linked pages (contact, pricing, about, features, blog)
4. Reports: a populated `site.config.json` ready to paste in, plus an issues checklist

**Output:**
- Updated `site.config.json` content
- Issues checklist (missing meta, no HTTPS, missing alt text, etc.)

**Example invocation:**
```
/analyze-site
/analyze-site https://staging.digitile.io
```

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

**Purpose:** Analyze the live site and generate a complete Playwright test suite from scratch.

**What it does:**
1. Reads `site.config.json`
2. Discovers all pages via `WebFetch` (homepage, about, services, pricing, contact, features)
3. Plans page object classes based on discovered pages and features
4. Writes page object files to `src/pages/`
5. Writes test files across all categories to `tests/`
6. Updates `site.config.json` with discovered nav items and flags
7. Runs `npx tsc --noEmit` to verify TypeScript compiles

**Output:** Complete set of page objects and tests tailored to the actual site HTML.

**Example invocation:**
```
/generate-full-suite
```

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

**Purpose:** Execute the smoke test suite and display a formatted pass/fail summary.

**What it does:**
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a table: test name | status | duration
4. Lists failures with suggested fixes
5. Returns the test exit code

**Output:** Formatted console table of smoke test results.

**Example invocation:**
```
/run-smoke
```

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

**Purpose:** Regenerate visual regression baseline screenshots after intentional UI changes.

**What it does:**
1. Runs `npm run baseline` (Playwright `--update-snapshots`)
2. Lists which baseline files were created or updated
3. Reminds you to review screenshots visually before committing
4. Warns: baselines must be human-reviewed — do not commit without reviewing

**Output:** List of updated `__snapshots__/*.png` files.

**Example invocation:**
```
/update-baseline
```

**When to use:** After a deliberate design change has been approved and you need to accept the new visual baseline.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

**Purpose:** Parse the last test run results and generate a human-readable summary report.

**What it does:**
1. Reads `test-results/results.json`
2. Summarizes results by tag: @smoke, @navigation, @forms, @functional, @visual, @responsive
3. Lists all failed tests with error messages
4. Lists flaky tests with retry counts and suggestions
5. Optionally opens the HTML report

**Output:** Markdown-formatted test results summary.

**Example invocation:**
```
/generate-report
```

---

## Autonomous Agents

The following agents run as background workers for longer tasks. See [AGENTS.md](./AGENTS.md) for full documentation.

| Agent | File | Purpose |
|-------|------|---------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawl the live site and populate `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Generate site-specific Playwright test files |

---

## Adding New Skills

1. Create `.claude/commands/<skill-name>.md`
2. Write the skill as a markdown prompt that Claude Code will follow step-by-step
3. Register it in this file under **Available Skills**
4. Optionally reference it in `CLAUDE.md` under the Slash Commands table

**Skill file structure:**
```markdown
# /skill-name

Brief description of what this skill does.

## Steps

1. Step one
2. Step two
3. Step three

## Output

What the skill produces.
```

---

## Tips

- Skills load only when invoked — keep them focused and task-specific
- For rules that should always apply (coding standards, architecture), use `CLAUDE.md` or `.claude/rules/` instead
- Chain skills together: run `/analyze-site` first, then `/generate-full-suite`
- Use `/run-smoke` after any test change to quickly validate nothing is broken
