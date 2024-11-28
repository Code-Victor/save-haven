// React Query Kit Router
import { router } from "react-query-kit";
import * as api from "..";

const MINUTE = 60 * 1000;
export const authRouter = router("auth", {
  onboardUser: router.mutation({ mutationFn: api.onboardUser }),
  verifyOTP: router.mutation({ mutationFn: api.verifyOTP }),
  resendOTP: router.mutation({ mutationFn: api.resendOTP }),
  userLogin: router.mutation({ mutationFn: api.userLogin }),
  forgotPassword: router.mutation({ mutationFn: api.forgotPassword }),
  // createPassword: router.mutation({ mutationFn: api.createPassword }),
});

export const walletRouter = router("wallet", {
  getWalletDetails: router.query({ fetcher: api.getWalletDetails }),
  createWithdrawalPin: router.mutation({ mutationFn: api.createWithdrawalPin }),
  transferFunds: router.mutation({ mutationFn: api.transferFunds }),
  getTransactions: router.query({
    fetcher: api.getTransactions,
    refetchInterval: MINUTE,
  }),
  getTransactionByReference: router.query({
    fetcher: api.getTransactionByReference,
  }),
  getTransactionById: router.query({ fetcher: api.getTransactionById }),
  fundWallet: router.mutation({ mutationFn: api.fundWallet }),
});

export const webhookRouter = router("webhook", {
  handleCollectionWebhook: router.mutation({
    mutationFn: api.handleCollectionWebhook,
  }),
  handlePayoutWebhook: router.mutation({ mutationFn: api.handlePayoutWebhook }),
});

export const miscRouter = router("misc", {
  getCurrentUser: router.query({ fetcher: api.getCurrentUser }),
  getAllBanks: router.query({ fetcher: api.getAllBanks }),
  // getAccountName: router.mutation({ mutationFn: api.getAccountName }),
});

export const targetSavingRouter = router("target-savings", {
  create: router.mutation({
    mutationFn: api.createTargetSavings,
  }),
  getAll: router.query({
    fetcher: api.getAllTargetSavings,
  }),
  getById: router.query({
    fetcher: api.getTargetSavingsById,
    refetchInterval: MINUTE,
  }),
  getTransactions: router.query({
    fetcher: api.getTargetSavingTransactions,
    refetchInterval: MINUTE,
  }),
  fundAccount: router.mutation({
    mutationFn: api.fundTargetSavingAccount,
  }),
  fundFromWallet: router.mutation({
    mutationFn: api.fundTargetSavingFromWallet,
  }),
  withdraw: router.mutation({
    mutationFn: api.withdrawTargetSavings,
  }),
});
export const crowdfundingRouter = router("crowdfunding", {
  create: router.mutation({
    mutationFn: api.createCampaign,
  }),
  getAll: router.query({
    fetcher: api.getAllCampaigns,
  }),
  getById: router.query({
    fetcher: api.getCampaignById,
    refetchInterval: MINUTE,
  }),
  shareCampaign: router.query({
    fetcher: api.shareCampaign,
  }),
  getTransactions: router.query({
    fetcher: api.getCampaignTransactions,
    refetchInterval: MINUTE,
  }),
  withdraw: router.mutation({
    mutationFn: api.withdrawCampaignSavings,
  }),
});
