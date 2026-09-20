import { supabase } from "@/lib/supabase";

export type Account = {
    id: number;
    name: string;
    account_type: AccountType;
};

export type AccountType = "expense" | "income" | "asset" | "liability";

export type AccountDetail = Account & {
    parent_account_id: number | null;
    sort_order: number;
}

export type AccountBalance = AccountDetail & {
    balance: number;
};

export const today = "2026-09-18";

export async function loadAccounts() {
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, account_type, parent_account_id, sort_order")
        .order("sort_order");
    if (error) throw error;
    return (data as AccountDetail[]) ?? [];
}

export async function loadAccountBalances(date: string) {
    const { data, error } = await supabase
        .rpc("get_account_balances", {
            target_date: date
        });
    if (error) throw error;
    return (data as AccountBalance[]) ?? [];
}