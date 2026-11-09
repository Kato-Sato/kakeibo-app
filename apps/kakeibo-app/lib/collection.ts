export function indexById<T extends { id: number }>(
    items: readonly T[],
): ReadonlyMap<number, T> {
    return new Map(items.map((item) => [item.id, item]));
}