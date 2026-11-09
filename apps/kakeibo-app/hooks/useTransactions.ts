import { useAsync } from "./useAsync";
import { fetchTransactions, fetchTransactionLineDetails, fetchTransactionGroups } from "@/repositories/transactions";
import { TransactionFilter } from "@/domain/transaction";

export function useTransactions(filter: TransactionFilter) {
    return useAsync(
        () => fetchTransactions(filter),
        [filter.startDate, filter.endDate, filter.accountId]
    );
}

export function useTransactionLineDetails(filter: TransactionFilter) {
    return useAsync(
        () => fetchTransactionLineDetails(filter),
        [filter.startDate, filter.endDate, filter.types, filter.accountId]
    );
}
export function useTransactionGroups() {
    return useAsync(fetchTransactionGroups, []);
}