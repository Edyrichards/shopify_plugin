# Shopify Advanced Search

This repository contains planning documents and code for a production-ready Shopify Advanced Search application. The project is organized in phases. Begin by reviewing the [Phase 1 plan](docs/phase1_plan.md), [Phase 2 plan](docs/phase2_plan.md), [Phase 3 plan](docs/phase3_plan.md), [Phase 4 plan](docs/phase4_plan.md), [Phase 5 plan](docs/phase5_plan.md).

Phase 2 introduces infrastructure code (Terraform, Helm) and a Docker Compose stack for local development. Later phases add Shopify integration, core backend services, and the admin UI.

## Getting Started

1. **Provision AWS resources**
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform apply -var aws_region=us-east-1 -var environment=staging
   ```
   The outputs include a kubeconfig file and service endpoints used by the CI/CD pipeline.

2. **Install Kubernetes charts**
   ```bash
   helm upgrade --install search-api ./helm/api \
     --set image.repository=ghcr.io/example/search-api \
     --set image.tag=latest
   ```
   Adjust the image values if using your own registry.

3. **Run the local dev stack**
   ```bash
   npm install --workspaces
   cp .env.example .env
   docker compose up --build
   ```
   This starts the API, admin UI, PostgreSQL, Redis, and Elasticsearch services on localhost.

4. **Push the theme app extension**
   ```bash
   cd theme_extension
   shopify extension push
   ```
5. **Run the test suite**
   ```bash
   npm test --workspaces
   ```
## Resolving Merge Conflicts

If you see conflicts when merging changes or updating pull requests, use the following process:

1. Checkout the branch with conflicts and pull the latest changes from `main`.
2. Run `git status` to see files with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Edit each file to keep the correct code and remove the markers.
4. Add the resolved files with `git add` and commit the merge.
5. Push the updated branch and verify the pull request shows no remaining conflicts.

Running `npm install --workspaces` and `npm test --workspaces` after resolving conflicts ensures the project still builds correctly.
