"use client";
import { useEffect, useState } from "react";
import { loadAccounts, loadAccountBalances, Account, AccountBalance, today } from "@/lib/accounts";
import { supabase } from "@/lib/supabase";



export default function LiabilitiesPage() {
    const [account_balances, setAccountBalances] = useState<AccountBalance[]>([]);
    useEffect(() => {
        const load = async () => {
            const [account_balances] = await Promise.all([
                loadAccountBalances(today)
            ]);
            setAccountBalances(account_balances);
        }
        void load();
    }, [account_balances]);

    return (
        <div>hello</div>
    );
}