import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/errors";
import type { Account, AccountBalance, NewAccount, AccountType } from "@/domain/account.ts";

type AccountRow = {
    id: number;
    name: string;
    account_type: AccountType;
    parent_account_id: number | null;
    sort_order: number | null;
};

type AccountBalanceRow = {
    id: number;
    balance: number;
};

function toAccount(row: AccountRow): Account {
    return {
        id: row.id,
        name: row.name,
        accountType: row.account_type,
        parentAccountId: row.parent_account_id,
        sortOrder: row.sort_order,
    };
}

export async function fetchAccounts(): Promise<Account[]> {
    const rows = unwrap(await supabase
        .from("accounts")
        .select("id, name, account_type, parent_account_id, sort_order")
        .order("id")
    ) as AccountRow[];
    return rows.map(toAccount);
}
export async function fetchAccountBalances(date: string): Promise<AccountBalance[]> {
    const rows = unwrap(await supabase
        .rpc("get_account_balances", {target_date: date})
    ) as AccountBalanceRow[];
    return rows.map((row) => ({
        id: row.id,
        balance: Number(row.balance),
    }));
}

export async function createAccount(input: NewAccount): Promise<number> {
    return unwrap(
        await supabase
            .rpc("create_account", {
                p_name: input.name,
                p_account_type: input.accountType,
                p_parent_account_id: input.parentAccountId,
                p_sort_order: input.sortOrder,
            })
    );
}