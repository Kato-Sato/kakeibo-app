"use client";
import { useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { loadAccounts, Account } from "@/lib/accounts";
import { loadEntries, JournalEntry } from "@/lib/entries";
import { loadCards, Card } from "@/lib/cards";

export default function TransactionsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        const load = async () => {
            const [accounts, entries, cards] = await Promise.all([
                loadAccounts(),
                loadEntries(),
                loadCards()
            ]);
            setAccounts(accounts);
            setEntries(entries);
            setCards(cards);
        }
        void load().catch((error) => alert(error instanceof Error ? error.message : String(error)));
    }, []);

    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    取引一覧
                </h2>

                <TransactionForm
                    accounts={accounts}
                    cards={cards}
                    onCreated={async () => {
                        try {
                            setEntries(await loadEntries());
                        } catch (error) {
                            alert(`onCreatedError: ${error instanceof Error ? error.message : String(error)}`);
                        }
                    }}
                />

                <TransactionList filter={{involved_account_id: 1}}/>
            </section>
        </div>
    );
}