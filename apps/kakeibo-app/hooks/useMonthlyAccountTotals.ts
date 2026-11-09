import { useAsync } from "./useAsync";
import { fetchMonthlyAccountTotals } from "@/repositories/reports";

export function useMonthlyAccountTotals() {
    return useAsync(() => fetchMonthlyAccountTotals(), []);
}