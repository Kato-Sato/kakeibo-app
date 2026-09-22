"use client";
import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { loadAccounts, Account } from "@/lib/accounts";
import { loadEntries, JournalEntry } from "@/lib/entries";
import { loadCards, Card } from "@/lib/cards";

export default function TransactionsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const load = async () => {
            const [accounts, entries, cards] = await Promise.all([
                loadAccounts(),
                loadEntries(),
                loadCards()
            ]);
            setAccounts(accounts);
            setEntries(entries);
            setCards(cards);
        }
        void load().catch((error) => alert(error instanceof Error ? error.message : String(error)));
    }, []);

    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm
                    accounts={accounts}
                    cards={cards}
                    onCreated={async () => {
                        try {
                            setEntries(await loadEntries());
                        } catch (error) {
                            alert(`onCreatedError: ${error instanceof Error ? error.message : String(error)}`);
                        }
                    }}
                />

                <table className="w-full divide-y rounded border">
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
                            const transaction_lines = entry.transaction_lines ?? [];
                            console.log("transaction_lines", transaction_lines);
                            const len = transaction_lines.length;
                            if (len === 1) {
                                const transaction_line = transaction_lines[0];
                                const amount = transaction_line.amount;
                                const from_account_type = transaction_line.from_account?.account_type ?? "asset";
                                const to_account_type = transaction_line.to_account?.account_type ?? "asset";
                                let card = "";
                                let from_account = transaction_line.from_account?.name ?? "不明";
                                let to_account = transaction_line.to_account?.name ?? "不明";
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
                                return transaction_lines.map((transaction_line) => (
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