"use client";
import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { loadAccounts, Account } from "@/lib/accounts";
import { loadEntries, JournalEntry } from "@/lib/entries";

export default function TransactionsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        const load = async () => {
            const [accounts, entries] = await Promise.all([
                loadAccounts(),
                loadEntries()
            ]);
            setAccounts(accounts);
            setEntries(entries);
        }
        void load();
    }, []);

    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm
                    accounts={accounts}
                    onCreated={async () => {
                        setEntries(await loadEntries());
                    }}
                />

                <table>
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>種別</th>
                            <th>摘要</th>
                            <th>金額</th>
                            <th>カード</th>
                            <th>カテゴリー</th>
                            <th>出金</th>
                            <th>入金</th>
                        </tr>
                    </thead>

                    <tbody>
                        {entries.map((entry) => {
                            const len = entry.postings.length;
                            if (len === 2) {
                                const postings = entry.postings;
                                const amount = postings[0].amount;
                                const from_account_type = postings[0].accounts?.account_type ?? "asset";
                                const to_account_type = postings[1].accounts?.account_type ?? "asset";
                                let card = "";
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
                                } else if (from_account_type === "liability" && to_account_type === "expense") {
                                    type = "カード支出";
                                    category = to_account;
                                    to_account = "";
                                    card = from_account;
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
                                        <td>{card}</td>
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
        </div>
    );
}