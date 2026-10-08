import { TransactionLineDetail } from "./transaction";

export type TransactionGroup = {
    id: number;
    description: string;
    parentGroupId: number | null;
    sortOrder: number | null;
};
export type TransactionNode = 
    | { kind: "group"; group: GroupNode; }
    | { kind: "line"; line: TransactionLineDetail };

export function getGroupDescription(
    groupById: ReadonlyMap<number, TransactionGroup>,
    groupId: number | null,
): string {
    if (groupId === null) return "未分類";
    return groupById.get(groupId)?.description ?? "（不明なグループ）";
}

export type GroupNode = TransactionGroup & { children: TransactionNode[]; };

export function buildTransactionTree(lines: TransactionLineDetail[], groups: TransactionGroup[]): TransactionNode[] {
    const nodes = new Map<number, TransactionLineDetail>();
    const groupNodes = new Map<number, GroupNode>();
    for(const l of lines) nodes.set(l.id, l);
    for (const g of groups)  groupNodes.set(g.id, { ...g, children: [] });

    const roots: TransactionNode[] = [];

    function attach(parentId: number | null, node: TransactionNode) {
        const parent = parentId != null ? groupNodes.get(parentId) : undefined;
        if (parent) parent.children.push(node);
        else roots.push(node);
    }

    for (const g of groupNodes.values()) {
        attach(g.parentGroupId, { kind: "group", group: g });
    }
    for (const l of lines) {
        attach(l.parentGroupId, { kind: "line", line: l });
    }
    
    return roots;
}