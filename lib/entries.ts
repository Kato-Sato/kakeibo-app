import { supabase } from "@/lib/supabase";
import { Account } from "@/lib/accounts";

export type Posting = {
    id: number;
    amount: number;
    accounts: {
        name: string;
        account_type: string;
    } | null;
    cards: {
        id: number;
        name: string;
    } | null;
};

type TransactionLine = {
    id: number;
    description: string;
    amount: number;
    from_account: Account | null;
    to_account: Account | null;
}

export type JournalEntry = {
    id: number;
    occurred_on: string;
    description: string;
    transaction_lines: TransactionLine[];
};

export async function loadEntries() {
    const { data, error } = await supabase
        .from("journal_entries")
        .select(`
            id,
            occurred_on,
            description,
            transaction_lines (
                id,
                description,
                amount,
                from_account:accounts!from_account_id (
                    id,
                    name,
                    account_type
                ),
                to_account:accounts!to_account_id (
                    id,
                    name,
                    account_type
                )
            )
        `)
        .order("occurred_on", {
            ascending: false,
        })
        .order("id", {
            ascending: false,
        });
    if (error) {
        alert(`loadEntries_error: ${error.message}`);
        throw error;
        return [];
    };
    return (data ?? []) as unknown as JournalEntry[];
}