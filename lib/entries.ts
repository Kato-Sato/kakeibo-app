import { supabase } from "@/lib/supabase";

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

export type JournalEntry = {
    id: number;
    occurred_on: string;
    description: string;
    postings: Posting[];
};

export async function loadEntries() {
    const { data, error } = await supabase
        .from("journal_entries")
        .select(`
            id,
            occurred_on,
            description,
            postings (
                id,
                amount,
                accounts (
                    name,
                    account_type
                ),
                cards (
                    id,
                    name
                )
            )
        `)
        .order("occurred_on", {
            ascending: false,
        })
        .order("id", {
            ascending: false,
        });
    if (error) throw error;
    return (data ?? []) as unknown as JournalEntry[]; // 型の強制変換
}