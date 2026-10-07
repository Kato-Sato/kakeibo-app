"use client";
import { useState, useMemo } from "react";
import { NewTransaction, TransactionType, TRANSACTION_TYPE_RULES, TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS, getAccountCandidates } from "@/domain/transaction";
import { Account, buildAccountTree } from "@/domain/account";
import TransactionLineForm from "./TransactionLineForm";
import { TransactionDraft, TransactionLineDraft, draftToTransaction } from "./draft";
import { createTransaction } from "@/repositories/transactions";
import { toError } from "@/lib/errors";

function createEmptyDraft(): TransactionDraft {
    return {
        occurredOn: "",
        type: "expense",
        summary: "",
        lines: []
    };
}
function createEmptyLineDraft(): TransactionLineDraft {
    return {
        key: crypto.randomUUID(),
        description: "",
        fromAccountId: null,
        toAccountId: null,
        amount: ""
    };
}

export default function TransactionForm({accounts, onCreated}: {accounts: Account[], onCreated: () => void}) {
    const [draft, setDraft] = useState<TransactionDraft>(() => createEmptyDraft());
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const accountTree = buildAccountTree(accounts);
    
    console.log("accountTree", accountTree);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = draftToTransaction({...draft});
        if (!result.ok) {
            setSubmitError(result.message);
            return;
        }

        try {
            await createTransaction(result.value);
            setDraft(createEmptyDraft());
            setSubmitError(null);
            onCreated();
        } catch (err) {
            setSubmitError(toError(err).message);
        }
    }

    const fromCandidates = useMemo(
        () => getAccountCandidates(accountTree, draft.type, "from"),
        [accountTree, draft.type],
    );
    const toCandidates = useMemo(
        () => getAccountCandidates(accountTree, draft.type, "to"),
        [accountTree, draft.type],
    );
    console.log("fromCandidates", fromCandidates);

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded border p-4"
        >
            <input
                type="date"
                value={draft.occurredOn}
                onChange={(e) => setDraft({...draft, occurredOn: e.target.value})}
                required
                className="w-full rounded border px-3 py-2"
            />

            <select
                value={draft.type}
                onChange={(e) => setDraft({...draft, type: e.target.value as TransactionType})}
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
                type="text"
                value={draft.summary}
                onChange={(e) => {setDraft((d) => ({...d, summary: e.target.value}))}}
                placeholder="概要"
                required
                className="w-full rounded border px-3 py-2"
            />

            {draft.lines.map((line) => (
                <TransactionLineForm
                    key={line.key}
                    line={line}
                    fromAccountOptions={fromCandidates}
                    toAccountOptions={toCandidates}
                    onChange={(next) => {setDraft((d) => ({
                        ...d,
                        lines: d.lines.map((l) => (l.key === next.key ? next : l))
                    }))}}
                />
            ))}
            
            
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => {
                        draft.lines.push(createEmptyLineDraft());
                        setDraft({...draft});
                    }}
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