// React Query Kit Router
import { router } from "react-query-kit";
import * as api from "..";

const MINUTE = 60 * 1000;
export const authRouter = router("auth", {
  onboardUser: router.mutation({ mutationFn: api.onboardUser }),
  verifyOTP: router.mutation({ mutationFn: api.verifyOTP }),
  userSignUp: router.mutation({ mutationFn: api.userSignUp }),
  userLogin: router.mutation({ mutationFn: api.userLogin }),
  forgotPassword: router.mutation({ mutationFn: api.forgotPassword }),
  createPassword: router.mutation({ mutationFn: api.createPassword }),
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
  getAccountName: router.mutation({ mutationFn: api.getAccountName }),
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
