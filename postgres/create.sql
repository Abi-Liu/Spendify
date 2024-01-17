-- This trigger updates the value in the updated_at column. It is used in the tables below to log
-- when a row was last updated.

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- This table is used to store the users of our application.
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  google_id text UNIQUE NOT NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  avatar_url text NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER trigger_update_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();



-- This table is used to store the items associated with each user.
CREATE TABLE items
(
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  plaid_access_token text UNIQUE NOT NULL,
  plaid_item_id text UNIQUE NOT NULL,
  plaid_institution_id text NOT NULL,
  status text NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  transactions_cursor text
);

CREATE TRIGGER trigger_update_updated_at_items
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- This table is used to store the accounts associated with each item. 
CREATE TABLE accounts
(
  id SERIAL PRIMARY KEY,
  item_id integer REFERENCES items(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  plaid_account_id text UNIQUE NOT NULL,
  name text NOT NULL,
  mask text NOT NULL,
  official_name text,
  current_balance numeric(28,10),
  available_balance numeric(28,10),
  iso_currency_code text,
  unofficial_currency_code text,
  type text NOT NULL,
  subtype text NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER trigger_update_updated_at_accounts
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- This table is used to store the transactions associated with each account.
CREATE TABLE transactions
(
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  account_id integer REFERENCES accounts(id) ON DELETE CASCADE,
  plaid_account_id text NOT NULL,
  item_id integer REFERENCES items(id) ON DELETE CASCADE,
  plaid_item_id text NOT NULL,
  plaid_transaction_id text UNIQUE NOT NULL,
  personal_finance_category text,
  payment_channel text NOT NULL,
  name text NOT NULL,
  amount numeric(28,10) NOT NULL,
  iso_currency_code text,
  unofficial_currency_code text,
  date date NOT NULL,
  pending boolean NOT NULL,
  account_owner text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER trigger_update_updated_at_transactions
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id integer UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  budget_amount NUMERIC(28, 2) NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER trigger_update_updated_at_budgets
BEFORE UPDATE ON budgets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id) ON DELETE CASCADE,
  value NUMERIC(28, 2) NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TRIGGER trigger_update_updated_at_assets
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();