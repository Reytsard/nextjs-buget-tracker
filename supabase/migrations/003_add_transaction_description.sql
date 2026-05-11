ALTER TABLE transactions ADD COLUMN IF NOT EXISTS description text;

CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC);
