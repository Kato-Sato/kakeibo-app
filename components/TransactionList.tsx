"use client";
import { useState } from "react";import { useAccounts } from "@/hooks/useAccounts";
import type { TransactionNode } from "@/domain/transactionGroup";
import type { AccountNode } from "@/domain/account";
import LineItem, { TransactionListHeader } from "@/components/TransactionLine";
import { type EditLineDraft, lineToDraft, collectChangedLines, draftToLine } from "@/components/TransactionForm/draft";

export default function TransactionList({
    transactionTree, accountTree, accountById, editing, edits, onChange
}: {
    transactionTree: TransactionNode[];
    accountTree: AccountNode[];
    accountById: ReturnType<typeof useAccounts>["accountById"];
    editing: boolean;
    edits: Map<number, EditLineDraft>;
    onChange: (id: number, draft: EditLineDraft) => void;
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
                        accountTree={accountTree}
                        accountById={accountById}
                        editing={editing}
                        editDraft={edits.get(node.line.id) ?? lineToDraft(node.line)}
                        onChange={onChange}
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