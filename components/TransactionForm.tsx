"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { TransactionType, transaction_type_conditions } from "@/lib/entries";
import { Account } from "@/lib/accounts";
import { Card } from "@/lib/cards";


type TransactionFormProps = {
    accounts: Account[];
    cards:  Card[];
    onCreated: () => Promise<void>;
};

type Line = {
        description: string;
        card_id: number | "";
        from_account_id: number | "";
        to_account_id: number | "";
        amount: number | "";
    }

type TransactionLineFormProps = {
    line: Line
}


// null check

function TransactionLineForm({accounts, cards, transaction_type, line, onChange}:
    {accounts: Account[]; cards: Card[]; transaction_type: TransactionType; line: Line; onChange: (line: Line) => void}) {
    const condition = transaction_type_conditions[transaction_type];
    const from_account_options = accounts.filter((account) => account.account_type === condition.from);
    const to_account_options = accounts.filter((account) => account.account_type === condition.to);

    return (
        <div className="grid grid-cols-5 gap-3">
            <input
                value={line.description}
                onChange={(event) =>
                    onChange({...line, description: event.target.value})
                }
                placeholder="摘要"
                className="w-full rounded border px-3 py-2"
            />
            <select
                value={line.card_id}
                onChange={(event) => {
                    const card_id = event.target.dataset.cardId;
                    const value = event.target.value;
                    if (value === "") {
                        onChange({...line, card_id: "", from_account_id: 1}); // 財布
                    } else {
                        onChange({...line, card_id: Number(card_id), from_account_id: Number(value)});
                    }
                }}
                className="w-full rounded border px-3 py-2"
            >
                <option value="">現金払い</option>
                {cards.map((card) => (
                    <option
                        key={card.id}
                        value={card.payment_account_id}
                        data-card-id={card.id}
                    >
                        {card.name}
                    </option>
                ))}
            </select>
            <select
                value={line.from_account_id}
                onChange={(event) =>
                    onChange({...line, from_account_id: Number(event.target.value)})
                }
                required
                className="rounded border px-3 py-2"
            >
                <option value="">
                    移動元Account
                </option>
                {from_account_options.map((account) => (
                    <option
                        key={account.id}
                        value={account.id}
                    >
                        {account.name}
                    </option>
                ))}
            </select>
            <select
                value={line.to_account_id}
                onChange={(event) => onChange({...line, to_account_id: Number(event.target.value)})}
                required
                className="rounded border px-3 py-2"
            >
                <option value="">
                    移動先Account
                </option>
                {to_account_options.map((account) => (
                    <option
                        key={account.id}
                        value={account.id}
                    >
                        {account.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                min="1"
                step="1"
                value={line.amount}
                onChange={(event) => {
                    const value = event.target.value;
                    onChange({...line, amount: value === "" ? "" : Number(value)});
                }}
                placeholder="金額"
                required
                className="w-full rounded border px-3 py-2"
            />
        </div>
    )
}

export function TransactionForm({accounts, cards, onCreated}: TransactionFormProps) {
    const [occurred_on, setOccurredOn] = useState(new Date().toISOString().slice(0, 10));
    const [transaction_type, setTransactionType] = useState<TransactionType>("支出");
    const [summary, setSummary] = useState<string>("");
    const [lines, setLines] = useState<Line[]>([{
        description: "",
        card_id: "",
        from_account_id: "",
        to_account_id: "",
        amount: ""
    }]);
    const transaction_type_keys = Object.keys(transaction_type_conditions);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (lines.some((line) =>
            line.from_account_id !== "" &&
            line.to_account_id !== "" &&
            line.from_account_id === line.to_account_id
        )) {
            alert("移動元Accountと移動先Accountは同じにできません");
            return;
        }

        const { data: entry, error: entryError } = await supabase
            .from("journal_entries")
            .insert({occurred_on, summary})
            .select("id")
            .single();
        if (entryError) {
            alert(`submitError: ${entryError.message}`);
            return;
        }

        await Promise.all(lines.map(async (line) => {
            const { from_account_id, to_account_id, amount } = line;
            const description = line.description === "" ? summary : line.description;
            const { error: transactionLinesError } = await supabase
                .from("transaction_lines")
                .insert({
                    journal_entry_id: entry.id,
                    description,
                    amount: Number(amount),
                    from_account_id: Number(from_account_id),
                    to_account_id: Number(to_account_id)
                });
            if (transactionLinesError) {
                alert(`submitError: ${transactionLinesError.message}`);
            }
        }));

        setLines([{
            description: "",
            card_id: "",
            from_account_id: "",
            to_account_id: "",
            amount: ""
        }]);
        await onCreated();
    }

        // if (from_account_id === to_account_id) {
        //     alert("移動元Accountと移動先Accountは同じにできません");
        //     return;
        // }



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
                {transaction_type_keys.map((key, index) => (
                    <option key={index} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="概要"
                required
                className="w-full rounded border px-3 py-2"
            />

            {lines.map((line, index) => (
                <TransactionLineForm
                    key={index}
                    accounts={accounts}
                    cards={cards}
                    transaction_type={transaction_type}
                    line={line}
                    onChange={(updatedLine) => {
                        const newLines = [...lines];
                        newLines[index] = updatedLine;
                        setLines(newLines);
                    }}
                />
            ))}
            
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setLines([...lines, {description: "", card_id: "", from_account_id: "", to_account_id: "", amount: ""}])}
                    className="rounded border bg-black px-4 py-2 text-white"
                >
                    取引を追加
                </button>
                <button
                    type="submit"
                    className="rounded border bg-black px-4 py-2 text-white"
                >
                    取引を登録
                </button>
                
            </div>
        </form>
    );
}