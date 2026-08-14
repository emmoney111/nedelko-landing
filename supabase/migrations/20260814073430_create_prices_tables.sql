/*
# Create prices and price_sub_items tables

1. New Tables
- `prices` — top-level price list items (metals)
  - id (uuid, PK)
  - name (text, not null) — e.g. "МЕДЬ"
  - price (text, not null) — price string, e.g. "825"
  - unit (text, not null default '₽/кг')
  - sort_order (int, default 0) — display ordering
  - updated_at (timestamptz, auto-updated)
- `price_sub_items` — child rows belonging to a price item
  - id (uuid, PK)
  - price_id (uuid, FK → prices.id ON DELETE CASCADE)
  - name (text, not null) — e.g. "Медь кусок"
  - price (text, not null)
  - sort_order (int, default 0)
  - updated_at (timestamptz, auto-updated)

2. Security
- RLS enabled on both tables.
- This app uses hardcoded admin auth (not Supabase auth), so the frontend
  always runs as the anon role. Policies use `TO anon, authenticated` so
  the anon-key client can read and write. Data is intentionally shared/public.

3. Notes
- `price_sub_items.price_id` has ON DELETE CASCADE so deleting a price item
  automatically removes its sub-items.
- `updated_at` auto-updates via a trigger on both tables.
*/

CREATE TABLE IF NOT EXISTS prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  unit text NOT NULL DEFAULT '₽/кг',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_sub_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_id uuid NOT NULL REFERENCES prices(id) ON DELETE CASCADE,
  name text NOT NULL,
  price text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_sub_items ENABLE ROW LEVEL SECURITY;

-- prices policies
DROP POLICY IF EXISTS "anon_select_prices" ON prices;
CREATE POLICY "anon_select_prices" ON prices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prices" ON prices;
CREATE POLICY "anon_insert_prices" ON prices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prices" ON prices;
CREATE POLICY "anon_update_prices" ON prices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prices" ON prices;
CREATE POLICY "anon_delete_prices" ON prices FOR DELETE
  TO anon, authenticated USING (true);

-- price_sub_items policies
DROP POLICY IF EXISTS "anon_select_sub_items" ON price_sub_items;
CREATE POLICY "anon_select_sub_items" ON price_sub_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sub_items" ON price_sub_items;
CREATE POLICY "anon_insert_sub_items" ON price_sub_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sub_items" ON price_sub_items;
CREATE POLICY "anon_update_sub_items" ON price_sub_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sub_items" ON price_sub_items;
CREATE POLICY "anon_delete_sub_items" ON price_sub_items FOR DELETE
  TO anon, authenticated USING (true);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prices_updated_at ON prices;
CREATE TRIGGER prices_updated_at BEFORE UPDATE ON prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS sub_items_updated_at ON price_sub_items;
CREATE TRIGGER sub_items_updated_at BEFORE UPDATE ON price_sub_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- indexes
CREATE INDEX IF NOT EXISTS idx_price_sub_items_price_id ON price_sub_items(price_id);
CREATE INDEX IF NOT EXISTS idx_prices_sort_order ON prices(sort_order);
