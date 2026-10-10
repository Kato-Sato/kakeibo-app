import { useAccounts } from "@/hooks/useAccounts";
import type { TransactionNode } from "@/domain/transactionGroup";
import LineItem, { TransactionListHeader } from "@/components/TransactionLine";

export default function TransactionList({
    tree,
    accountById
}: {
    tree: TransactionNode[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
}) {
    function renderGroupNodes(tree: TransactionNode[]) {
        return (
            tree.map((node) => {
                return (
                    node.kind === "group"
                        ? (
                            <div key={`group-${node.group.id}`}>
                                <div className="bg-paper px-4 py-2 text-sm font-semibold">
                                    {node.group.description}
                                </div>
                                {renderGroupNodes(node.group.children)}
                            </div>)
                        : (<LineItem key={`line-${node.line.id}`} line={node.line} accountById={accountById} />)
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