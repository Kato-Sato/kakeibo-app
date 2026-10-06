export const REPORTS_TYPE_LABELS = {
    expense: "支出",
    income: "収入",
    liability: "債務"
} as const

export type ReportsType = keyof typeof REPORTS_TYPE_LABELS;

export const REPORTS_TYPES = Object.keys(REPORTS_TYPE_LABELS) as ReportsType[];