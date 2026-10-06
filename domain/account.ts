export const ACCOUNT_TYPE_LABELS = {
    expense: "費用", income: "収益", asset: "資産", liability: "負債"
} as const;

export type AccountType = keyof typeof ACCOUNT_TYPE_LABELS;
export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]

export type Account = {
    id: number;
    name: string;
    accountType: AccountType;
    parentAccountId: number | null;
    sortOrder: number | null;
};

export type NewAccount = Omit<Account, "id">;
export type AccountBalance = Account & { balance: number; };

export function getAccountName(
    accountById: ReadonlyMap<number, Account>,
    id: number,
): string {
    return accountById.get(id)?.name ?? "（不明な口座）";
}

export function isAsset(account: Pick<Account, "accountType">): boolean {
    return account.accountType === "asset";
}