import pg from 'pg';

const pool = process.env.NODE_ENV === 'test'
  ? new pg.Pool({ connectionString: 'postgres://test@test/test', idleTimeoutMillis: 10 })
  : new pg.Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'test') {
await pool.query(`
  CREATE TABLE IF NOT EXISTS installations (
    id serial PRIMARY KEY,
    shop text UNIQUE NOT NULL,
    access_token text NOT NULL,
    scopes text NOT NULL,
    installed_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS synonyms (
    id serial PRIMARY KEY,
    term text NOT NULL,
    synonyms text[] NOT NULL
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id serial PRIMARY KEY,
    shop text NOT NULL,
    query text NOT NULL,
    hits integer,
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS field_weights (
    field text PRIMARY KEY,
    weight integer NOT NULL
  );

  INSERT INTO field_weights(field, weight) VALUES
    ('title', 3),
    ('body_html', 1),
    ('tags', 2)
  ON CONFLICT (field) DO NOTHING;
`);
}

export default pool;
