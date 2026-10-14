import { useState } from "react";
import { Account } from "@/domain/account";
import { BalanceRecordDraft } from "@/components/BalanceRecordForm/draft";
import { draftToBalanceRecord } from "@/components/BalanceRecordForm/draft";
import { createBalanceRecord } from "@/repositories/balanceRecords";
import { toError } from "@/lib/errors";
import { today } from "@/domain/date";
import { SUBMIT_BUTTON_CLASS } from "@/components/formStyle";

function createEmptyDraft(): BalanceRecordDraft {
    return {
        recordDate: today,
        amount: ""
    }
}

export default function BalanceRecordForm({onCreated}: {
    onCreated: () => void;
}) {
    const [draft, setDraft] = useState<BalanceRecordDraft>(createEmptyDraft());
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = draftToBalanceRecord({...draft});
        if (!result.ok) {
            setSubmitError(result.message);
            return;
        }

        try {
            await createBalanceRecord(result.value);
            setDraft(createEmptyDraft());
            setSubmitError(null);
            onCreated();
        } catch (err) {
            setSubmitError(toError(err).message);
        }
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="rounded border p-4"
            >
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={draft.recordDate}
                        onChange={(e) => setDraft({...draft, recordDate: e.target.value})}
                        required
                        className="w-full rounded border px-3 py-2"
                    />
                    <input
                        type="number"
                        value={draft.amount}
                        onChange={(e) => setDraft({...draft, amount: e.target.value})}
                        required
                        placeholder="残高"
                        className="w-full rounded border px-3 py-2"
                    />
                </div>
                <button type="submit" className={SUBMIT_BUTTON_CLASS}>記録</button>
            </form>
        </div>
    );
}