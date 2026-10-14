"use client";
import BalanceRecordForm from "@/components/BalanceRecordForm/BalanceRecordForm";
import BalanceRecordList from "@/components/BalanceRecordList";
import { useBalanceRecords } from "@/hooks/useBalanceRecords";

export default function BalanceRecordsPage() {
    const balanceRecords = useBalanceRecords();
    return (
        <div>
            <h2 className="text-xl font-semibold">
                残高記録
            </h2>
            <BalanceRecordForm onCreated={() => {}} />
            <BalanceRecordList balanceRecords={balanceRecords.data ?? []} />
        </div>
    );
}