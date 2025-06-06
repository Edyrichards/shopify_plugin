# Phase 6: Admin Interface (React/Polaris)

This phase introduces the merchant facing UI built with React and Shopify Polaris. The app communicates with the existing API for synonyms, field weighting and analytics.

## Step-by-Step Guide

1. **Bootstrap with Vite**
   - Create the React project under `admin/client` using Vite.
   - Install React, Polaris, App Bridge, React Router and the i18n helpers.
   - `vite.config.js` outputs the production build to `admin/dist`.

2. **App Bridge Setup**
   - `App.jsx` wraps the app with `AppBridgeProvider` using the `SHOPIFY_API_KEY` and `host` query parameter.
   - Merchants are redirected to re-authenticate if the session expires.

3. **Layout and Navigation**
   - Use Polaris `Frame` and `Navigation` components for the sidebar.
   - Pages include Dashboard, Synonyms, Field Weights and Analytics using `react-router-dom`.

4. **Synonym Manager**
   - Displays synonyms from `GET /synonyms` and allows adding or deleting via the API.
   - Uses Polaris `ResourceList`, `TextField` and `Button` components.

5. **Field Weight Editor**
   - Shows current weights from `GET /weights`.
   - Form posts updates with `POST /weights`.

6. **Analytics Dashboard**
   - Fetches analytics data from the API (placeholder route) and displays basic tables.

7. **Internationalization**
   - Localized strings live in `admin/client/locales/en.json`.
   - `@shopify/react-i18n` provides the `I18nContext` wrapper.

8. **Development and Build**
   - `npm run dev --workspace=admin` starts Vite on `localhost:5173`.
   - `npm run build --workspace=admin` compiles assets into `admin/dist`.
   - `npm start --workspace=admin` serves the built files via Express with a proxy to the API.

9. **Dockerfile**
   - The container builds the React app first and then installs production dependencies to run `src/server.js`.

With this phase complete, merchants can manage search configuration through a Polaris powered dashboard.
