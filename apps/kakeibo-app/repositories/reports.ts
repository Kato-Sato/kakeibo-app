import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/errors";
import { MonthlyAccountTotal } from "@/domain/monthly";


type MonthlyAccountTotalRow = {
    account_id: number;
    month: string;
    total: number;
}

export async function fetchMonthlyAccountTotals(): Promise<MonthlyAccountTotal[]> {
    const rows = unwrap(
        await supabase.from("monthly_account_totals").select("account_id, month, total")
    ) as MonthlyAccountTotalRow[];
    return rows.map((r) => ({
        accountId: r.account_id,
        month: r.month,
        total: Number(r.total),
    }));
}