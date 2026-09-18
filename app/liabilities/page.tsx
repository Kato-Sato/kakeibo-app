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
    }, []);

    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    債務
                </h2>

                <ul className="divide-y rounded border">
                    {account_balances.map((account_balance) => {
                        if ( account_balance.account_type !== "liability" ) return;
                        return (
                            <li
                                key={account_balance.id}
                                className="flex justify-between p-3"
                            >
                                <span>{account_balance.name}</span>
                                <span className="text-gray-500">
                                    {account_balance.account_type}
                                </span>
                                <span>
                                    {account_balance.balance * (-1)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}