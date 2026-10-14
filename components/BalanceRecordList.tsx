import { BalanceRecord } from "@/domain/balanceRecord";
import Amount from "@/components/Amount";

export default function BalanceRecordList({balanceRecords}: { balanceRecords: BalanceRecord[] }) {
    return (
        <div>
            {balanceRecords.map((record) => (
                <div key={record.id} className="flex justify-between border-b py-1">
                    <div className="font-bold">{record.recordDate}</div>
                    <div className="text-right"><Amount value={record.amount} /></div>
                </div>
            ))}
        </div>
    );
}