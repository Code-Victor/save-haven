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
