import { useAsync } from "./useAsync";
import { fetchBalanceRecords } from "@/repositories/balanceRecords";


export function useBalanceRecords() {
    return useAsync(fetchBalanceRecords, []);
}