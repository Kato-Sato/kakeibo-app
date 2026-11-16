import { useCallback, useEffect, useState } from "react";
import { toError } from "@/lib/errors"

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fn()
            .then((d) => { if(!cancelled) { setData(d); setError(null); } })
            .catch((e) => { if(!cancelled) setError(toError(e)); })
            .finally(() => { if(!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [...deps, version]);

    const reload = useCallback(() => setVersion((v) => v+1), []);
    return { data, error, loading, reload };
}