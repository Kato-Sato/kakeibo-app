import { formatAmount } from "@/lib/format";
export default function Amount({value}: {value: number}) {
    return (
        <span className={`tabular-nums ${value < 0 ? "text-deficit" : ""}`}>
            {formatAmount(value)}
        </span>
    );
}