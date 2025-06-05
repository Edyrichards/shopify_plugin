# Phase 4: Core Backend Services

This phase implements the services that keep Shopify product data indexed in Elasticsearch and exposes a search API with caching. It introduces PostgreSQL schemas, webhook processing, a background indexing worker, and Redis caching.

## Step-by-Step Guide

1. **Database Schema**
   - A PostgreSQL pool is initialized from `DATABASE_URL`.
   - At startup the following tables are created if they do not exist:
     - `installations` – stores OAuth tokens per shop.
     - `synonyms` – term to synonym list mapping.
     - `analytics` – search query statistics.

2. **Elasticsearch Setup**
   - Connect using `ELASTICSEARCH_HOST`.
   - On boot ensure a `products` index exists with basic mappings (title, body, tags, variants).

3. **Redis Cache**
   - Connect using `REDIS_URL` for caching search responses.

4. **Indexing Queue**
   - A BullMQ queue backed by Redis stores indexing jobs.
   - A worker fetches product data from Shopify and indexes or removes documents in Elasticsearch.

5. **Webhook Handling**
   - After OAuth installation, product create/update/delete webhooks are registered.
   - Incoming webhooks are verified and enqueue jobs on the indexing queue.

6. **Search API**
   - `/search` accepts a `q` parameter.
   - Results are cached in Redis for 5 minutes.
   - Queries Elasticsearch using a simple multi-field match.

7. **Running the Indexer**
   - The API server starts the BullMQ worker automatically.
   - Worker logs are printed on failures.

---
With Phase 4 complete, the backend stores Shopify credentials, keeps Elasticsearch in sync via webhooks, and provides a cached search endpoint.
