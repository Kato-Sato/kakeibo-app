import type { TransactionLineDraft } from "./draft";
import type { Account } from "@/domain/account";

export default function TransactionLineForm({line, fromAccountOptions, toAccountOptions, onChange}: {
    line: TransactionLineDraft;
    fromAccountOptions: Account[];
    toAccountOptions: Account[];
    onChange: (next: TransactionLineDraft) => void;
}) {
    return (
        <div className="grid grid-cols-4 gap-3">
            <input
                value={line.description}
                onChange={(event) => onChange({...line, description: event.target.value})}
                placeholder="摘要"
                className="w-full rounded border px-3 py-2"
            />
            <select
                value={line.fromAccountId ?? ""}
                onChange={(event) => onChange({
                    ...line,
                    fromAccountId: Number(event.target.value)
                })}
                required
                className="rounded border px-3 py-2"
            >
                <option value="">
                    移動元
                </option>
                {fromAccountOptions.map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </select>
            <select
                value={line.toAccountId ?? ""}
                onChange={(event) => onChange({
                    ...line,
                    toAccountId: Number(event.target.value)
                })}
                required
                className="rounded border px-3 py-2"
            >
                <option value="">
                    移動先
                </option>
                {toAccountOptions.map((account) => (
                    <option key={account.id} value={account.id}>
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
                    onChange({...line, amount: value});
                }}
                placeholder="金額"
                required
                className="w-full rounded border px-3 py-2"
            />
        </div>
    )
}
