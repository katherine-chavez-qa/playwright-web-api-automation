# Playwright Web & API Automation

![Playwright Tests](https://github.com/katherine-chavez-qa/playwright-web-api-automation/actions/workflows/playwright.yml/badge.svg)

Test automation framework for web UI and REST API testing, built with **Playwright** and **TypeScript**, following the **Page Object Model** and running on every push through **GitHub Actions**.

## What it covers

| Layer | Target | Tests |
|---|---|---|
| Web UI | [Sauce Demo](https://www.saucedemo.com) (public practice store) | Login: valid user, locked-out user, invalid credentials, required fields |
| API | [Restful Booker](https://restful-booker.herokuapp.com) (public practice API) | Health check, create + retrieve booking, not-found handling |

Web tests run on **Chromium and Firefox**.

## Tech stack

Playwright · TypeScript · Node.js · Page Object Model · GitHub Actions · Playwright HTML Reporter

## Project structure

```
├── .github/workflows/playwright.yml   # CI pipeline: type check + tests + report artifact
├── src/
│   ├── data/users.ts                  # Test data (public demo credentials)
│   └── pages/                         # Page Objects
│       ├── LoginPage.ts
│       └── InventoryPage.ts
├── tests/
│   ├── web/login.spec.ts              # UI tests
│   └── api/booking.spec.ts            # API tests
└── playwright.config.ts               # Projects: web-chromium, web-firefox, api
```

## Run locally

Requirements: Node.js 20+

```bash
npm ci
npx playwright install chromium firefox
npm test            # all tests
npm run test:web    # UI tests only
npm run test:api    # API tests only
npm run test:ui     # Playwright UI mode
npm run report      # open the last HTML report
```

## CI/CD

Every push and pull request to `main` triggers the pipeline, which installs dependencies, runs a TypeScript type check, executes all tests, and publishes the HTML report as a downloadable artifact. Failed tests keep traces, screenshots and videos for debugging.

## Design decisions

- **Page Object Model** keeps locators and actions out of the tests, so a UI change is fixed in one place.
- **User-facing locators** (`getByRole`, `getByPlaceholder`) and `data-test` attributes instead of brittle CSS paths.
- **Separate Playwright projects** for web and API, so each layer can run on its own.
- **Retries only in CI** with trace on first retry, to diagnose flaky tests instead of hiding them.

## Roadmap

- [ ] Shopping cart and checkout flow tests
- [ ] Authenticated API tests (update and delete booking)
- [ ] Fixtures for shared setup
- [ ] Publish the HTML report to GitHub Pages

## Author

**Katherine Chavez Olaya** — QA Lead · QA Automation Engineer
[LinkedIn](https://www.linkedin.com/in/katherine-chavez-olaya)
