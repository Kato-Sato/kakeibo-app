import { supabase } from "@/lib/supabase";

export type Account = {
    id: number;
    name: string;
    account_type: string;
    parent_account_id: number | null;
    sort_order: number;
};

export async function loadAccounts() {
    const { data, error } = await supabase
        .from("accounts")
        .select("id, name, account_type, parent_account_id, sort_order")
        .order("id");
    if (error) throw error;
    return (data as Account[]) ?? [];
}
