# Phase 10: Launch & App Store Submission

This final phase prepares the app for publication on the Shopify App Store and ensures a smooth launch.

## Step-by-Step Guide

1. **Finalize App Listing**
   - Gather marketing copy, pricing details, screenshots and videos.
   - Provide clear privacy policy and terms of service links.
   - Fill out the listing fields in the Partner Dashboard including support contact information.

2. **User Acceptance Testing**
   - Run the full regression test suite against a staging store.
   - Verify OAuth flows, theme extension blocks and admin pages work in multiple browsers.
   - Perform security scanning and confirm GDPR data export/deletion procedures.

3. **Submit for Review**
   - From the Partner Dashboard, create a new app version and submit it for Shopify review.
   - Respond to any feedback or required changes from the review team promptly.
   - Use Shopify CLI to create release bundles if the extension or app code changes.

4. **Post-Launch Monitoring**
   - Monitor application logs, Prometheus metrics and Shopify API limits during the first weeks.
   - Enable alerts for elevated error rates or slow search responses.
   - Schedule regular backups of PostgreSQL, Redis and Elasticsearch.

With Phase 10 complete, the app is ready for merchants on the Shopify App Store and has monitoring in place for a successful launch.
