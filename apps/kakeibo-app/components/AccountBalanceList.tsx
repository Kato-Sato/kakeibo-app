import { type BalanceNode } from "@/domain/account";
import Amount from "@/components/Amount";

export default function AccountBalanceList({tree}: {tree: BalanceNode[]}) {
    function renderBalanceNodes(tree: BalanceNode[], depth: number) {
        return (
            <div>
                {tree.map((node) => (
                    <div key={node.id}>
                        <div
                            className={`flex justify-between  py-2 pr-4 ${depth === 0 ? "font-semibold" : "text-ink-muted"}`}
                            style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
                        >
                            <span>{node.name}</span>
                            <Amount value={node.total} />
                        </div>
                        {renderBalanceNodes(node.children, depth+1)}
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="max-w-md divide-y rounded border bg-surface">
            {renderBalanceNodes(tree, 0)}
        </div>
    );
}