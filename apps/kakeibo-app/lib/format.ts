const amountFormatter = new Intl.NumberFormat("ja-JP");

export function formatAmount(amount: number): string {
    return amountFormatter.format(amount);
}
