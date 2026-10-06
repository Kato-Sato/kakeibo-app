import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/errors";
import type { Transaction, TransactionLine, NewTransaction, TransactionFilter } from "@/domain/transaction";
import { constants } from "fs";

type TransactionRow = {
    id: number;
    occurred_on: string;
    summary: string;
    transaction_lines: {
        id: number;
        description: string;
        from_account_id: number;
        to_account_id: number;
        amount: number;
    }[];
};

export async function fetchTransactions(): Promise<Transaction[]> {
    const query = supabase
        .from("transactions")
        .select(`
            id,
            occurred_on,
            summary,
            transaction_lines (
                id,
                transaction_id,
                description,
                from_account_id,
                to_account_id,
                amount
            )
        `)
        .order("occurred_on", {ascending: false})
        .order("id", {ascending: false});
 
    const rows = unwrap(await query) as unknown as TransactionRow[];
    return rows.map((row) => ({
        id: row.id,
        occurredOn: row.occurred_on,
        summary: row.summary,
        lines: row.transaction_lines.map((l) => ({
            id: l.id,
            description: l.description,
            fromAccountId: l.from_account_id,
            toAccountId: l.to_account_id,
            amount: l.amount,
        } as TransactionLine)),
    } as Transaction));
}

export async function createTransaction(input: NewTransaction): Promise<number> {
    return unwrap(
        await supabase.rpc("create_transaction", {
            p_occurred_on: input.occurredOn,
            p_summary: input.summary,
            p_type: input.type,
            p_lines: input.lines.map((line) => ({
                description: line.description,
                from_account_id: line.fromAccountId,
                to_account_id: line.toAccountId,
                amount: line.amount,
            }))
        })
    );
}