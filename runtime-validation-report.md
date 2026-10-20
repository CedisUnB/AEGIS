# Runtime Validation Report

**Generated:** 2026-10-19T22:35:59-03:00

**Target:** `/home/phmelosilva/dev/tcc2/SecurityAPP`
**Validation scope:** Playwright E2E for Feature 2 — Trail Navigation Engine

## Summary

| Step | Status | Exit Code | Details |
|---|---|---:|---|
| Application readiness | PASS | 0 | Existing Next.js server at `http://localhost:3000` returned HTTP 200. |
| New trail E2E specs | PASS | 0 | 13 tests across 4 spec files passed with 4 workers. |
| Full E2E suite — run 1 | PASS | 0 | 24 tests passed with 1 worker. |
| Full E2E suite — run 2 | PASS | 0 | 24 tests passed with 1 worker. |
| ESLint | PASS | 0 | New Playwright helper and specs linted successfully. |
| TypeScript check | FAIL | 2 | Existing type error in `src/features/trails-engine/components/TrailMap/NodeStatusIcon.test.tsx`: its `TrailMapNodeDTO` fixture lacks `isNextUp` and `isUnlocked`. No diagnostics were reported in the new E2E files. |

**Overall:** PASS for the requested E2E scope; type-check remains blocked by the unrelated existing unit-test fixture error.

## Environment and capability evidence

- **Node.js:** AVAILABLE — `v24.19.0`.
- **Playwright:** AVAILABLE — `1.63.0`.
- **Chromium:** AVAILABLE — Playwright E2E runs completed successfully. `npx playwright install --with-deps chromium` could not install OS dependencies because `sudo` requires a terminal/password; the installed browser and current system dependencies were sufficient to run the suite.
- **Docker:** CLI available, daemon UNAVAILABLE — `docker info` returned exit code 1: `permission denied while trying to connect to the Docker API at unix:///var/run/docker.sock`.
- **Database:** Real Prisma/MySQL-backed fixture creation, reads, and prefix cleanup succeeded during the E2E runs; no Prisma mocks were used.
- **Startup:** A second `npm run dev` could not acquire the Next.js dev lock after port 3000 was found occupied. The existing server responded with HTTP 200 and was reused; no existing process was stopped.

## E2E coverage matrix

| Spec | Journey and acceptance criteria |
|---|---|
| `trail-catalog.spec.ts` | US06/US09: open a trail card, inspect description, navigate to its map; show progress only for started trails; label a fully completed trail as completed, including its final test. |
| `trail-map.spec.ts` | US07/US08: show ordered nodes and progress labels; offer “Começar”/“Revisar” and navigate to the node route; restore focus to a requested node on a long map. |
| `final-test.spec.ts` | US09: keep the final test disabled and closed until content is complete, then enable it and open the native dialog. |
| `trail-security-layout.spec.ts` | A01 and mobile regressions: redirect unauthenticated users; show 404s without stack traces; isolate progress between users; keep the header visible and clear of every node while scrolling; center the node dialog; preserve horizontal node alignment. |

## Execution evidence

- New specs: `npm run test:e2e -- tests/e2e/trails-engine` — 13 passed, exit code 0.
- Final full-suite verification, twice consecutively:

  ```bash
  npm run test:e2e -- --workers=1 && npm run test:e2e -- --workers=1
  ```

  Both runs completed with 24 passed, 0 failed, exit code 0.
- One earlier default-parallel full-suite attempt passed once, then had three timeouts in pre-existing registration tests. Re-running the full suite sequentially passed twice. The newly added trail specs also passed in their initial four-worker run; no legacy tests were changed.
- `npx eslint tests/helpers/auth.ts tests/e2e/trails-engine/*.spec.ts` — exit code 0.

## Legacy E2E inventory

| Source | Decision | Details |
|---|---|---|
| Existing `tests/e2e/home.spec.ts` and `tests/e2e/profile.spec.ts` | Reused unchanged | Existing auth/profile journeys remain in the canonical `npm run test:e2e` suite. |

The existing tests did not provide a shared fixture-user login helper, so `tests/helpers/auth.ts` adds a UI login helper for the new fixture-created student accounts. No existing spec was rewritten.

## Gaps and issues

| # | Severity | Description | Status |
|---|---|---|---|
| 1 | LOW | Docker daemon access is denied in this shell. An already-running application and reachable real database supported the E2E run. | Environment limitation recorded. |
| 2 | LOW | Installing Chromium system dependencies via `--with-deps` was blocked by non-interactive `sudo`; installed Chromium worked for all browser tests. | No browser-tier fallback used. |
| 3 | LOW | One default-parallel full run had timeouts in three pre-existing registration journeys; two full serial runs passed. | No legacy test changes; serial verification recorded. |
| 4 | LOW | Project type-check remains blocked by a pre-existing missing-property fixture in `NodeStatusIcon.test.tsx`. | Outside E2E scope; no production code changed. |

No dependency was added, and the E2E tests do not exercise the not-yet-implemented content screens or `completeTrailIfPassed`.
