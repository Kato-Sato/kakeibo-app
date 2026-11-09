import { TransactionType, NewTransaction, NewTransactionLine, TransactionLineDetail, NewTransactionGroup } from "@/domain/transaction";
import { parseAmount } from "@/lib/amount";
import { Result, ok, err } from "@/lib/results";

export type TransactionLineDraft = {
    key: string;
    type: TransactionType;
    description: string;
    fromAccountId: number | null;
    toAccountId: number | null;
    amount: string;
};

export type EditLineDraft = Omit<TransactionLineDraft, "key">

export type TransactionDraft = {
    occurredOn: string;
    summary: string;
    lines: TransactionLineDraft[];
};

export type NewGroupDraft = {
    key: string;
    name: string;
    lineIds: ReadonlySet<number>;
};

export function lineToDraft(line: TransactionLineDetail): EditLineDraft {
    return {
        type: line.type,
        description: line.description,
        fromAccountId: line.fromAccountId,
        toAccountId: line.toAccountId,
        amount: line.amount.toString(),
    };
}

export function collectChangedLines(
    edits: ReadonlyMap<number, EditLineDraft>,
    lines: TransactionLineDetail[],
) {
    const res = [];
    const lineMap = new Map<number, TransactionLineDetail>();
    for (const line of lines) {
        lineMap.set(line.id, line);
    }

    for (const [id, draft] of edits.entries()) {
        const original = lineMap.get(id);
        if (!original) continue;
        if (
            original.type !== draft.type ||
            original.description !== draft.description ||
            original.fromAccountId !== draft.fromAccountId ||
            original.toAccountId !== draft.toAccountId ||
            original.amount.toString() !== draft.amount
        ) {
            res.push({ id, draft })
        }
    }
    return res;
}


export function draftToGroups(draft: NewGroupDraft[]): Result<NewTransactionGroup[]> {
    const results = [];
    for (const d of draft) {
        const result = draftToGroup(d);
        if (!result.ok) {
            return err(result.message);
        }
        results.push(result.value);
    }
    return ok(results);
}

export function draftToGroup(d: NewGroupDraft): Result<NewTransactionGroup> {
    // check 処理
    if (!d.name.trim()) {
        return err("グループ名が未入力です");
    }
    if (d.lineIds.size === 0) {
        return err("明細が選択されていません");
    }
    return ok({
        name: d.name.trim(),
        parentGroupId: null,
    } as NewTransactionGroup);
}

export function draftToLine(
    d: TransactionLineDraft | EditLineDraft,
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
        type: d.type,
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
        summary: draft.summary.trim(),
        lines
    } as NewTransaction);
}