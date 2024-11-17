import axios, { AxiosError } from "axios";
import { getAccessToken } from "@/utils";
import * as ApiTypes from "./types";
const BASE_URL = "https://genetic-holli-yayako-30b6a681.koyeb.app";

const api = axios.create({
  baseURL: BASE_URL,
});

// Error logger
function errorLogger(context = false) {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (
      error: AxiosError<{
        message?: string;
      }>
    ) => {
      const url = error.response?.config.url as string;
      const method = error.response?.config.method as string;
      const status = error.response?.status as number;
      const message = error.response?.data?.message as string;
      console.log(`API Error -> ${url}(${status})[${method}]: ${message}`);
      if (context) {
        console.log("context:", error.response?.data);
      }
      return Promise.reject(error);
    }
  );
}

function tokenInterceptors({ log = false } = {}) {
  const tokenInterceoptor = api.interceptors.request.use(
    async (config) => {
      const token = await getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (log) {
        const url = config.url as string;
        const method = config.method as string;
        console.log(`API Request -> ${url} [${method}]`);
        console.log(`Auth Token -> ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return () => api.interceptors.request.eject(tokenInterceoptor);
}

// add Interceptors
errorLogger();
tokenInterceptors({ log: true });

// Auth API functions

export const onboardUser = async (data: { email: string }) => {
  const res = await api.post<ApiTypes.OnboardUserResponse>(
    "/auth/onboard-user",
    data
  );
  return res.data;
};

export const verifyOTP = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const res = await api.post<ApiTypes.VerifyOTPResponse>(
    `/auth/verify-otp/${email}`,
    {
      OTP: otp,
    }
  );
  return res.data;
};

export const userSignUp = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  telephone_no: string;
  address: string;
  password: string;
  confirm_password: string;
}) => {
  const res = await api.post<ApiTypes.UserSignUpResponse>(
    `/auth/sign-up/${data.email}`,
    data
  );
  return res.data;
};

export const userLogin = async (data: { email: string; password: string }) => {
  const res = await api.post<ApiTypes.UserLoginResponse>(
    "/auth/user-login",
    data
  );
  return res.data;
};

export interface ForgotPasswordResponse {}
export const forgotPassword = (email: string) =>
  api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });

export interface CreatePasswordResponse {}
export const createPassword = (
  email: string,
  data: { new_password: string; confirm_new_password: string }
) => api.post<CreatePasswordResponse>(`/auth/create-password/${email}`, data);

//#region Wallet API functions

export const getWalletDetails = async () => {
  const res = await api.get<ApiTypes.WalletDetailsResponse>("/wallet/details");
  return res.data;
};

export interface CreateWithdrawalPinResponse {}
export const createWithdrawalPin = (password: string) =>
  api.post<CreateWithdrawalPinResponse>("/wallet/create-withdrawal-pin", {
    password,
  });

export interface TransferFundsResponse {}
export const transferFunds = (data: {
  amount: number;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration: string;
  password: string;
}) => api.post<TransferFundsResponse>("/wallet/transfer", data);

export const getTransactions = async (params?: {
  transaction_type?: string;
  start_date?: string;
  end_date?: string;
  amount?: number;
  page?: number;
  size?: number;
}) => {
  const res = await api.get<ApiTypes.GetTransactionsResponse>(
    "/wallet/transactions",
    { params }
  );
  return res.data;
};
export interface GetTransactionByReferenceResponse {}
export const getTransactionByReference = (transactionReference: string) =>
  api.get<GetTransactionByReferenceResponse>(
    `/wallet/transaction/${transactionReference}`
  );

export interface GetTransactionByIdResponse {}
export const getTransactionById = (transactionId: string) =>
  api.get<GetTransactionByIdResponse>(`/wallet/transaction/${transactionId}`);
// #endregion

//#region Webhook API functions
export const handleCollectionWebhook = () =>
  api.post("/transactions/collection-webhook");
export const handlePayoutWebhook = () =>
  api.post("/transactions/payout-webhook");

// Other API functions
export interface GetCurrentUserResponse {}
export const getCurrentUser = () =>
  api.get<GetCurrentUserResponse>("/get_current_user");

export interface GetAllBanksResponse {}
export const getAllBanks = (params?: { page?: number; size?: number }) =>
  api.get<GetAllBanksResponse>("/banks", { params });

export interface GetAccountNameResponse {}
export const getAccountName = (bankCode: string, accountNumber: string) =>
  api.post<GetAccountNameResponse>(
    `/get-account-name/${bankCode}/${accountNumber}`
  );
// #endregion
