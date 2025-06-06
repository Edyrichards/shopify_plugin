# Phase 8: Testing & Quality Assurance

This phase introduces automated testing and validation to ensure the Shopify Advanced Search app is stable before deployment.

## Step-by-Step Guide

1. **Set Up Test Frameworks**
   - Install Jest and testing utilities as development dependencies.
   - Each workspace has a Jest configuration file.
   - API tests run in a Node environment while admin tests use JSDOM.

2. **Write Unit and Integration Tests**
   - Sample API test checks the `/healthz` route using `supertest`.
   - React components are tested with `@testing-library/react`.
   - Place additional tests under `api/test/` and `admin/client/**/__tests__/`.

3. **Coverage Reporting**
   - Run `npm run test:coverage --workspaces` to generate coverage reports.
   - Aim for 90% coverage on critical modules.

4. **Load Testing**
   - Use `k6` to simulate search traffic. The script in `tests/load/search.js` sends concurrent requests to the `/search` endpoint.
   - Execute `k6 run tests/load/search.js` against a staging environment.

5. **Continuous Integration**
   - GitHub Actions installs dependencies and runs the test suite on every push.
   - Coverage artifacts can be uploaded for review.

6. **Manual QA Checklist**
   - Verify the theme extension works in major browsers and popular Shopify themes.
   - Confirm accessibility features such as ARIA labels and keyboard navigation.

With Phase 8 complete the project has automated tests, coverage reporting and a basic load test to validate performance.
