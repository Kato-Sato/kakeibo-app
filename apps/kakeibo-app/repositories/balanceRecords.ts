import { BalanceRecord, NewBalanceRecord } from "@/domain/balanceRecord";
import { unwrap } from "@/lib/errors";
import { supabase } from "@/lib/supabase";

type BalanceRecordRow = {
    id: number;
    record_date: string;
    amount: number;
};

export async function fetchBalanceRecords(): Promise<BalanceRecord[]> {
    const rows = unwrap(await supabase
            .from("balance_records")
            .select("id, record_date, amount")
            .order("record_date", { ascending: false })
        ) as BalanceRecordRow[];
        return rows.map((row) => {
            return {
                id: row.id,
                recordDate: row.record_date,
                amount: Number(row.amount)
            };
        });
}

export async function createBalanceRecord(input: NewBalanceRecord): Promise<number> {
    return unwrap(
        await supabase.rpc("create_balance_record", {
            p_record_date: input.recordDate,
            p_amount: input.amount
        })
    );
}