export type OptionType =
  | "balance"
  | "payday"
  | "postPaid"
  | "setIncome"
  | "reset"
  | "history"
  | "";
export type ResponseBalanceType = {
  currentBalance: number;
  income: number;
  lastPayday: string | null;
};
export type ResponsePaydayType = {
  message: string;
  newBalance: number;
  income: number;
  lastPayday: string;
};
export type ResponsePostPaidType = {
  message: string;
  expenseId: string;
  newBalance: number;
};
export type ResponseSetIncomeType = {
  message: string;
  income: number;
};
export type ResponseResetType = {
  message: string;
};
