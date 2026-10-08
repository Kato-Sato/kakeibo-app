"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactionLineDetails, useTransactionGroups } from "@/hooks/useTransactions";
import { buildTransactionTree } from "@/domain/transactionGroup";

export default function TransactionsPage() {    
    const accounts = useAccounts();
    const transactions = useTransactionLineDetails({});
    const groups = useTransactionGroups();
    const transactionTree = buildTransactionTree(transactions.data ?? [], groups.data ?? []);
    console.log("transactions", transactions.data);
    console.log("transactionTree", transactionTree);
    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm accounts={accounts.data ?? []} onCreated={() => transactions.reload()}/>

                <TransactionList tree={transactionTree} accountById={accounts.accountById} />
            </section>
        </div>
    );
}