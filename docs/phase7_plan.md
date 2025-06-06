# Phase 7: Frontend Theme Extension

This phase implements the customer-facing search experience using a Shopify Theme App Extension. The extension provides a search bar with autocomplete suggestions and a full results page with faceted filtering.

## Step-by-Step Guide

1. **Scaffold the Theme Extension**
   - Use Shopify CLI to generate a theme app extension inside the `theme_extension` directory.
   - Commit the generated `blocks`, `assets` and `sections` folders.

2. **Search Bar Block**
   - `blocks/search-bar.liquid` renders a search input that loads `advanced-search.js`.
   - The script listens for user input and fetches `/search` results from the app API.
   - Autocomplete suggestions display product titles in a dropdown.

3. **Results Page Section**
   - `sections/search-results.liquid` displays a list of products returned from the API.
   - Includes filters for collections, tags and price range using query parameters.
   - Results are rendered with semantic markup for SEO and accessible headings.

4. **Assets**
   - `assets/advanced-search.js` performs fetch requests to the API and updates the DOM with suggestions or results.
   - `assets/styles.css` contains minimal styling and responsive layout rules.

5. **Accessibility & SEO**
   - Use ARIA roles and labels for form fields and buttons.
   - Ensure the search input is keyboard accessible and results use `<h2>` headings and proper list markup.

6. **Mobile Support**
   - Styles use flexible widths and the search results section stacks facets above the product grid on small screens.

7. **Installation**
   - From the `theme_extension` folder run `shopify extension push` to upload the extension.
   - Add the Search Bar block to your theme and create a page that uses the Search Results section.

With this extension customers can search products with real‑time suggestions and filterable results, all powered by the app's API.
