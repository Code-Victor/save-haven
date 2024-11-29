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
export interface ResendOTPResponse extends BaseResponse {}
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
  name: string;
  telephone_no: string;
}

export interface FundWalletResponse extends BaseResponse {
  transaction_reference: string;
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

export interface CreateTargetSavingsResponse extends BaseResponse {
  data: {
    amount_per_frequency: number;
    end_date: Date;
    id: string;
    savings_name: string;
    start_date: Date;
    target_amount: number;
    user: string;
  };
}

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

export interface GetTargetSavingTransactionsResponse {
  items: TargetSavingTransaction[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TargetSavingTransaction {
  id: string;
  saving_reference_id: string;
  transaction_reference: string;
  transaction_status: string;
  amount: number;
  transaction_type: string;
  createdAt: string;
}

export interface FundTargetSavingAccountResponse extends BaseResponse {
  data: {
    email: string;
    first_name: null;
    last_name: null;
    phone_number: string;
    transaction_reference: string;
  };
}

export interface FundTargetSavingFromWalletResponse extends BaseResponse {}
export interface WithdrawTargetSavingsResponse extends BaseResponse {}
export interface CreateCampaignResponse extends BaseResponse {
  status: number;
  data: {
    _id: string;
    campaign_title: string;
    campaign_category: string;
    target_amount: number;
    campaign_story: string;
    state: string;
    is_personal: boolean;
    images: string[];
    transaction_reference_id: string;
  };
}

export interface GetCampaignByIdResponse {
  status: number;
  message: string;
  data: Campaign;
}

export interface GetCampaignsResponse {
  items: Campaign[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Campaign {
  id: string;
  user: string;
  transaction_reference_id: string;
  campaign_title: string;
  campaign_story: string;
  target_amount: number;
  amount_raised: number;
  images: any[];
  state: string;
  status: string;
  campaign_category: string;
  is_locked: boolean;
  is_personal: boolean;
  createdAt: Date;
  is_deleted: boolean;
}

export interface ShareCampaignResponse {
  message: string;
  data: {
    email: string;
    first_name: null;
    last_name: null;
    phone_number: string;
    transaction_reference: string;
  };
}

export interface GetCampaignTransactionsResponse {
  items: CampaignTransaction[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CampaignTransaction {
  id: string;
  transaction_reference_id: string;
  transaction_reference: string;
  transaction_status: string;
  amount: number;
  transaction_type: string;
  createdAt: string;
  account: string;
  donor: Donor;
}

export interface Donor {
  account_name: string;
  bank_name: string;
}
export interface WithdrawCampaignResponse extends BaseResponse {}
export interface GetCampaignLeaderboardResponse extends BaseResponse {
  status: number;
  data: {
    name: string;
    total_amount: number;
  }[];
}
