"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactionLineDetails, useTransactionGroups } from "@/hooks/useTransactions";
import { buildTransactionTree } from "@/domain/transactionGroup";
import EditButton from "@/components/EditButton";

export default function TransactionsPage() {    
    const accounts = useAccounts();
    const transactions = useTransactionLineDetails({});
    const groups = useTransactionGroups();
    const transactionTree = buildTransactionTree(transactions.data ?? [], groups.data ?? []);
    const [selected, setSelected] = useState(new Set<number>());
    const [inEdit, setInEdit] = useState(false);
    console.log("transactions", transactions.data);
    console.log("transactionTree", transactionTree);
    return (
        <div>
            <section className="space-y-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <h2 className="text-xl font-semibold">
                        取引一覧
                    </h2>
                    <EditButton inEdit={inEdit} onClick={() => {
                        setInEdit(!inEdit);
                        if(!inEdit) setSelected(new Set());
                    }}/>
                </div>
                

                {
                // !inEdit && 
                <TransactionForm accounts={accounts.data ?? []} onCreated={() => transactions.reload()}/>}

                <TransactionList
                    tree={transactionTree}
                    accountById={accounts.accountById}
                    inEdit={inEdit}
                    selected={selected}
                    onCheck={(id: number) => {
                        setSelected((prev) => {
                            const newSet = new Set(prev);
                            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                            return newSet;
                        });
                    }}
                />
            </section>
        </div>
    );
}