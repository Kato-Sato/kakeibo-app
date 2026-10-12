import { useAccounts } from "@/hooks/useAccounts";
import type { TransactionNode } from "@/domain/transactionGroup";
import LineItem, { TransactionListHeader } from "@/components/TransactionLine";

export default function TransactionList({
    tree, accountById, inEdit, selected, onCheck
}: {
    tree: TransactionNode[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
    inEdit: boolean;
    selected: Set<number>;
    onCheck: (id: number) => void;
}) {
    function renderGroupNodes(tree: TransactionNode[]) {
        return (
            tree.map((node) => {
                return (
                    node.kind === "group"
                        ? (
                            <div key={`group-${node.group.id}`}>
                                <div className="bg-paper px-4 py-2 text-sm font-semibold">
                                    {node.group.name}
                                </div>
                                {renderGroupNodes(node.group.children)}
                            </div>)
                        : (<LineItem
                            key={`line-${node.line.id}`}
                            line={node.line}
                            accountById={accountById}
                            inEdit={inEdit}
                            selected={selected}
                            onCheck={onCheck}
                         />)
                )
            })
        );
        
    };
    return (
        <div className="divide-y rounded border bg-surface">
            <TransactionListHeader />
            {renderGroupNodes(tree)}
        </div>
    );
}