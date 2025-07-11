import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

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
`);

export default pool;
