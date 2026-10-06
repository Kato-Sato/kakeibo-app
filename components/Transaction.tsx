import type { Transaction, TransactionType } from "@/domain/transaction";
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

export default function Transaction({ transaction, accountById }: { transaction: Transaction; accountById: ReadonlyMap<number, Account> }) {
    const transactionLines = transaction.lines;
    const total_amount = transactionLines.reduce((sum, line) => sum + line.amount, 0);
    const len = transactionLines.length;
    // 続き この辺りの調整 summaryの表示
    return (
        <div key={transaction.id}>
            {(len > 0) && (<div className="grid grid-cols-[80px_1fr_80px_80px_80px_80px_80px] items-center rounded border px-4 py-3">
                <div>{transaction.occurredOn}</div>
                <div></div> {/* trasactiontype */}
                <div>{transaction.summary}</div>
                <div></div> {/* category */}
                <div></div> {/* fromaccount */}
                <div></div> {/* toaccount */}
                <div className="text-right">{total_amount}</div>
            </div>)}
            <div>
                {transactionLines.map((line) => {
                    // const transactionType = transaction.type;
                    // const fromAccountField = TRANSACTION_LINE_FIELDS[transactionType].from;
                    // const toAccountField = TRANSACTION_LINE_FIELDS[transactionType].to;
                    const fromAccountName = getAccountName(accountById, line.fromAccountId);
                    const toAccountName = getAccountName(accountById, line.toAccountId);

                    return (
                        <div
                            key={line.id}
                            className="grid grid-cols-[80px_1fr_80px_80px_80px_80px] items-center rounded border px-4 py-3"
                        >
                            <div>{transaction.type}</div>
                            <div>{line.description}</div>
                            <div>{/* category */}</div>
                            <div>{fromAccountName}</div>
                            <div>{toAccountName}</div>
                            <div className="text-right">{line.amount}</div>
                        </div>
                    );
                })}
            </div>
            
        </div>
    )
}