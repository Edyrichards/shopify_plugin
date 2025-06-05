import { Client } from '@elastic/elasticsearch';

const es = new Client({ node: process.env.ELASTICSEARCH_HOST });

await es.indices.create({
  index: 'products',
  settings: {
    analysis: {
      analyzer: {
        default: {
          type: 'standard'
        }
      }
    }
  },
  mappings: {
    properties: {
      title: { type: 'text' },
      body_html: { type: 'text' },
      tags: { type: 'keyword' },
      updated_at: { type: 'date' }
    }
  }
}, { ignore: [400] });

export default es;
