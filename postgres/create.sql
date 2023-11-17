
-- This table is used to store the users of our application.
CREATE TABLE users_table
(
  id SERIAL PRIMARY KEY,
  google_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- This table is used to store the items associated with each user.
CREATE TABLE items_table
(
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users_table(id) ON DELETE CASCADE,
  plaid_access_token text UNIQUE NOT NULL,
  plaid_item_id text UNIQUE NOT NULL,
  plaid_institution_id text NOT NULL,
  status text NOT NULL,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  transactions_cursor text
);


-- This table is used to store the accounts associated with each item. 
CREATE TABLE accounts_table
(
  id SERIAL PRIMARY KEY,
  item_id integer REFERENCES items_table(id) ON DELETE CASCADE,
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


-- This table is used to store the transactions associated with each account.
CREATE TABLE transactions_table
(
  id SERIAL PRIMARY KEY,
  account_id integer REFERENCES accounts_table(id) ON DELETE CASCADE,
  plaid_account_id text NOT NULL,
  item_id integer REFERENCES items_table(id) ON DELETE CASCADE,
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