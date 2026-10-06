import { useAsync } from "./useAsync";
import { fetchTransactions } from "@/repositories/transactions";
import { TransactionFilter } from "@/domain/transaction";

export function useTransactions(filter: TransactionFilter) {
    return useAsync(
        () => fetchTransactions(filter),
        [filter.startDate, filter.endDate, filter.accountId]
    );
}