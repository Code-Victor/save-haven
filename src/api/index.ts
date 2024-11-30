import axios, { AxiosError } from "axios";
import { getAccessToken } from "@/utils";
import * as ApiTypes from "./types";
import { Cloudinary } from "@cloudinary/url-gen";
// import { upload } from "cloudinary-react-native";
// const cld = new Cloudinary({ cloud: { cloudName: "dgvcc0rmr" } });

const BASE_URL = "https://genetic-holli-yayako-30b6a681.koyeb.app";
const IS_DEV = process.env.NODE_ENV === "development";
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

export const onboardUser = async (data: {
  name: string;
  email: string;
  telephone_no: string;
  password: string;
  confirm_password: string;
}) => {
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

export const resendOTP = async ({ email }: { email: string }) => {
  const res = await api.post<ApiTypes.ResendOTPResponse>(
    `/auth/resend-otp/${email}`
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

export const fundWallet = async ({
  account_number,
  ...data
}: {
  account_number: string;
  amount: number;
  sender_account_number: string;
  sender_account_name: string;
  sender_bank_name: string;
}) => {
  const res = await api.post<ApiTypes.FundWalletResponse>(
    "/wallet/fund-virtual-account/" + account_number,
    data
  );
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

// #region Target Saving

export const createTargetSavings = async (data: {
  savings_name: string;
  target_amount: number;
  amount_per_frequency: number;
  start_date: Date;
  end_date: Date;
  savings_frequency: string;
  days_of_week: string;
}) => {
  const res = await api.post<ApiTypes.CreateTargetSavingsResponse>(
    "/target-savings/create-account",
    data
  );
  return res.data;
};
export const getAllTargetSavings = async () => {
  const res = await api.get<ApiTypes.GetAllTargetSavingsResponse>(
    "/target-savings/accounts"
  );
  return res.data;
};

export const getTargetSavingsById = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetTargetSavingsByIdResponse>(
    "/target-savings/accounts/" + id
  );
  return res.data;
};

export const getTargetSavingTransactions = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetTargetSavingTransactionsResponse>(
    "/target-savings/transactions/" + id
  );
  return res.data;
};

export const fundTargetSavingAccount = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.FundTargetSavingAccountResponse>(
    "/target-savings/fund-savings-account/" + id
  );
  return res.data;
};

export const fundTargetSavingFromWallet = async ({
  id,
  amount,
}: {
  id: string;
  amount: number;
}) => {
  const res = await api.post<ApiTypes.FundTargetSavingFromWalletResponse>(
    "/target-savings/fund-from-wallet/" + id,
    null,
    {
      params: {
        amount,
      },
    }
  );
  return res.data;
};

export const withdrawCampaignSavings = async ({ id }: { id: string }) => {
  const res = await api.post<ApiTypes.WithdrawCampaignResponse>(
    "/crowdfunding/withdraw-funds/" + id
  );
  return res.data;
};
export const getCampaignTransactions = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetCampaignTransactionsResponse>(
    "/crowdfunding/transactions/" + id
  );
  return res.data;
};

export const withdrawTargetSavings = async ({ id }: { id: string }) => {
  const res = await api.post<ApiTypes.WithdrawTargetSavingsResponse>(
    "/target-savings/withdraw/" + id
  );
  return res.data;
};

// #endregion

//#region Crowdfunding
export interface CreateCampaignOptions {
  campaign_title: string;
  campaign_story: string;
  target_amount: number;
  campaign_category: string;
  is_personal: boolean;
  images: {
    uri: string;
    name: string;
    type: string;
  }[];
  state: string;
}

export const createCampaign = async ({
  images,
  ...rest
}: CreateCampaignOptions) => {
  const res = await api.post<ApiTypes.CreateCampaignResponse>(
    "crowdfunding/create-campaign",
    {
      ...rest,
      images: [],
    }
  );
  return res.data;
};

export const getCampaignById = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetCampaignByIdResponse>(
    "/crowdfunding/get-campaign/" + id
  );
  return res.data;
};
export const getAllCampaigns = async () => {
  const res = await api.get<ApiTypes.GetCampaignsResponse>(
    "/crowdfunding/get-campaigns"
  );
  return res.data;
};

export const shareCampaign = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.ShareCampaignResponse>(
    "/crowdfunding/share-campaign/" + id
  );
  return res.data;
};

export const getCampaignLeaderboard = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetCampaignLeaderboardResponse>(
    "crowdfunding/campaigns/leaderboard/" + id
  );
  return res.data;
};
// #endregion

//#region Group Savings
export const createGroupSavings = async (data: {
  group_name: string;
  number_in_group: number;
  group_target: number;
  amount_per_frequency: number;
  start_date: Date;
  end_date: Date;
  saving_frequency: string;
}) => {
  const res = await api.post<ApiTypes.CreateGroupSavingsResponse>(
    "group-savings/create-account",
    data
  );
  return res.data;
};

export const getAllGroupSavings = async () => {
  const res = await api.get<ApiTypes.GetAllGroupSavingsResponse>(
    "group-savings/accounts"
  );
  return res.data;
};
export const getGroupSavingsById = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetGroupSavingsByIdResponse>(
    "group-savings/accounts/" + id
  );
  return res.data;
};

export const fundGroupSavingsFromWallet = async ({
  id,
  amount,
}: {
  id: string;
  amount: number;
}) => {
  const res = await api.post<ApiTypes.FundGroupSavingsFromWalletResponse>(
    "group-savings/fund-from-wallet/" + id,
    null,
    {
      params: { amount },
    }
  );
  return res.data;
};

export const getGroupSavingsTransactions = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetGroupSavingsTransactionsResponse>(
    `group-savings/${id}/transactions`
  );
  return res.data;
};
export const getGroupSavingsDetails = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetGroupSavingsDetailsResponse>(
    "group-savings/details/" + id
  );
  return res.data;
};
export const getGroupSavingsLeaderboard = async ({ id }: { id: string }) => {
  const res = await api.get<ApiTypes.GetGroupSavingsLeaderboardResponse>(
    "group-savings/leaderboard/" + id
  );
  return res.data;
};
export const joinGroupSavings = async ({ reference }: { reference: string }) => {
  const res = await api.post<{message:string}>(
    "group-savings/join/" + reference
  );
  return res.data;
};

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
