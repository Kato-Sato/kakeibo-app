import { useAccounts } from "@/hooks/useAccounts";
import type { TransactionNode } from "@/domain/transactionGroup";
import LineItem from "@/components/TransactionLine";

export default function TransactionList({
    tree,
    accountById
}: {
    tree: TransactionNode[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
}) {
    function renderGroupNode(tree: TransactionNode[]) {
        return (
            tree.map((node) => {
                return (
                    node.kind === "group"
                        ? (
                            <div key={`group-${node.group.id}`} className="grid  items-center rounded border px-4 py-3">
                                <div>
                                    <h3>{node.group.description}</h3>
                                </div>
                                {renderGroupNode(node.group.children)}
                            </div>)
                        : (<LineItem key={`line-${node.line.id}`} line={node.line} accountById={accountById} />)
                )
            })
        );
        
    };
    return renderGroupNode(tree);
}