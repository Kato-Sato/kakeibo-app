import { useState, useMemo } from "react";
// import { draftToLine } from "@/components/TransactionForm/draft";
import { type TransactionLineDetail, getAccountCandidates, TRANSACTION_TYPE_LABELS } from "@/domain/transaction";
import { Account } from "@/domain/account";
import Amount from "@/components/Amount";
import type { AccountNode } from "@/domain/account";
import type { TransactionLineDraft } from "@/components/TransactionForm/draft";

const ROW_GRID = "grid grid-cols-[1rem_6rem_4rem_minmax(0,1fr)_6rem_6rem_6rem] items-center gap-3 px-4 py-2"; // まとめる

export function TransactionListHeader() {
    return (
        <div className={`${ROW_GRID} text-sm text-gray-500`}>
            <div></div>
            <div>日付</div>
            <div>種類</div>
            <div>摘要</div>
            <div>移動元</div>
            <div>移動先</div>
            <div className="text-right">金額</div>
        </div>
    );
}

export default function EditLineItem({ line, accountTree, accountById, onSaved }: {
    line: TransactionLineDetail;
    accountTree: AccountNode[];
    accountById: ReadonlyMap<number, Account>
    onSaved: () => void;
}) {
    const [draft, setDraft] = useState<TransactionLineDraft>();
    // const fromCandidates = useMemo(
    //     () => getAccountCandidates(accountTree, line.type, "from"),
    //     [accountTree, draft.type]
    // );
    // const toCandidates = useMemo(
    //     () => getAccountCandidates(accountTree, line.type, "to"),
    //     [accountTree, draft.type]
    // );
    async function handleSave() {}
    return (
        <div>
            {(<div className={ROW_GRID}>
                <div className="size-4">
                    {/* <input
                        type="checkbox"
                        checked={selected.has(line.id)}
                        onChange={() => onCheck(line.id)}
                        className="size-4 accent-black"
                    /> */}
                </div>
                
                <div className="tabular-nums">{line.occurredOn}</div>
                <div>{TRANSACTION_TYPE_LABELS[line.type]}</div>
                <div className="truncate">{line.description}</div>
                <div className="truncate">{}</div>
                <div className="truncate">{}</div>
                <div className="text-right"><Amount value={line.amount} /></div>
            </div>)}
        </div>
    )
}