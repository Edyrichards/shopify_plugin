# Shopify Advanced Search

codex/build-production-ready-shopify-advanced-search-app
This repository contains planning documents and code for a production-ready Shopify Advanced Search application. The project is organized in phases. Begin by reviewing the [Phase 1 plan](docs/phase1_plan.md), [Phase 2 plan](docs/phase2_plan.md) and [Phase 3 plan](docs/phase3_plan.md).

This repository contains planning documents and code for a production-ready Shopify Advanced Search application. The project is organized in phases. Begin by reviewing the [Phase 1 plan](docs/phase1_plan.md) and the [Phase 2 plan](docs/phase2_plan.md).
main

Phase 2 introduces infrastructure code (Terraform, Helm), a CI/CD workflow, and a Docker Compose environment for local development. Future phases will add Shopify integration, backend services, and the admin UI.

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
codex/build-production-ready-shopify-advanced-search-app
   npm install --workspaces

main
   cp .env.example .env
   docker compose up --build
   ```
   This starts the API, admin UI, PostgreSQL, Redis, and Elasticsearch services on localhost.

codex/build-production-ready-shopify-advanced-search-app
4. **Push the theme app extension**
   ```bash
   cd theme_extension
   shopify extension push
   ```

main
