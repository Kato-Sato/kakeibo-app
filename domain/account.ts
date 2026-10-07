export const ACCOUNT_TYPE_LABELS = {
    expense: "費用", income: "収益", asset: "資産", liability: "負債"
} as const;

export type AccountType = keyof typeof ACCOUNT_TYPE_LABELS;
export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]

export type Account = {
    id: number;
    name: string;
    accountType: AccountType;
    parentAccountId: number | null;
    sortOrder: number | null;
};

export type NewAccount = Omit<Account, "id">;
export type AccountBalance = {
    id: number;
    balance: number;
};

export function getAccountName(
    accountById: ReadonlyMap<number, Account>,
    id: number,
): string {
    return accountById.get(id)?.name ?? "（不明な口座）";
}

export function isAsset(account: Pick<Account, "accountType">): boolean {
    return account.accountType === "asset";
}


export type AccountNode = Account & { children: AccountNode[] };

export function buildAccountTree(accounts: Account[]): AccountNode[] {
    const nodes = new Map<number, AccountNode>();
    const roots: AccountNode[] = [];

    for(const account of accounts) nodes.set(account.id, { ...account, children: [] });

    for(const node of nodes.values()) {
        const parent = node.parentAccountId != null ? nodes.get(node.parentAccountId) : undefined;
        if (parent) parent.children.push(node);
        else roots.push(node);
    }
    return roots;
}
export function isLeaf(node: AccountNode): boolean {
    return node.children.length === 0;
}
export function collectChildAccountIds(node: AccountNode): number[] {
    return [node.id, ...node.children.flatMap(collectChildAccountIds)];
}
// ツリーを深さ付きの平らな配列にする（select の字下げ表示などに使う） 後で確認
// export function flattenTree(
//   nodes: readonly AccountNode[],
//   depth = 0,
// ): { node: AccountNode; depth: number }[] {
//   return nodes.flatMap((node) => [
//     { node, depth },
//     ...flattenTree(node.children, depth + 1),
//   ]);
// }

export type BalanceNode = Account & { total: number, children: BalanceNode[] };

export function buildBalanceTree(nodes: AccountNode[], balanceById: ReadonlyMap<number, number>): BalanceNode[] {
    return nodes.map((node) => {
        const children = buildBalanceTree(node.children, balanceById);
        const total = children.reduce((sum, c) => sum + c.total, 0) + (balanceById.get(node.id) ?? 0);
        return { ...node, total, children };
    })
}

export function getAccountCandidates(
    accounts: Account[],
    type: AccountType
): Account[] {
    return accounts.filter((account) => account.accountType === type);
}