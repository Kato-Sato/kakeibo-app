import { type TransactionLineDetail, getAccountCandidates, TransactionType, TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "@/domain/transaction";
import { Account, getAccountName, AccountNode } from "@/domain/account";
import Amount from "@/components/Amount";
import type { EditLineDraft } from "@/components/TransactionForm/draft";


const ROW_GRID = "grid grid-cols-[1rem_6rem_4rem_minmax(0,1fr)_6rem_6rem_6rem] items-center gap-3 px-4 py-2";

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

export default function LineItem({ line, accountTree, accountById, editing, editDraft, onChange }: {
    line: TransactionLineDetail;
    accountTree: AccountNode[];
    accountById: ReadonlyMap<number, Account>;
    editing: boolean;
    editDraft: EditLineDraft;
    onChange: (id: number, draft: EditLineDraft) => void;
}) {
    const fromAccountName = getAccountName(accountById, line.fromAccountId);
    const toAccountName = getAccountName(accountById, line.toAccountId);
    const fromCandidates = getAccountCandidates(accountTree, editDraft.type, "from");
    const toCandidates = getAccountCandidates(accountTree, editDraft.type, "to");

    function changeType(type: TransactionType) {
        const newFromCandidates = getAccountCandidates(accountTree, type, "from");
        const newToCandidates = getAccountCandidates(accountTree, type, "to");

        const fromAccountId = newFromCandidates.some((account) => account.id === editDraft.fromAccountId) ? editDraft.fromAccountId : null;
        const toAccountId = newToCandidates.some((account) => account.id === editDraft.toAccountId) ? editDraft.toAccountId : null;
        onChange(line.id, {...editDraft, type, fromAccountId, toAccountId});
    }
    function AccountSelect({ value, candidates, onChange }: {
        value: number | null;
        candidates: Account[];
        onChange: (id: number | null) => void;
    }) {
        return (
            <select
                value={value ?? ""}
                onChange={(e) => {
                    const id = e.target.value === "" ? null : Number(e.target.value);
                    onChange(id);
                }}
            >
                <option value="">未選択</option>
                {candidates.map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <div className={ROW_GRID}>
            <div className="size-4"></div>
            <div className="tabular-nums">{line.occurredOn}</div>
            {editing ?
                <select
                    value={editDraft.type}
                    onChange={(e) => changeType(e.target.value as TransactionType)}
                >
                    {TRANSACTION_TYPES.map((key) => (
                        <option key={key} value={key}>
                            {TRANSACTION_TYPE_LABELS[key]}
                        </option>
                    ))}
                </select>
                : <div>{TRANSACTION_TYPE_LABELS[line.type]}</div>
            }
            {editing
                ? <input value={editDraft.description} onChange={(e) => onChange(line.id, {...editDraft, description: e.target.value})} />
                : <div className="truncate">{line.description}</div>
            }
            {editing
                ? <AccountSelect 
                    value={editDraft.fromAccountId}
                    candidates={fromCandidates}
                    onChange={(id) => onChange(line.id, {...editDraft, fromAccountId: id})}
                />
                : <div className="truncate">{fromAccountName}</div>
            }
            {editing
                ? <AccountSelect 
                    value={editDraft.toAccountId}
                    candidates={toCandidates}
                    onChange={(id) => onChange(line.id, {...editDraft, toAccountId: id})}
                />
                : <div className="truncate">{toAccountName}</div>
            }
            {editing
                ? <input type="number" value={editDraft.amount} onChange={(e) => onChange(line.id, {...editDraft, amount: e.target.value})} className="text-right"/>
                : <div className="text-right"><Amount value={line.amount} /></div>
            }
        </div>
    )
}