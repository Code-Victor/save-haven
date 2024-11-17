interface BaseResponse {
  message: string;
}

export interface OnboardUserResponse extends BaseResponse {
  data: {
    email: string;
    otp: string;
  };
}

export interface VerifyOTPResponse extends BaseResponse {}
export interface UserSignUpResponse extends BaseResponse {}
export interface UserLoginResponse extends BaseResponse {
  data: User & {
    access_token: string;
    refresh_token: string;
  };
}
export interface User {
  _id: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  telephone_no: string;
}

export interface WalletDetailsResponse {
  user: string;
  wallet_balance: number;
  currency: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
}
export interface GetTransactionsResponse {
  items: Transaction[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  transaction_type: "CREDIT" | "DEBIT";
  transaction_reference: string;
  transaction_date: string;
  transaction_status: string;
  channel: string;
  virtual_account_number: string;
  transaction_fee: number;
  recipient: Recipient;
  createdAt: string;
}

export interface Recipient {
  account_number: string;
  account_name: string;
  bank_name: string;
}

export interface CreateTargetSavingsResponse extends BaseResponse {}

export interface GetAllTargetSavingsResponse {
  items: TargetSaving[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TargetSaving {
  id: string;
  user: string;
  savings_reference_id: string;
  savings_name: string;
  target_amount: number;
  amount_saved: number;
  amount_per_frequency: number;
  start_date: Date;
  end_date: Date;
  savings_frequency: string;
  countdown_to_end_date: number;
  days_of_week: string;
  status: string;
  is_locked: boolean;
  createdAt: Date;
}
export type GetTargetSavingsByIdResponse = TargetSaving;

export type GetTargetSavingTransactionsResponse = GetTransactionsResponse;

export interface FundTargetSavingAccountResponse extends BaseResponse {
  data: {
    email: string;
    first_name: null;
    last_name: null;
    phone_number: string;
    transaction_reference: string;
  };
}
