import { transaction_type_conditions, JournalEntry, TransactionType } from "@/lib/entries";

export function JournalEntryComponent({ entry }: { entry: JournalEntry }) {
    const transaction_lines = entry.transaction_lines;
    const total_amount = transaction_lines.reduce((sum, line) => sum + line.amount, 0);
    const len = transaction_lines.length;
    // 続き この辺りの調整 summaryの表示
    return (
        <div key={entry.id}>
            {(len > 0) && (<div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px_80px] items-center rounded border px-4 py-3">
                <div>{entry.occurred_on}</div>
                <div></div> {/* trasactiontype */}
                <div>{entry.summary}</div>
                <div></div> {/* category */}
                <div></div> {/* fromaccount */}
                <div></div> {/* toaccount */}
                <div className="text-right">{total_amount}</div>
            </div>)}
            <div>
                {transaction_lines.map((line) => {
                    const from_account_type = line.from_account?.account_type ?? "asset";
                    const to_account_type = line.to_account?.account_type ?? "asset";
                    let type = "";
                    let category = "";
                    const from_account = line.from_account?.name ?? "";
                    const to_account = line.to_account?.name ?? "";

                    const matched_type = (Object.keys(transaction_type_conditions) as TransactionType[]).find((type) => {
                        const condition = transaction_type_conditions[type];
                        return condition.from === from_account_type && condition.to === to_account_type;
                    });
                    const condition = matched_type ? transaction_type_conditions[matched_type] : {
                        from: from_account_type,
                        to: to_account_type,
                        getCategory: () => "その他",
                        hideFrom: false,
                        hideTo: false
                    };
                    type = matched_type ?? "その他";
                    category = condition.getCategory(from_account, to_account);

                    return (
                        <div
                            key={line.id}
                            className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] items-center rounded border px-4 py-3"
                        >
                            <div>{type}</div>
                            <div>{line.description}</div>
                            <div>{category}</div>
                            <div>{condition.hideFrom ? "" : from_account}</div>
                            <div>{condition.hideTo ? "" : to_account}</div>
                            <div className="text-right">{line.amount}</div>
                        </div>
                    );
                })}
            </div>
            
        </div>
    )
}