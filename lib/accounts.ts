import { supabase } from "@/lib/supabase";

export type Account = {
    id: number;
    name: string;
    account_type: string;
    parent_account_id: number | null;
    sort_order: number;
};

export type AccountBalance = Account & {
    balance: number;
};

export const today = "2026-09-18";

export async function loadAccounts() {
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, account_type, parent_account_id, sort_order")
        .order("id");
    if (error) throw error;
    return (data as Account[]) ?? [];
}

export async function loadAccountBalances(date: string) {
    const { data, error } = await supabase
        .rpc("get_account_balances", {
            target_date: date
        });
    if (error) throw error;
    return (data as AccountBalance[]) ?? [];
}