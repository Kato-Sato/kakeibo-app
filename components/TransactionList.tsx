"use client";
import { useEffect, useState } from "react";
import { loadEntries, Filter, JournalEntry } from "@/lib/entries";
import { JournalEntryComponent } from "@/components/JournalEntry";

export default function TransactionList({filter}: {filter: Filter}) { // refreshKey 実装
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        const load = async () => {
            const [entries] = await Promise.all([
                loadEntries(filter)
            ]);
            setEntries(entries);
        }
        void load().catch((error) => alert(error instanceof Error ? error.message : String(error)));
    }, [filter]);
    return (
        <div className="space-y-2">
            {entries.map((entry) => {
                return <JournalEntryComponent key={entry.id} entry={entry} />;
            })}
        </div>
    );
}