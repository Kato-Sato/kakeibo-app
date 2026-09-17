"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Account = {
    id: number;
    name: string;
};

type TransactionFormProps = {
    accounts: Account[];
    onCreated: () => Promise<void>;
};

export function TransactionForm({
    accounts,
    onCreated,
}: TransactionFormProps) {
    const [occurredOn, setOccurredOn] = useState(
        new Date().toISOString().slice(0, 10),
    );
    const [description, setDescription] = useState("");
    const [fromAccountId, setFromAccountId] =
        useState("");
    const [toAccountId, setToAccountId] = useState("");
    const [amount, setAmount] = useState("");

    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const numericAmount = Number(amount);

        const { data: entry, error: entryError } =
            await supabase
                .from("journal_entries")
                .insert({
                    occurred_on: occurredOn,
                    description,
                })
                .select("id")
                .single();

        if (entryError) {
            alert(entryError.message);
            return;
        }

        const { error: postingsError } = await supabase
            .from("postings")
            .insert([
                {
                    journal_entry_id: entry.id,
                    account_id: Number(fromAccountId),
                    amount: -numericAmount,
                },
                {
                    journal_entry_id: entry.id,
                    account_id: Number(toAccountId),
                    amount: numericAmount,
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
        setAmount("");

        await onCreated();
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-3 rounded border p-4"
        >
            <input
                type="date"
                value={occurredOn}
                onChange={(event) =>
                    setOccurredOn(event.target.value)
                }
                required
                className="w-full rounded border px-3 py-2"
            />

            <input
                value={description}
                onChange={(event) =>
                    setDescription(event.target.value)
                }
                placeholder="摘要"
                required
                className="w-full rounded border px-3 py-2"
            />

            <div className="grid grid-cols-2 gap-3">
                <select
                    value={fromAccountId}
                    onChange={(event) =>
                        setFromAccountId(
                            event.target.value,
                        )
                    }
                    required
                    className="rounded border px-3 py-2"
                >
                    <option value="">
                        移動元Account
                    </option>
                    {accounts.map((account) => (
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
                    onChange={(event) =>
                        setToAccountId(
                            event.target.value,
                        )
                    }
                    required
                    className="rounded border px-3 py-2"
                >
                    <option value="">
                        移動先Account
                    </option>
                    {accounts.map((account) => (
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
                    setAmount(event.target.value)
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