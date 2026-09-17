"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Account = {
    id: number;
    name: string;
    account_type: string;
    parent_account_id: number | null;
    initial_balance: number;
    sort_order: number;
};

export default function HomePage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState("asset");

    async function loadAccounts() {
        const { data, error } = await supabase
            .from("accounts")
            .select(
                "id, name, account_type, parent_account_id, initial_balance, sort_order",
            )
            .order("account_type")
            .order("sort_order");
        if (error) {
            alert(error.message);
            return;
        }
        setAccounts(data ?? []);
    }

    async function addAccount(
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
        await loadAccounts();
    }

    useEffect(() => {
        void Promise.all([
            loadAccounts()
        ]);
    }, []);

    return (
        <main className="mx-auto max-w-3xl space-y-10 p-8">
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
                    {accounts.map((account) => (
                        <li
                            key={account.id}
                            className="flex justify-between p-3"
                        >
                            <span>{account.name}</span>
                            <span className="text-gray-500">
                                {account.account_type}
                            </span>
                            <span>
                                {account.initial_balance}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}