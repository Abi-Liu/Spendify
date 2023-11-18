export interface User {
  user_id: number;
  google_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlaidItem {
  id: number;
  user_id: number;
  plaid_access_token: string;
  plaid_item_id: string;
  plaid_institution_id: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  transactions_cursor?: string;
}

export interface PlaidAccount {
  id: bigint;
  item_id: number;
  plaid_account_id: string;
  name: string;
  mask: string;
  official_name?: string;
  current_balance?: number;
  available_balance?: number;
  iso_currency_code?: string;
  unofficial_currency_code?: string;
  type: string;
  subtype: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  plaid_account_id: string;
  item_id: number;
  plaid_item_id: string;
  plaid_transaction_id: string;
  personal_finance_category?: string;
  payment_channel: string;
  name: string;
  amount: number;
  iso_currency_code?: string;
  unofficial_currency_code?: string;
  date: string;
  pending: boolean;
  account_owner?: string;
  created_at: Date;
  updated_at: Date;
}
