import { TransactionType, NewTransaction, NewTransactionLine, parseAmount } from "@/domain/transaction";
import { Account } from "@/domain/account";
import { Result, ok, err } from "@/lib/results";

export type TransactionLineDraft = {
    key: string;
    description: string;
    fromAccountId: number | null;
    toAccountId: number | null;
    amount: string;
};

export type TransactionDraft = {
    occurredOn: string;
    type: TransactionType;
    summary: string;
    lines: TransactionLineDraft[];
};


function draftToLine(
    d: TransactionLineDraft
    // type: TransactionType,
    // accountById: ReadonlyMap<number, Account>,
): Result<NewTransactionLine> {
    const amount = parseAmount(d.amount);
    if (amount === null) return err("金額が正しくありません");
    if (d.fromAccountId === null || d.toAccountId === null) return err("口座が未選択です");
    if (d.fromAccountId === d.toAccountId) return err("口座が同じです");

    // const from = accountById.get(d.fromAccountId);
    // const to = accountById.get(d.toAccountId);
    // if (!from || !to) return err("存在しない科目が選択されています");
    // if (!isAccountAllowed(type, "from", from) || !isAccountAllowed(type, "to", to)) {
    //     return err("取引種別に合わない科目が選択されています");
    // }

    return ok({
        description: d.description.trim(),
        fromAccountId: d.fromAccountId,
        toAccountId: d.toAccountId,
        amount,
    } as NewTransactionLine);
}

export function draftToTransaction(
    draft: TransactionDraft,
    // accountById: ReadonlyMap<number, Account>,
): Result<NewTransaction> {
    if (!draft.occurredOn) return err("日付が未入力です");
    if (draft.lines.length === 0) return err("明細がありません");

    const lines: NewTransactionLine[] = [];
    for (const [i, d] of draft.lines.entries()) {
        const result = draftToLine(d);
        if (!result.ok) return err(`${i + 1}行目：${result.message}`);
        lines.push(result.value);
    }

    return ok({
        occurredOn: draft.occurredOn,
        type: draft.type,
        summary: draft.summary.trim(),
        lines
    } as NewTransaction);
}