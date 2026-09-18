import { supabase } from "@/lib/supabase";

export type MonthlyExpense = {
    month: string;
    account_id: number;
    account_name: string;
    amount: number;
};

export async function loadExpenses() {
    const { data, error } = await supabase
        .from("monthly_expenses")
        .select('*')
    if (error) throw error;
    return data ?? []
}