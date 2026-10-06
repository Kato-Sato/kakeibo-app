"use client";
import AccountBalanceList from "@/components/AccountBalanceList";
import AccountForm from "@/components/AccountForm/AccountForm";
import { AsyncView } from "@/components/AsyncView";
import { useAccountBalances } from "@/hooks/useAccounts";
import { today } from "@/domain/date"
import { isAsset } from "@/domain/account";

export default function HomePage() {
    const accountBalances = useAccountBalances(today);
    const assetBalances = accountBalances.data?.filter(isAsset) ?? [];
    return (
        <main>
            <h1 className="text-2xl font-bold">
                家計簿
            </h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Account追加
                </h2>
                <AccountForm onCreated={() => {accountBalances.reload()}}/>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Account一覧
                </h2>
                <AccountBalanceList balances={assetBalances} />
            </section>
        </main>
    );
}