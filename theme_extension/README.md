# Theme App Extension

This directory contains the storefront pieces of the advanced search app.

- `blocks/search-bar.liquid` renders a search input with autocomplete.
- `sections/search-results.liquid` outputs a results list with filtering form.
- `assets/advanced-search.js` fetches suggestions and results from the app API.
- `assets/styles.css` provides basic styling and mobile layout.

Deploy the extension using Shopify CLI:

```bash
cd theme_extension
shopify extension push
```

After deploying, add the **Search Bar** block to your theme and create a page that includes the **Search Results** section.
