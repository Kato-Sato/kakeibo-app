import type { Account } from "@/domain/account";
import type { MonthlyAccountTotal, AccountMonth } from "@/domain/reports";

export default function ReportsTable({accounts, totals, onSelect}: {
    accounts: Account[]
    totals: MonthlyAccountTotal[]
    onSelect: (accountMonth: AccountMonth | null) => void;
}) {

    const months = Array.from(
        new Set(
            totals.map(
                (monthlyAccountTotal) => monthlyAccountTotal.month
            )
        )
    ).sort((a, b) => b.localeCompare(a));

    const amountMap = new Map<string, number>();
    for(const monthlyAccountTotal of totals) {
        const key = `${monthlyAccountTotal.month}:${monthlyAccountTotal.accountId}`;
        amountMap.set(key, monthlyAccountTotal.total);
    }

    function getAmount(month: string, account_id: number) {
        const key = `${month}:${account_id}`;
        return (amountMap.get(key)) ?? 0
    }

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="border p-2">月</th>
                        {accounts.map((account) => {
                            return (
                                <th key={account.id} className="border p-2">
                                    {account.name}
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {months.map((month) => {
                        return (
                            <tr key={month}>
                                <td className="border p-2">{month}</td>
                                {accounts.map((account) => {
                                    return (
                                        <td key={account.id} className="border p-2" onClick={() => onSelect({ month, accountId: account.id })}>
                                            {getAmount(month, account.id)}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}