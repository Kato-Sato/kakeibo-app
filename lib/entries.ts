import { supabase } from "@/lib/supabase";
import { Account, AccountType } from "@/lib/accounts";

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

export type TransactionType = "支出" | "収入" | "振替" | "カード支出" | "借入" | "返済";

export const transaction_type_conditions: Record<
    TransactionType,
    { 
        from: AccountType;
        to: AccountType;
        getCategory: (from: string, to: string) => string;
        hideFrom: boolean;
        hideTo: boolean
    }
> = {
    支出: {
        from: "asset",
        to: "expense",
        getCategory: (_, to) => to,
        hideFrom: false,
        hideTo: true
    },
    収入: {
        from: "income",
        to: "asset",
        getCategory: (from, _) => from,
        hideFrom: true,
        hideTo: false
    },
    振替: {
        from: "asset",
        to: "asset",
        getCategory: (from, to) => "",
        hideFrom: false,
        hideTo: false
    },
    カード支出: {
        from: "liability",
        to: "expense",
        getCategory: (_, to) => to,
        hideFrom: true,
        hideTo: true
    },
    借入: {
        from: "liability",
        to: "asset",
        getCategory: (from, _) => from,
        hideFrom: true,
        hideTo: true
    },
    返済: {
        from: "asset",
        to: "liability",
        getCategory: (_, to) => to,
        hideFrom: true,
        hideTo: true
    }
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

export type Filter = {
    id?: number;
    from_date?: string;
    to_date?: string;
    transaction_types?: TransactionType[];
    involved_account_id?: number;
}

export async function loadEntries(filter: Filter = {}) {
    let query =supabase
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
                    id,
                    name,
                    account_type
                ),
                to_account:accounts!to_account_id (
                    id,
                    name,
                    account_type
                ),
                amount
            )
        `);
    if(filter.id != null) query = query.eq("id", filter.id);
    if(filter.from_date) query = query.gte("occurred_on", filter.from_date);
    if(filter.to_date) query = query.lt("occurred_on", filter.to_date);
    /*
    if(filter.transaction_types && filter.transaction_types.length > 0) {
        filter.transaction_types.map((transaction_type) => {
            const condition = transaction_type_conditions[transaction_type];
            query = query.or(`transaction_lines.from_account.account_type.eq.${condition.from}, transaction_lines.to_account.account_type.eq.${condition.to}`, {referencedTable: "transaction_lines"});
        });
        const condition = transaction_type_conditions[filter.transaction_type];
        query = query
            .eq("transaction_lines.from_account.account_type", condition.from)
            .eq("transaction_lines.to_account.account_type", condition.to);
    }*/
    if(filter.involved_account_id != null) query = query.or(`from_account_id.eq.${filter.involved_account_id}, to_account_id.eq.${filter.involved_account_id}`, {referencedTable: "transaction_lines"});
    query = query
        .order("occurred_on", {ascending: false})
        .order("id", {ascending: false});
    const { data, error } = await query

    if (error) {
        alert(`loadEntriesError: ${error.message}`);
        return [];
    }
    return (data as unknown as JournalEntry[]); // 型の強制変換
}