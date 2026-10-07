"use client";
import { useState, useMemo } from "react";
import ReportsTable from "@/components/ReportsTable";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useMonthlyAccountTotals } from "@/hooks/useMonthlyAccountTotals";
import type { AccountMonth, ReportsType } from "@/domain/reports";
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES } from "@/domain/account";

export default function ReportsPage() {
    const [reportsType, setReportsType] = useState<ReportsType>("expense");
    const [selectedAccountMonth, setSelectedAccountMonth] = useState<AccountMonth | null>(null);
    const accounts = useAccounts();
    const targetAccounts = useMemo(
        () => accounts.data?.filter((account) => account.accountType === reportsType) ?? [],
        [accounts.data, reportsType]
    );
    const totals = useMonthlyAccountTotals();
    const transactions = useTransactions({});

    return (
        <main>
            <select
                value={reportsType}
                onChange={(event) => {
                    setReportsType(event.target.value as ReportsType);
                    setSelectedAccountMonth(null);
                }}
                required
                className="w-full rounded border px-3 py-2"
            >
                {ACCOUNT_TYPES.map((key) => (
                    <option key={key} value={key}>
                        {ACCOUNT_TYPE_LABELS[key]}
                    </option>
                ))}
            </select>
            <div>
                {selectedAccountMonth && (
                    <p>
                        {selectedAccountMonth.month} - {selectedAccountMonth.accountId}
                    </p>
                )}
            </div>
            <ReportsTable
                accounts={targetAccounts}
                totals={totals.data ?? []}
                onSelect={setSelectedAccountMonth}
            />
            <TransactionList transactions={transactions.data ?? []} accountById={accounts.accountById} />
        </main>
    );
}