import { supabase } from "@/lib/supabase";

export type AccountType = "asset" | "liability" | "income" | "expense";

export type Account = {
    id: number;
    name: string;
    account_type: AccountType;
};

export type AccountDetail = Account & {
    parent_account_id: number | null;
    sort_order: number;
}

export type AccountBalance = Account & {
    balance: number;
};

export const today = "3000-01-01";

export async function loadAccounts() {
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, account_type, parent_account_id, sort_order")
        .order("id");
    if (error){
        alert(`loadAccountsError: ${error.message}`);
        return [];
    }
    return (data as AccountDetail[]) ?? [];
}

export async function loadAccountBalances(date: string) {
    const { data, error } = await supabase
        .rpc("get_account_balances", {
            target_date: date
        });
    if (error){
        alert(`loadAccountBalancesError: ${error.message}`);
        return [];
    }
    return (data as AccountBalance[]) ?? [];
}