"use client";
import { useEffect, useState } from "react";
import { loadAccounts, AccountDetail } from "@/lib/accounts";
import { supabase } from "@/lib/supabase";

type MonthlyEntry = {
    month: string;
    account_id: number;
    account_name: string;
    account_type: string;
    amount: number;
};

export function MonthlyEntries({account_type}: { account_type: "income" | "expense" }) {
    const [accounts, setAccounts] = useState<AccountDetail[]>([]);
    const [entries, setEntries] = useState<MonthlyEntry[]>([]);

    async function loadEntries() {
        const { data, error } = await supabase
            .from("monthly_entries")
            .select('*')
        if (error) throw error;
        return data ?? []
    }

    useEffect(() => {
        const load = async () => {
            const [accounts, entries] = await Promise.all([
                loadAccounts(),
                loadEntries()
            ]);
            setAccounts(accounts);
            setEntries(entries);
        }
        void load().catch((error) => alert(error instanceof Error ? error.message : String(error)));
    }, []);

    const months = Array.from(
        new Set(
            entries.map(
                (entry) => entry.month,
            ),
        ),
    ).sort((a, b) => b.localeCompare(a));

    const amountMap = new Map<string, number>();
    for(const entry of entries) {
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
                    {account_type === "income" ? "収入" : "支出"}
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
                                                    {getAmount(month, account.id) * (account_type === "income" ? -1 : 1)}
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
            </section>
        </div>
    );
}