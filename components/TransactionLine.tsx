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

export default function LineItem({ line, accountById, editor }: {
    line: TransactionLineDetail;
    accountById: ReadonlyMap<number, Account>;
    editor?: {
        draft: EditLineDraft;
        accountTree: AccountNode[];
        onChange: (draft: EditLineDraft) => void;
    }
}) {

    return (
        <div className={ROW_GRID}>
            <div className="size-4"></div>
            <div className="tabular-nums">{line.occurredOn}</div>
            {editor
                ? <LineEditCells editor={editor} />
                : <LineViewCells line={line} accountById={accountById} />
            }
        </div>
    )
}

function LineEditCells({ editor }: {
    editor: {
        draft: EditLineDraft,
        accountTree: AccountNode[],
        onChange: (draft: EditLineDraft) => void 
    }
}) {
    const fromCandidates = getAccountCandidates(editor.accountTree, editor.draft.type, "from");
    const toCandidates = getAccountCandidates(editor.accountTree, editor.draft.type, "to");

    function changeType(type: TransactionType) {
        const newFromCandidates = getAccountCandidates(editor.accountTree, type, "from");
        const newToCandidates = getAccountCandidates(editor.accountTree, type, "to");

        const fromAccountId = newFromCandidates.some((account) => account.id === editor.draft.fromAccountId) ? editor.draft.fromAccountId : null;
        const toAccountId = newToCandidates.some((account) => account.id === editor.draft.toAccountId) ? editor.draft.toAccountId : null;
        editor.onChange({...editor.draft, type, fromAccountId, toAccountId});
    }

    return (
        <>
            <select
                value={editor.draft.type}
                onChange={(e) => changeType(e.target.value as TransactionType)}
            >
                {TRANSACTION_TYPES.map((key) => (
                    <option key={key} value={key}>
                        {TRANSACTION_TYPE_LABELS[key]}
                    </option>
                ))}
            </select>
            <input value={editor.draft.description} onChange={(e) => editor.onChange({...editor.draft, description: e.target.value})} />
            <AccountSelect 
                value={editor.draft.fromAccountId}
                candidates={fromCandidates}
                onChange={(id) => editor.onChange({...editor.draft, fromAccountId: id})}
            />
            <AccountSelect 
                value={editor.draft.toAccountId}
                candidates={toCandidates}
                onChange={(id) => editor.onChange({...editor.draft, toAccountId: id})}
            />
            <input type="number" value={editor.draft.amount} onChange={(e) => editor.onChange({...editor.draft, amount: e.target.value})} className="text-right"/>
            
        </>
    )
}

function LineViewCells({ line, accountById }: { line: TransactionLineDetail; accountById: ReadonlyMap<number, Account> }) {
    const fromAccountName = getAccountName(accountById, line.fromAccountId);
    const toAccountName = getAccountName(accountById, line.toAccountId);
    return (
        <>
            <div>{TRANSACTION_TYPE_LABELS[line.type]}</div>
            <div className="truncate">{line.description}</div>
            <div className="truncate">{fromAccountName}</div>
            <div className="truncate">{toAccountName}</div>
            <div className="text-right"><Amount value={line.amount} /></div>
        </>
    )
}