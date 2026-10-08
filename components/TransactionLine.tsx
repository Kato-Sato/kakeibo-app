import { type TransactionLineDetail, type TransactionType, TRANSACTION_TYPE_LABELS } from "@/domain/transaction";
import { Account, getAccountName } from "@/domain/account";

// ここ後で調整
type LineField = "account" | "category" | "card" | "hidden";
export const TRANSACTION_LINE_FIELDS: Record<
    TransactionType,
    { from: LineField; to: LineField }
> = {
    expense:      { from: "account",  to: "category" },
    income:       { from: "category", to: "account"  },
    transfer:     { from: "account",  to: "account"  },
    // card_expense: { from: "account",  to: "category" },
    borrow:       { from: "hidden",   to: "hidden"   },
    repay:        { from: "hidden",   to: "hidden"   },
};

export default function LineItem({ line, accountById }: { line: TransactionLineDetail; accountById: ReadonlyMap<number, Account> }) {
    const fromAccountName = getAccountName(accountById, line.fromAccountId);
    const toAccountName = getAccountName(accountById, line.toAccountId);
    return (
        <div>
            {(<div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] items-center rounded border px-4 py-3">
                <div>{line.occurredOn}</div>
                <div>{TRANSACTION_TYPE_LABELS[line.type]}</div>
                <div>{line.description}</div>
                <div>{fromAccountName}</div>
                <div>{toAccountName}</div>
                <div className="text-right">{line.amount}</div>
            </div>)}
        </div>
    )
}