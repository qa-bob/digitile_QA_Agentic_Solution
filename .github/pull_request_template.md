## Summary

<!-- What does this PR do? Bullet-point summary. -->

-
-

## Type of Change

- [ ] New test coverage (new page object + spec file)
- [ ] Fix broken test or selector
- [ ] Refactor / architecture improvement
- [ ] Config / tooling / dependency update
- [ ] Documentation update

## Pages / Features Covered

<!-- Which pages or features does this PR add or fix tests for? -->

-

## Pre-Submit Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] All new `test()` calls are tagged with at least one of: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- [ ] New page objects extend `BasePage` and have no `expect()` calls
- [ ] No hardcoded URLs — uses `siteConfig.url` or Playwright `baseURL`
- [ ] No form submissions — tests only interact with fields, not submit
- [ ] Visual baselines updated if UI screenshots changed: `npm run baseline`
- [ ] Tests import from `@fixtures/site.fixture`, not `@playwright/test`

## Test Results

<!-- Paste the output of `npm run test:smoke` or relevant test run here. -->

```
Paste results here
```

## Screenshots (if visual changes)

<!-- Attach before/after screenshots for visual regression changes. -->
