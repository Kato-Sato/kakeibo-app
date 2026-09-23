"use client";
import { useEffect, useState } from "react";
import { loadEntries, Filter, JournalEntry } from "@/lib/entries";

 // 続き filter機能を実装したい

export function TransactionList({filter}: {filter: Filter}) { // refreshKey 実装
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        const load = async () => {
            const [entries] = await Promise.all([
                loadEntries(filter)
            ]);
            setEntries(entries);
        }
        void load().catch((error) => alert(error instanceof Error ? error.message : String(error)));
    }, []);

    return (
        <div className="space-y-2">
            {entries.map((entry) => {
                const total_amount = entry.transaction_lines.reduce((sum, line) => sum + line.amount, 0);
                const transaction_lines = entry.transaction_lines;
                const len = transaction_lines.length;
                const summary = entry.summary;
                return (
                    <div
                        key={entry.id}
                    >
                        {transaction_lines.map((line, index) => {
                            const description = line.description;
                            const from_account_type = line.from_account?.account_type ?? "asset";
                            const to_account_type = line.to_account?.account_type ?? "asset";
                            let card = "";
                            let from_account = line.from_account?.name ?? "不明";
                            let to_account = line.to_account?.name ?? "不明";
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
                                card = from_account;  // カード名を表示させたい
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
                                <div
                                    key={line.id}
                                    className="grid grid-cols-[100px_80px_80px_80px_80px_80px_80px_80px] items-center rounded border px-4 py-3"
                                >
                                    <div>{index === 0 ? entry.occurred_on : ""}</div>
                                    <div>{index === 0 ? entry.summary : ""}</div>
                                    <div>{summary === description ? "" : description}</div>
                                    <div>{category}</div>
                                    {/* <div>{card}</div> */}
                                    <div>{from_account}</div>
                                    <div>{to_account}</div>
                                    <div className="text-right">{len > 1 ? line.amount: ""}</div>
                                    <div className="text-right">{index === 0 ? Math.abs(total_amount) : ""}</div>
                                </div>
                            );
                        })}
                    </div>
                )
            })}
        </div>
    );
}