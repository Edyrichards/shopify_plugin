# Phase 9: Deployment & Monitoring

This phase covers releasing the application to a production Kubernetes cluster and adding observability.

## Step-by-Step Guide

1. **Build and Push Images**
   - GitHub Actions builds the `search-api` and `search-admin` Docker images.
   - Images are pushed to GitHub Container Registry tagged with the commit SHA.

2. **Helm Releases**
   - Deploy the API and admin services with the charts in `helm/api` and `helm/admin`.
   - `helm upgrade --install search-api ./helm/api --set image.tag=$SHA`
   - `helm upgrade --install search-admin ./helm/admin --set image.tag=$SHA`
   - The monitoring stack is installed via `helm/monitoring` which pulls the community `kube-prometheus-stack` chart for Prometheus and Grafana.

3. **Metrics Endpoint**
   - The API exposes a `/metrics` route using `prom-client`.
   - Prometheus scrapes this endpoint to collect default Node.js metrics and a custom histogram for `/search` latency.

4. **Logging and Alerts**
   - Kubernetes pods output JSON logs which can be shipped to Elasticsearch or CloudWatch using a fluentbit DaemonSet.
   - Alerting rules are configured in Prometheus for high error rates or slow search responses.

5. **Backups and Rollback**
   - RDS automated backups and Elastic snapshots are enabled via Terraform.
   - Helm releases use versioned images so previous revisions can be rolled back with `helm rollback` if needed.

---

With Phase 9 complete the project can be deployed on AWS EKS with full monitoring and a strategy for backups and rollbacks.
