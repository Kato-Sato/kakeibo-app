import type { PostgrestError } from "@supabase/supabase-js"

export function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}

export function unwrap<T>(res: {data: T | null; error: PostgrestError | null}): T {
    if(res.error) throw new Error(res.error.message);
    if(res.data === null) throw new Error("データが取得できませんでした");
    return res.data;
};