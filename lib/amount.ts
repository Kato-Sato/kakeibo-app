export function parseAmount(raw: string): number | null {
    const n = Number(raw.trim());
    return Number.isInteger(n) && n > 0 ? n : null;
}