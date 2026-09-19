"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadAccounts, Account } from "@/lib/accounts";

type TransactionType = "expense" | "income" | "transfer" | "borrow" | "repay";

type TransactionFormProps = {
    accounts: Account[];
    onCreated: () => Promise<void>;
};

export function TransactionForm({accounts, onCreated}: TransactionFormProps) {
    const [occurred_on, setOccurredOn] = useState(new Date().toISOString().slice(0, 10));
    const [transaction_type, setTransactionType] = useState<TransactionType>("expense");
    const [description, setDescription] = useState("");
    const [card_id, setCardId] = useState<number | "">("");
    const [fromAccountId, setFromAccountId] = useState<number | "">("");
    const [toAccountId, setToAccountId] = useState<number | "">("");
    const [amount, setAmount] = useState<number | "">("");

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const { data: entry, error: entryError } = await supabase
            .from("journal_entries")
            .insert({occurred_on, description})
            .select("id")
            .single();
        if (entryError) throw entryError;

        const { error: postingsError } = await supabase
            .from("postings")
            .insert([
                {
                    journal_entry_id: entry.id,
                    account_id: Number(fromAccountId),
                    amount: -amount
                },
                {
                    journal_entry_id: entry.id,
                    account_id: Number(toAccountId),
                    amount: amount
                },
            ]);
        if (postingsError) {
            /*
             * Posting登録に失敗するとJournalEntryだけ残る。
             * これは試作上の一時的な制限。
             */
            alert(postingsError.message);
            return;
        }

        setDescription("");
        setAmount(0);
        await onCreated();
    }

    function getFromAccountOptions() {
        if (transaction_type === "expense") {
            return accounts.filter((account) => ["asset", "liability"].includes(account.account_type));
        }else if (transaction_type === "income") {
            return accounts.filter((account) => account.account_type === "income");
        }else if (transaction_type === "transfer") {
            return accounts.filter((account) => account.account_type === "asset");
        }else if (transaction_type === "borrow") {
            return accounts.filter((account) => account.account_type === "liability");
        }else if (transaction_type === "repay") {
            return accounts.filter((account) => account.account_type === "asset");
        }
        return [];
    }
    function getToAccountOptions() {
        if (transaction_type === "expense") {
            return accounts.filter((account) => account.account_type === "expense");
        }else if (transaction_type === "income") {
            return accounts.filter((account) => account.account_type === "asset");
        }else if (transaction_type === "transfer") {
            return accounts.filter((account) => account.account_type === "asset");
        }else if (transaction_type === "borrow") {
            return accounts.filter((account) => account.account_type === "asset");
        }else if (transaction_type === "repay") {
            return accounts.filter((account) => account.account_type === "liability");
        }
        return [];
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-3 rounded border p-4"
        >
            <input
                type="date"
                value={occurred_on}
                onChange={(event) =>
                    setOccurredOn(event.target.value)
                }
                required
                className="w-full rounded border px-3 py-2"
            />

            <select
                value={transaction_type}
                onChange={(event) => setTransactionType(event.target.value as TransactionType)}
                required
                className="w-full rounded border px-3 py-2"
            >
                <option value="expense">支出</option>
                <option value="income">収入</option>
                <option value="transfer">振替</option>
                <option value="borrow">借入</option>
                <option value="repay">返済</option>
            </select>

            <input
                value={description}
                onChange={(event) =>
                    setDescription(event.target.value)
                }
                placeholder="摘要"
                required
                className="w-full rounded border px-3 py-2"
            />

            {/* <label className="block text-sm font-medium text-gray-700">
                Account
            </label> */}
            <select
                value={card_id}
                onChange={(event) => {
                    // setFromAccountId(Number(event.target.value)) カードに対応するAccount
                    setCardId(Number(event.target.value))
                }}
                required
                className="w-full rounded border px-3 py-2"
            >
                <option value="">現金払い</option>
                {accounts.map((account) => (
                    <option
                        key={account.id}
                        value={account.id}
                    >
                        {account.name}
                    </option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
                <select
                    value={fromAccountId}
                    onChange={(event) => setFromAccountId(Number(event.target.value))}
                    required
                    className="rounded border px-3 py-2"
                >
                    <option value="">
                        移動元Account
                    </option>
                    {getFromAccountOptions().map((account) => (
                        <option
                            key={account.id}
                            value={account.id}
                        >
                            {account.name}
                        </option>
                    ))}
                </select>

                <select
                    value={toAccountId}
                    onChange={(event) => setToAccountId(Number(event.target.value))}
                    required
                    className="rounded border px-3 py-2"
                >
                    <option value="">
                        移動先Account
                    </option>
                    {getToAccountOptions().map((account) => (
                        <option
                            key={account.id}
                            value={account.id}
                        >
                            {account.name}
                        </option>
                    ))}
                </select>
            </div>

            <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) =>
                    setAmount(Number(event.target.value))
                }
                placeholder="金額"
                required
                className="w-full rounded border px-3 py-2"
            />

            <button
                type="submit"
                className="rounded bg-black px-4 py-2 text-white"
            >
                取引を登録
            </button>
        </form>
    );
}