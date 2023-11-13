export interface User {
  user_id: number;
  google_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface PlaidItem {
  id: number;
  user_id: number;
  access_token: string;
  item_id: string;
  institution_id: string;
  status?: "active" | "inactive";
  created_at?: Date | null;
  updated_at?: Date | null;
  transactions_cursor?: Date | null;
}

export interface PlaidAccount {
  id: bigint;
  item_id: number;
  account_id: string;
  name: string;
  official_name?: string | null;
  current_balance?: number | null;
  available_balance?: number | null;
  iso_currency_code?: string | null;
  unofficial_currency_code?: string | null;
  type: string;
  subtype: string;
  created_at?: Date | null;
  updated_at?: Date | null;
}
