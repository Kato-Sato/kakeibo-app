"use client";
import { useEffect, useState } from "react";
import { loadAccounts, Account } from "@/lib/accounts";
import { supabase } from "@/lib/supabase";

type AccountBalance = Account & {
    balance: number;
};

export default function HomePage() {
    const [account_balances, setAccountBalances] = useState<AccountBalance[]>([]);
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState("asset");
    const today = "2026-09-18";

    async function addAccount( // 見直し
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const { error } = await supabase
            .from("accounts")
            .insert({
                name,
                account_type: accountType,
            });

        if (error) {
            alert(error.message);
            return;
        }

        setName("");
        setAccountType("asset");
        setAccountBalances(await loadAccountBalances(today));
    }

    async function loadAccountBalances(date: string) {
        const { data, error } = await supabase
            .rpc("get_account_balances", {
                target_date: date
            });
        if (error) throw error;
        return (data as AccountBalance[]) ?? [];
    }


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
        <div>
            <h1 className="text-2xl font-bold">
                家計簿
            </h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Account追加
                </h2>

                <form
                    onSubmit={addAccount}
                    className="flex gap-2"
                >
                    <input
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="例：財布"
                        required
                        className="flex-1 rounded border px-3 py-2"
                    />

                    <select
                        value={accountType}
                        onChange={(event) =>
                            setAccountType(
                                event.target.value,
                            )
                        }
                        className="rounded border px-3 py-2"
                    >
                        <option value="asset">
                            資産
                        </option>
                        <option value="liability">
                            負債
                        </option>
                        <option value="income">
                            収益
                        </option>
                        <option value="expense">
                            費用
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="rounded bg-black px-4 py-2 text-white"
                    >
                        追加
                    </button>
                </form>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Account一覧
                </h2>

                <ul className="divide-y rounded border">
                    {account_balances.map((account_balance) => {
                        if ( account_balance.account_type !== "asset" ) return;
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
                                    {account_balance.balance}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}