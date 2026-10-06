import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction, TransactionFilter } from "@/domain/transaction";

import TransactionC from "@/components/Transaction";

export default function TransactionList({
    transactions,
    accountById
}: {
    transactions: Transaction[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
}) {
    return (
        <div className="space-y-2">
            {transactions.map((transaction) => {
                return <TransactionC key={transaction.id} transaction={transaction} accountById={accountById} />;
            })}
        </div>
    );
}