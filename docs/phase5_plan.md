# Phase 5: Search Engine Logic

This phase enhances the search API with advanced query features. It adds filtering,
synonym management, typo tolerance and field weighting.

## Step-by-Step Guide

1. **Elasticsearch Mappings and Analyzers**
   - A custom analyzer applies lowercase and synonym filters.
   - The `products` index stores price, tags, and other fields for filtering.

2. **Synonym Management**
   - Synonyms are stored in PostgreSQL (`synonyms` table).
   - Routes under `/synonyms` allow listing, creating and deleting entries.
   - After updates the Elasticsearch index refreshes its synonym filter.

3. **Field Weighting**
   - The `field_weights` table holds boost values for searchable fields.
   - Admins can update weights via `/weights` routes.

4. **Search Endpoint**
   - Accepts parameters:
     - `q` – search text.
     - `tags` – comma separated tag filter.
     - `min_price` / `max_price` – numeric price range.
   - Expands query terms with synonyms and applies fuzzy matching.
   - Uses weights from the database to boost relevant fields.

5. **Synonym Import/Export**
   - Future admin UI allows CSV upload and download to manage large synonym lists.

6. **Caching**
   - Search results are cached in Redis for five minutes to minimize load on Elasticsearch.

7. **Fuzziness and Boosting**
   - Queries use `fuzziness: 'AUTO'` for typo tolerance.
   - Field weights are applied via Elasticsearch `^` notation.

With these pieces in place, the search API supports faceted filtering, synonym
expansion and boosted scoring.
