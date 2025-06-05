# Phase 3: Shopify Integration

This phase connects the application with Shopify. It covers OAuth, webhook setup,
and a scaffolded theme app extension.

## Step-by-Step Guide

1. **Register the App**
   - In the [Shopify Partners dashboard](https://partners.shopify.com/), create a
     custom app and obtain the API key and secret.
   - Set the app URL to your hosted API (e.g., `https://example.com`), and the
     redirect URL to `/auth/callback`.

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env` and fill in your `SHOPIFY_API_KEY`,
     `SHOPIFY_API_SECRET`, `SHOPIFY_SCOPES`, and `SHOPIFY_APP_URL`.

3. **Install Dependencies**
   ```bash
   npm install --workspaces
   ```

4. **Run the API Locally**
   ```bash
   docker compose up --build api
   ```
   The API exposes `/auth` for installation and `/webhooks` for webhook events.

5. **Create Webhooks**
   - After OAuth completes, use the Shopify API to register product and
     collection webhooks. The example code uses the library's
     `shopify.webhooks.register` helper.

6. **Theme App Extension**
   - The folder `theme_extension` contains a starter snippet. Use the Shopify CLI
     to push the extension:
     ```bash
     cd theme_extension
     shopify extension push
     ```

## Best Practices
- Always verify webhook signatures using the library helpers.
- Store access tokens securely in PostgreSQL using encryption at rest.
- Use separate API keys for development and production.

---
With Phase 3 completed, the application can authenticate Shopify stores, handle
webhooks, and includes a basic theme app extension skeleton.
