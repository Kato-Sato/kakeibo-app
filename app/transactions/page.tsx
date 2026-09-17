"use client";
import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { supabase } from "@/lib/supabase";

type Account = {
    id: number;
    name: string;
    account_type: string;
    parent_account_id: number | null;
};

type Posting = {
    id: number;
    amount: number;
    accounts: {
        name: string;
        account_type: string;
    } | null;
};

type JournalEntry = {
    id: number;
    occurred_on: string;
    description: string;
    postings: Posting[];
};

export default function TransactionsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    async function loadAccounts() {
        const { data, error } = await supabase
            .from("accounts")
            .select(
                "id, name, account_type, parent_account_id",
            )
            .order("id");
        if (error) {
            alert(error.message);
            return;
        }
        setAccounts(data ?? []);
    }

    async function loadEntries() {
        const { data, error } = await supabase
            .from("journal_entries")
            .select(`
                id,
                occurred_on,
                description,
                postings (
                    id,
                    amount,
                    accounts (
                        name,
                        account_type
                    )
                )
            `)
            .order("occurred_on", {
                ascending: false,
            })
            .order("id", {
                ascending: false,
            });
        if (error) {
            alert(error.message);
            return;
        }
        setEntries(
            (data as JournalEntry[] | null) ?? [],
        );
    }

    useEffect(() => {
        void Promise.all([
            loadAccounts(),
            loadEntries(),
        ]);
    }, []);

    return (
        <main className="mx-auto max-w-3xl space-y-10 p-8">
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm
                    accounts={accounts}
                    onCreated={loadEntries}
                />

                <table>
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>種別</th>
                            <th>摘要</th>
                            <th>金額</th>
                            <th>カテゴリー</th>
                            <th>出金</th>
                            <th>入金</th>
                        </tr>
                    </thead>

                    <tbody>
                        {entries.map((entry) => {
                            const len = entry.postings.length;
                            if (len === 2) {
const postings = [...entry.postings].sort((a, b) => a.amount - b.amount);
                                let from_account = postings[0].accounts?.name ?? "不明";
                                let to_account = postings[1].accounts?.name ?? "不明";
                                let type = "";
                                let category = "";
                                if (from_account_type === "asset" && to_account_type === "expense") {
                                    type = "支出";
                                    category = to_account;
                                    to_account = "";
                                } else if (from_account_type === "income" && to_account_type === "asset") {
                                    type = "収入";
                                    category = from_account;
                                    from_account = "";
                                } else if (from_account_type === "asset" && to_account_type === "asset") {
                                    type = "振替";
                                    category = `${from_account} → ${to_account}`;
                                } else if (from_account_type === "liability" && to_account_type === "asset") {
                                    type = "借入";
                                    category = from_account;
                                    from_account = "";
                                } else if (from_account_type === "asset" && to_account_type === "liability") {
                                    type = "返済";
                                    category = to_account;
                                    to_account = "";
                                } else {
                                    type = "その他";
                                    category = "その他";
                                }
                                return (
                                    <tr key={entry.id} className="rounded border p-4">
                                        <td>{entry.occurred_on}</td>
                                        <td>{type}</td>
                                        <td>{entry.description}</td>
                                        <td>{Math.abs(amount)}</td>
                                        <td>{category}</td>
                                        <td>{from_account}</td>
                                        <td>{to_account}</td>
                                    </tr>
                                );
                            } else if (len >= 3) {
                                return entry.postings.map((posting) => (
                                    <tr key={entry.id} className="rounded border p-4">
                                        <td>{entry.occurred_on}</td>
                                        <td>{entry.description}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                ));
                            }
                        })}
                    </tbody>
                </table>
            </section>
        </main>
    );
}