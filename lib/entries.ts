import { supabase } from "@/lib/supabase";
import { Account } from "@/lib/accounts";

export type Posting = {
    id: number;
    amount: number;
    accounts: {
        name: string;
        account_type: string;
    } | "";
    cards: {
        id: number;
        name: string;
    } | null;
};

export type TransactionLine = {
    id: number;
    journal_entry_id: number;
    description: string;
    from_account: Account | null;
    to_account: Account | null;
    amount: number;
};

export type JournalEntry = {
    id: number;
    occurred_on: string;
    summary: string;
    transaction_lines: TransactionLine[];
};

export async function loadEntries() {
    const { data, error } = await supabase
        .from("journal_entries")
        .select(`
            id,
            occurred_on,
            summary,
            transaction_lines (
                id,
                journal_entry_id,
                description,
                from_account:accounts!from_account_id (
                    name,
                    account_type
                ),
                to_account:accounts!to_account_id (
                    name,
                    account_type
                ),
                amount
            )
        `)
        .order("occurred_on", {
            ascending: false,
        })
        .order("id", {
            ascending: false,
        });
    if (error) {
        alert(`loadEntriesError: ${error.message}`);
        return [];
    }
    return (data as unknown as JournalEntry[]); // 型の強制変換
}