"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MonthlyEntries from "@/components/MonthlyEntries";
import { MonthlyEntry, SummaryPageType, summary_items } from "@/components/MonthlyEntries";
import { loadAccounts, AccountDetail } from "@/lib/accounts";

export default function SummaryPage() {
    const [summary_page_type, setSummaryPageType] = useState<SummaryPageType>("支出");
    const [monthly_entries, setMonthlyEntries] = useState<MonthlyEntry[]>([]);
    const [accounts, setAccounts] = useState<AccountDetail[]>([]);

    useEffect(() => {
        const loadMonthlyEntries = async () => {
            const {data} = await supabase
                .from("monthly_entries")
                .select("*");
            setMonthlyEntries(data as MonthlyEntry[]);
        };
        
        loadMonthlyEntries().catch((error) => alert(`loadMonthlyEntriesError: ${error instanceof Error ? error.message : String(error)}`));
        loadAccounts().then(setAccounts).catch((error) => alert(`loadAccountsError: ${error instanceof Error ? error.message : String(error)}`));
    }, []);

    return (
        <main>
            <select
                value={summary_page_type}
                onChange={(event) => setSummaryPageType(event.target.value as SummaryPageType)}
                required
                className="w-full rounded border px-3 py-2"
            >
                {Object.keys(summary_items).map((key, index) => (
                    <option key={index} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <MonthlyEntries
                summary_page_type={summary_page_type}
                monthly_entries={monthly_entries}
                accounts={accounts}
            />
        </main>
    );
}