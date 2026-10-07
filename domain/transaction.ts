import type { AccountType, Account, AccountNode } from "@/domain/account.ts";
import { isLeaf } from "@/domain/account";

export const TRANSACTION_TYPE_LABELS = {
    expense: "支出",
    income: "収入",
    transfer: "振替",
    // card_expense: "カード支出",
    borrow: "借入",
    repay: "返済"
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPE_LABELS;
export const TRANSACTION_TYPES = Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[];

export type TransactionSide = "from" | "to";
type TransactionTypeRule = {
    from: AccountType;
    to: AccountType;
    categorySide: TransactionSide | null;
};

export const TRANSACTION_TYPE_RULES = {
    expense:      { from: "asset",     to: "expense",   categorySide: "to"   },
    income:       { from: "income",    to: "asset",     categorySide: "from" },
    transfer:     { from: "asset",     to: "asset",     categorySide: null   },
    borrow:       { from: "liability", to: "asset",     categorySide: "from" },
    repay:        { from: "asset",     to: "liability", categorySide: "to"   }
} as const satisfies Record<TransactionType, TransactionTypeRule>;

// 明細からカテゴリの科目IDを取り出す
// export function getCategoryAccountId(
//     type: TransactionType,
//     line: Pick<TransactionLine, "debit_account_id" | "credit_account_id">,
// ): string | null {
//     const side = TRANSACTION_TYPE_RULES[type].categorySide;
//     if (side === "from") return line.credit_account_id;
//     if (side === "to") return line.debit_account_id;
//     return null;
// }

// 科目の種類から取引種別を判定する
// export function inferTransactionType(from: AccountType, to: AccountType): TransactionType | null {
//     const entry = Object.entries(TRANSACTION_TYPE_RULES)
//         .find(([, r]) => r.from === from && r.to === to);
//     return entry ? (entry[0] as TransactionType) : null;
// }

export function getAccountCandidates(
    accountTree: AccountNode[],
    type: TransactionType,
    side: TransactionSide
): Account[] {
    const candidates = accountTree.filter((node) => isAccountAllowed(type, side, node));
    const childCandidates = accountTree.flatMap(node => getAccountCandidates(node.children, type, side));
    return [...candidates, ...childCandidates];
}

export function parseAmount(raw: string): number | null {
    const n = Number(raw.trim());
    return Number.isInteger(n) && n > 0 ? n : null;
}

export type Transaction = {
    id: number;
    occurredOn: string;
    type: TransactionType;
    summary: string;
    lines: TransactionLine[];
};
export type NewTransaction = Omit<Transaction, "id" | "lines"> & {
    lines: NewTransactionLine[];
};

export type TransactionLine = {
    id: number;
    description: string;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
};

export type NewTransactionLine = Omit<TransactionLine, "id">;

export type TransactionFilter = {
    startDate?: string;  // 日付型
    endDate?: string;
    types?: TransactionType[];
    accountId?: number[];
}


// domain/transaction.ts  以下合っているか確認
// function matchesTransaction(t: Transaction, filter: TransactionFilter): boolean {
//     if (filter.period) {
//         const { start, end } = filter.period;
//         if (t.occurredOn < start || t.occurredOn >= end) return false;
//     }
//     if (filter.types && filter.types.length > 0 && !filter.types.includes(t.type)) {
//         return false;
//     }
//     return true;
// }

// function matchesLine(line: TransactionLine, filter: TransactionFilter): boolean {
//     if(
//         filter.accountId != null &&
//         line.fromAccountId !== filter.accountId &&
//         line.toAccountId !== filter.accountId
//     ) {
//         return false;
//     }
//     return true;
// }

// export function filterTransactions(
//     transactions: Transaction[],
//     filter: TransactionFilter
// ): Transaction[] {
//     return transactions.flatMap((t) => {
//         if (!matchesTransaction(t, filter)) return [];

//         const lines = t.lines.filter((l) => matchesLine(l, filter));
//         if (lines.length === 0) return [];
//         if (lines.length === t.lines.length) return [t];   // 全明細が残るなら元の取引をそのまま返す
//         return [{ ...t, lines }];
//     });
// }

export function isAccountAllowed(
    type: TransactionType,
    side: TransactionSide,
    account: AccountNode
): boolean {
    return (isLeaf(account) && account.accountType === TRANSACTION_TYPE_RULES[type][side]);
}