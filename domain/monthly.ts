import { Account, AccountType } from "./account";
import { TransactionType } from "./transaction";

export type MonthlyAccountTotal = {
    accountId: number;
    month: string;  // 日付型
    total: number;
};




export const ACCOUNT_MONTHS: Record<string, AccountMonth> = {};

export type AccountMonth = {
    month: string; // month typeとして定義
    accountId: number;
};