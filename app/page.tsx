"use client";
import { useMemo } from "react";
import AccountBalanceList from "@/components/AccountBalanceList";
import AccountForm from "@/components/AccountForm/AccountForm";
import { AsyncView } from "@/components/AsyncView";
import { useAccounts, useAccountBalances } from "@/hooks/useAccounts";
import { today } from "@/domain/date"
import { isAsset, buildAccountTree, buildBalanceTree } from "@/domain/account";

export default function HomePage() {
    const accounts = useAccounts();
    const balances = useAccountBalances(today);
    const assetTree = useMemo(() => {
        const balanceById = new Map((balances.data ?? []).map((b) => [b.id, b.balance]));
        const assets = (accounts.data ?? [])//.filter(isAsset);
        return buildBalanceTree(buildAccountTree(assets), balanceById);
    }, [accounts.data, balances.data]);
    return (
        <div>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    口座追加
                </h2>
                <AccountForm accounts={accounts.data ?? []} onCreated={() => {accounts.reload(); balances.reload(); }}/>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    口座一覧
                </h2>
                <AccountBalanceList tree={assetTree} />
            </section>
        </div>
    );
}