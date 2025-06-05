# Phase 2: Infrastructure & Development Environment

This phase sets up the baseline infrastructure code and local development tooling.
It includes Terraform modules for AWS resources, Helm charts for Kubernetes
deployments, a GitHub Actions pipeline, and a Docker Compose stack for local
work.

### Step-by-Step Setup
1. **Initialize Terraform**
   ```bash
   cd infrastructure/terraform
   terraform init
   terraform apply -var aws_region=us-east-1 -var environment=staging
   ```
2. **Build and push Docker images** (CI does this automatically)
   ```bash
   docker build -t ghcr.io/example/search-api ./api
   docker push ghcr.io/example/search-api
   ```
3. **Deploy with Helm**
   ```bash
   helm upgrade --install search-api ./helm/api \
     --set image.repository=ghcr.io/example/search-api \
     --set image.tag=latest
   ```
4. **Run the local stack**
   ```bash
   cp .env.example .env
   docker compose up --build
   ```

## 1. Terraform Infrastructure

```
./infrastructure/terraform
├── versions.tf       # provider versions
├── main.tf           # root module calling submodules
├── variables.tf      # configurable variables
├── outputs.tf        # exported values
```

The Terraform configuration uses community modules:

- `terraform-aws-modules/vpc/aws` to create the VPC and networking
- `terraform-aws-modules/eks/aws` for the Kubernetes cluster
- `terraform-aws-modules/rds/aws` for PostgreSQL
- `terraform-aws-modules/elasticache/aws` for Redis

An Elastic Cloud deployment is provisioned via the `elastic/ec` provider.

Example provider block:

```hcl
terraform {
  required_version = ">= 1.3"
  required_providers {
    aws    = { source = "hashicorp/aws", version = "~> 5.0" }
    elastic = { source = "elastic/ec", version = "~> 0.7" }
  }
}

provider "aws" {
  region = var.aws_region
}
```

The modules create networking, an EKS cluster with node groups, RDS instance,
Redis cluster, and an Elastic Cloud deployment. Output values include kubeconfig
and connection strings for CI/CD use.

## 2. Helm Charts

Charts live under `./helm`. Each component has its own chart. For example,
`helm/api` deploys the Node.js backend. Charts include standard Kubernetes
manifests, a `values.yaml` for configuration, and use secrets from AWS Secrets
Manager.

Directory structure:

```
helm
└── api
    ├── Chart.yaml
    ├── values.yaml
    └── templates
        ├── deployment.yaml
        └── service.yaml
```

A top-level `Makefile` or script can package and deploy the charts with `helm
upgrade --install` using values from Terraform outputs.

## 3. GitHub Actions CI/CD

The workflow defined at `.github/workflows/ci.yml` performs linting, testing,
Docker image builds, and Helm deployments. Pull requests trigger unit tests and
builds. Merges to `main` deploy to a staging namespace; tags trigger production
deployments.

Key steps:

1. Checkout repository
2. Setup Node.js and install dependencies
3. Run ESLint and Jest
4. Build Docker images for `api` and `admin`
5. Push images to GitHub Container Registry (GHCR)
6. Deploy using Helm with kubeconfig from Terraform outputs

Secrets such as the kubeconfig and registry credentials are stored in GitHub
Actions secrets.

## 4. Local Development with Docker Compose

`docker-compose.yml` provisions the entire stack locally:

- Node.js API server with live reload
- React admin server
- PostgreSQL database
- Redis
- Elasticsearch 8

Developers run `docker compose up` to start all services. Environment variables
live in `.env.example`. The compose stack mirrors production ports and exposes
Elasticsearch on `localhost:9200`.

## 5. Best Practices

- Keep Terraform state in a remote backend such as S3 with state locking.
- Use separate AWS accounts or namespaces for staging and production.
- Store sensitive values (DB passwords, API keys) in Secrets Manager and inject
  them into Kubernetes via the External Secrets operator.
- Enable automated backups for RDS and Elastic Cloud snapshots.
- Use image tags derived from Git commit SHAs for reproducible deployments.

---

With Phase 2 complete, the repository contains baseline infrastructure code and
a working development environment. You can now bootstrap the Shopify app and
begin integration work.
