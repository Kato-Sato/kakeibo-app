"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactionLineDetails, useTransactionGroups } from "@/hooks/useTransactions";
import { useTransactionEdit } from "@/hooks/useTransactionEdit";
import { buildTransactionTree } from "@/domain/transactionGroup";
import { buildAccountTree } from "@/domain/account";
import EditPanel from "@/components/EditButton";

export default function TransactionsPage() {    
    const accounts = useAccounts();
    const transactions = useTransactionLineDetails({});
    const groups = useTransactionGroups();
    const edit = useTransactionEdit(transactions.data ?? [], transactions.reload);
    const transactionTree = buildTransactionTree(transactions.data ?? [], groups.data ?? []);
    const accountTree = buildAccountTree(accounts.data ?? []);

    return (
        <div>
            <section className="space-y-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <h2 className="text-xl font-semibold">
                        取引一覧
                    </h2>
                    <EditPanel editing={edit.editing} onSave={edit.save} onEdit={edit.startEdit} onCancel={edit.cancelEdit} disabled={edit.saving} />
                </div>
                
                <TransactionForm accounts={accounts.data ?? []} onCreated={() => transactions.reload()}/>
                
                {edit.saveError && <div className="text-red-500">{edit.saveError}</div>}
                <TransactionList
                    transactionTree={transactionTree}
                    accountById={accounts.accountById}
                    edit={edit.editing ? {
                        edits: edit.edits,
                        accountTree,
                        onChange: edit.changeLine
                    } : undefined}
                />
            </section>
        </div>
    );
}