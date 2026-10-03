CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO tasks (title, done) VALUES
  ('Wire the frontend to the API', true),
  ('Persist tasks in Postgres', false),
  ('Ship something small today', false);
