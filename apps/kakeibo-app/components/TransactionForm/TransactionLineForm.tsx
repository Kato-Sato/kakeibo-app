import { useState, useMemo } from "react";
import { TransactionType, getAccountCandidates, TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "@/domain/transaction";
import type { TransactionLineDraft } from "./draft";
import type { Account, AccountNode } from "@/domain/account";

export default function TransactionLineForm({line, accountTree, onChange, onRemove}: {
    line: TransactionLineDraft;
    accountTree: AccountNode[];
    onChange: (next: TransactionLineDraft) => void;
    onRemove: () => void;
}) {
    const fromCandidates = useMemo(
        () => getAccountCandidates(accountTree, line.type, "from"),
        [accountTree, line.type]
    );
    console.log("fromCandidates", fromCandidates);
    const toCandidates = useMemo(
        () => getAccountCandidates(accountTree, line.type, "to"),
        [accountTree, line.type]
    );
    return (
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] items-center gap-3">
            <select
                value={line.type}
                onChange={(e) => {
                    onChange({...line, type: e.target.value as TransactionType});
                }}
                required
                className="w-full rounded border px-3 py-2"
            >
                {TRANSACTION_TYPES.map((key, index) => (
                    <option key={index} value={key}>
                        {TRANSACTION_TYPE_LABELS[key]}
                    </option>
                ))}
            </select>
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
                {fromCandidates.map((account) => (
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
                {toCandidates.map((account) => (
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
                    onChange({...line, amount: event.target.value});
                }}
                placeholder="金額"
                required
                className="w-full rounded border px-3 py-2"
            />
            <button
                onClick={onRemove}
                type="button"
                className="flex size-10 items-center justify-center rounded border px-3 py-2 bg-danger text-white cursor-pointer"
            >消</button>
        </div>
    )
}