"use client";
import { useState, useMemo } from "react";
import { createAccount } from "@/repositories/accounts";
import { Account, AccountType, ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, getAccountCandidates } from "@/domain/account";
import { draftToAccount, type AccountDraft } from "./draft";
import { toError } from "@/lib/errors";
import { INPUT_CLASS, LABEL_CLASS, SUBMIT_BUTTON_CLASS } from "@/components/formStyle";

function createEmptyDraft(): AccountDraft {
    return {
        name: "",
        accountType: "asset",
        parentAccountId: null,
        sortOrder: 10,
    };
}

export default function AccountForm({ accounts, onCreated }: { accounts: Account[]; onCreated: () => void }) {
    const [draft, setDraft] = useState<AccountDraft>(() => createEmptyDraft());
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const parentCandidates = useMemo(
        () => getAccountCandidates(accounts, draft.accountType),
        [accounts, draft.accountType]
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = draftToAccount({...draft});
        if (!result.ok) {
            setSubmitError(result.message);
            return;
        }
        setSubmitting(true);
        try {
            await createAccount(result.value);
            setDraft(createEmptyDraft());
            setSubmitError(null);
            onCreated();
        } catch (err) {
            setSubmitError(toError(err).message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded border bg-surface p-4"
        >
            <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_10rem_auto]">
                <label className="block">
                    <span className={LABEL_CLASS}>口座名</span>
                    <input
                        value={draft.name}
                        onChange={(event) => setDraft({...draft, name: event.target.value})}
                        placeholder="口座名"
                        required
                        className={INPUT_CLASS}
                    />
                </label>
                <label className="block">
                    <span className={LABEL_CLASS}>種類</span>
                    <select
                        value={draft.accountType}
                        onChange={(event) => {
                            setDraft({
                                ...draft,
                                accountType: event.target.value as AccountType,
                                parentAccountId: null
                            })
                        }}
                        className={INPUT_CLASS}
                    >
                        {ACCOUNT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {ACCOUNT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className={LABEL_CLASS}>並び順</span>
                    <select
                        value={draft.parentAccountId ?? ""}
                        onChange={(event) => setDraft({...draft, parentAccountId: event.target.value ? Number(event.target.value) : null})}
                        className={INPUT_CLASS}
                    >
                        <option value="">親口座</option>
                        {parentCandidates.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    type="submit"
                    disabled={submitting}
                    className={SUBMIT_BUTTON_CLASS}
                >
                    {submitting ? "追加中…" : "追加"}
                </button>
            </div>
            {submitError && (
                <p role="alert" className="text-sm text-danger">
                    {submitError}
                </p>
            )}
        </form>
    );
}