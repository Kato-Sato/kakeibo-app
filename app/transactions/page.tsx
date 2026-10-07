"use client";
import { useState } from "react";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";

export default function TransactionsPage() {    
    const accounts = useAccounts();
    const transactions = useTransactions({});
    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm accounts={accounts.data ?? []} onCreated={() => transactions.reload()}/>

                <TransactionList transactions={transactions.data ?? []} accountById={accounts.accountById} />
            </section>
        </div>
    );
}