"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactionLineDetails, useTransactionGroups } from "@/hooks/useTransactions";
import { useTransactionEdit } from "@/hooks/useTransactionEdit";
import { buildTransactionTree } from "@/domain/transactionGroup";
import { buildAccountTree } from "@/domain/account";
import EditPanel from "@/components/EditPanel";

export default function TransactionsPage() {    
    const accounts = useAccounts();
    const transactions = useTransactionLineDetails({});
    const groups = useTransactionGroups();
    const edit = useTransactionEdit(transactions.data ?? [], () => {transactions.reload(); groups.reload();});
    const transactionTree = buildTransactionTree(transactions.data ?? [], groups.data ?? []);
    const accountTree = buildAccountTree(accounts.data ?? []);

    return (
        <div>
            <section className="space-y-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <h2 className="text-xl font-semibold">
                        取引一覧
                    </h2>
                </div>
                
                <TransactionForm accounts={accounts.data ?? []} onCreated={() => transactions.reload()}/>
                
                <EditPanel
                    editing={edit.editing}
                    setGroupName={edit.setGroupName}
                    onGroup={edit.groupSelected}
                    onSave={edit.save}
                    onCancel={edit.cancelEdit}
                    onEdit={edit.startEdit}
                    onReload={() => {transactions.reload(); groups.reload();}}
                    disabled={edit.saving}
                />
                {edit.saveError && <div className="text-red-500">{edit.saveError}</div>}
                <TransactionList
                    transactionTree={transactionTree}
                    accountById={accounts.accountById}
                    edit={edit.editing ? {
                        edits: edit.edits,
                        selected: edit.selected,
                        toggleSelect: edit.toggleSelect,
                        accountTree,
                        onChange: edit.changeLine
                    } : undefined}
                />
            </section>
        </div>
    );
}