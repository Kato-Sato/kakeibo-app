import { type BalanceNode } from "@/domain/account"; 

export default function AccountBalanceList({tree}: {tree: BalanceNode[]}) {
    function renderBalanceNode(t: BalanceNode[]) {
        return (
            <div>
                {t.map((node) => (
                    <div key={node.id} className="ml-4">
                        <div>{node.name}: {node.total}</div>
                        <div>{renderBalanceNode(node.children)}</div>
                    </div>
                ))}
            </div>
        );
    }
    return renderBalanceNode(tree);
}