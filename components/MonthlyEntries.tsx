"use client";
import { useEffect, useState } from "react";
import { loadAccounts, Account, AccountType, AccountDetail } from "@/lib/accounts";
import TransactionList from "@/components/TransactionList";
import { TransactionType, JournalEntry } from "@/lib/entries";

export type MonthlyEntry = {
    month: string;
    account_id: number;
    account_name: string;
    account_type: string;
    amount: number;
};

export type SummaryPageType = "支出" | "収入" | "債務";

export const summary_items: Record<
    SummaryPageType,
    {
        transaction_types: TransactionType[];
        account_type: AccountType;  // 必要？？
    }
> = {
    支出: {
        transaction_types: ["支出", "カード支出"],
        account_type: "expense"
    },
    収入: {
        transaction_types: ["収入"],
        account_type: "income"
    },
    債務: {
        transaction_types: ["借入", "返済"],
        account_type: "liability"
    }
};

export default function MonthlyEntries({summary_page_type, monthly_entries, accounts}: {
    summary_page_type: SummaryPageType,
    monthly_entries: MonthlyEntry[],
    accounts: AccountDetail[]
}) {
    const [highlighted_month, setHighlightedMonth] = useState<string | null>(null);
    const [highlighted_account, setHighlightedAccount] = useState<Account | null>(null);

    const {transaction_types, account_type} = summary_items[summary_page_type];

    const months = Array.from(
        new Set(
            monthly_entries.map(
                (entry) => entry.month
            )
        )
    ).sort((a, b) => b.localeCompare(a));

    const amountMap = new Map<string, number>();
    for(const entry of monthly_entries) {
        const key = `${entry.month}:${entry.account_id}`;
        amountMap.set(key, entry.amount);
    }

    function getAmount(month: string, account_id: number) {
        const key = `${month}:${account_id}`;
        return (amountMap.get(key)) ?? 0
    }

    return(
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    {summary_page_type}
                </h2>

                <table>
                    <thead>
                        <tr>
                            <th className="border p-2">月</th>
                            {accounts.map((account) => {
                                if (account.account_type === account_type && account.parent_account_id === null) {
                                    return (
                                        <th key={account.id} className="border p-2">
                                            {account.name}
                                        </th>
                                    );
                                }
                                return null;
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {months.map((month) => {
                            return (
                                <tr key={month}>
                                    <td className="border p-2">{month}</td>
                                    {accounts.map((account) => {
                                        if (account.account_type === account_type && account.parent_account_id === null) {
                                            return (
                                                <td key={account.id} className="border p-2">
                                                    {getAmount(month, account.id) /* あとで修正*/ }
                                                </td>
                                            );
                                        }
                                        return null;
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <TransactionList filter={{
                    from_date: highlighted_month ?? undefined,
                    to_date: highlighted_month ? new Date(new Date(highlighted_month).getFullYear(), new Date(highlighted_month).getMonth() + 1, 1).toISOString().split("T")[0] : undefined,
                    involved_account_id: highlighted_account?.id ?? undefined
                }} />
            </section>
        </div>
    );
}