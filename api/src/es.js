import { Client } from '@elastic/elasticsearch';
import pool from './db.js';

const es = process.env.NODE_ENV === 'test'
  ? { indices: { create: async () => {}, close: async () => {}, put_settings: async () => {}, open: async () => {} }, search: async () => ({ hits: { hits: [] } }) }
  : new Client({ node: process.env.ELASTICSEARCH_HOST });

if (process.env.NODE_ENV !== 'test') {
const { rows } = await pool.query('SELECT term, synonyms FROM synonyms');
const synonyms = rows.map(r => `${r.term} => ${r.synonyms.join(',')}`);

await es.indices.create({
  index: 'products',
  settings: {
    analysis: {
      filter: {
        synonym_filter: {
          type: 'synonym',
          synonyms
        }
      },
      analyzer: {
        default: {
          tokenizer: 'standard',
          filter: ['lowercase', 'synonym_filter']
        }
      }
    }
  },
  mappings: {
    properties: {
      title: { type: 'text' },
      body_html: { type: 'text' },
      tags: { type: 'keyword' },
      price: { type: 'float' },
      updated_at: { type: 'date' }
    }
  }
}, { ignore: [400] });
}

export async function refreshSynonyms() {
  if (process.env.NODE_ENV === 'test') return;
  const { rows } = await pool.query('SELECT term, synonyms FROM synonyms');
  const synonyms = rows.map(r => `${r.term} => ${r.synonyms.join(',')}`);
  await es.indices.close({ index: 'products' });
  await es.indices.put_settings({
    index: 'products',
    settings: {
      analysis: {
        filter: { synonym_filter: { type: 'synonym', synonyms } }
      }
    }
  });
  await es.indices.open({ index: 'products' });
}

export default es;
