// import { BalanceRecord } from "@/domain/balanceRecord";
import { parseAmount } from "@/lib/amount";
import { NewBalanceRecord } from "@/domain/balanceRecord";  
import { Result, ok, err } from "@/lib/results";

export type BalanceRecordDraft = {
    recordDate: string;
    amount: string;
}

export function draftToBalanceRecord(draft: BalanceRecordDraft): Result<NewBalanceRecord> {
    return ok({
        recordDate: draft.recordDate,
        amount: parseAmount(draft.amount) ?? 0
    } as NewBalanceRecord);
}