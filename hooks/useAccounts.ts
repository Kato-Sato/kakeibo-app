import { useMemo } from "react";
import { fetchAccounts, fetchAccountBalances } from "@/repositories/accounts";
import { useAsync } from "./useAsync";
import { indexById } from "@/lib/collection";

export function useAccounts() {
    const state = useAsync(fetchAccounts, []);
    const accountById = useMemo(
        () => indexById(state.data ?? []),
        [state.data],
    );
    return { ...state, accountById };
}

export function useAccountBalances(today: string) { // 日付型あとでつくる
    return useAsync(() => fetchAccountBalances(today), []);
}