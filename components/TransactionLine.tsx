import { type TransactionLineDetail, type TransactionType, TRANSACTION_TYPE_LABELS } from "@/domain/transaction";
import { Account, getAccountName } from "@/domain/account";
import Amount from "@/components/Amount";

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

const ROW_GRID = "grid grid-cols-[6rem_4rem_minmax(0,1fr)_6rem_6rem_6rem] items-center gap-3 px-4 py-2";

export function TransactionListHeader() {
    return (
        <div className={`${ROW_GRID} text-sm text-gray-500`}>
            <div>日付</div>
            <div>種類</div>
            <div>摘要</div>
            <div>移動元</div>
            <div>移動先</div>
            <div className="text-right">金額</div>
        </div>
    );
}

export default function LineItem({ line, accountById }: { line: TransactionLineDetail; accountById: ReadonlyMap<number, Account> }) {
    const fromAccountName = getAccountName(accountById, line.fromAccountId);
    const toAccountName = getAccountName(accountById, line.toAccountId);
    return (
        <div>
            {(<div className={ROW_GRID}>
                <div className="tabular-nums">{line.occurredOn}</div>
                <div>{TRANSACTION_TYPE_LABELS[line.type]}</div>
                <div className="truncate">{line.description}</div>
                <div className="truncate">{fromAccountName}</div>
                <div className="truncate">{toAccountName}</div>
                <div className="text-right"><Amount value={line.amount} /></div>
            </div>)}
        </div>
    )
}