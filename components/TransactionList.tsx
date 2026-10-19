import { useAccounts } from "@/hooks/useAccounts";
import type { TransactionNode } from "@/domain/transactionGroup";
import type { AccountNode } from "@/domain/account";
import LineItem, { TransactionListHeader } from "@/components/TransactionLine";
import { type EditLineDraft, lineToDraft } from "@/components/TransactionForm/draft";

export type TransactionListEdit = {
    edits: ReadonlyMap<number, EditLineDraft>;
    selected: ReadonlySet<number>;
    toggleSelect: (id: number) => void;
    accountTree: AccountNode[];
    onChange: (id: number, draft: EditLineDraft) => void;
};

export default function TransactionList({
    transactionTree, accountById, edit
}: {
    transactionTree: TransactionNode[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
    edit?: TransactionListEdit;
}) {

    function renderGroupNodes(tree: TransactionNode[]) {
        return (
            tree.map((node) => {
                if(node.kind === "group") return (
                    <div key={`group-${node.group.id}`}>
                        <div className="bg-paper px-4 py-2 text-sm font-semibold">
                            {node.group.name}
                        </div>
                        {renderGroupNodes(node.group.children)}
                    </div>
                )
                else return (
                    <LineItem
                        key={`line-${node.line.id}`}
                        line={node.line}
                        accountById={accountById}
                        editor={edit && {
                            selected: edit.selected.has(node.line.id),
                            onToggleSelect: () => edit.toggleSelect(node.line.id),
                            draft: edit.edits.get(node.line.id) ?? lineToDraft(node.line),
                            accountTree: edit.accountTree,
                            onChange: (draft) => edit.onChange(node.line.id, draft)
                        }}
                    />
                );
            })
        );
        
    };
    return (
        <div className="divide-y rounded border bg-surface">
            <TransactionListHeader />
            {renderGroupNodes(transactionTree)}
        </div>
    );
}