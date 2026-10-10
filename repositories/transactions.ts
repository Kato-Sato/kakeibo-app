import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/errors";
import type { Transaction, TransactionType, TransactionLine, TransactionLineDetail, NewTransaction, TransactionFilter } from "@/domain/transaction";
import type { TransactionGroup } from "@/domain/transactionGroup";
import { truncate } from "node:fs";


type TransactionRow = {
    id: number;
    occurred_on: string;
    type: string;
    summary: string;
    transaction_lines: {
        id: number;
        description: string;
        from_account_id: number;
        to_account_id: number;
        amount: number;
        group_id: number | null;
    }[];
};

type TransactionLineDetailRow = {
    id: number;
    description: string;
    from_account_id: number;
    to_account_id: number;
    transaction_id: number;
    amount: number;
    transaction_group_id: number | null;
    transactions: {
        occurred_on: string;
        type: string;
        summary: string;
    };
}

type TransactionGroupRow = {
    id: number;
    description: string;
    parent_group_id: number | null;
}

export async function fetchTransactions(filter: TransactionFilter): Promise<Transaction[]> {
    const query = supabase
        .from("transactions")
        .select(`
            id,
            occurred_on,
            type,
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
        type: row.type as TransactionType,
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
                amount: line.amount
            }))
        })
    );
}


export async function fetchTransactionLineDetails(filter: TransactionFilter): Promise<TransactionLineDetail[]> {
    const rows = unwrap(await supabase
        .from("transaction_lines")
        .select(`
            id,
            description,
            from_account_id,
            to_account_id,
            transaction_id,
            amount,
            transaction_group_id,
            transactions (
                occurred_on,
                type,
                summary
            )
        `)
        .order("occurred_on", {ascending: false, referencedTable: "transactions"})
    ) as unknown as TransactionLineDetailRow[];
    rows.sort((a, b) =>
        b.transactions.occurred_on.localeCompare(
            a.transactions.occurred_on
        )
    );
    return rows.map((row) => ({
        transactionId: row.transaction_id,
        occurredOn: row.transactions.occurred_on,
        type: row.transactions.type as TransactionType,
        summary: row.transactions.summary,
        id: row.id,
        description: row.description,
        fromAccountId: row.from_account_id,
        toAccountId: row.to_account_id,
        amount: row.amount,
        parentGroupId: row.transaction_group_id
    })) as TransactionLineDetail[];
}
export async function fetchTransactionGroups(): Promise<TransactionGroup[]> {
    const rows = unwrap(await supabase
        .from("transaction_groups")
        .select("*")
    ) as unknown as TransactionGroupRow[];
    return rows.map((row) => ({
        id: row.id,
        description: row.description,
        parentGroupId: row.parent_group_id
    })) as TransactionGroup[];
}