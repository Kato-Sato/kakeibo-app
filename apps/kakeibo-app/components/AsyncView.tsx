export function AsyncView<T>({ state, children }: {
    state: { data?: T; error: Error | null; loading: boolean; reload: () => void };
    children: (data: T) => React.ReactNode;
}) {
    if(state.error) return (
        <p className="text-red-600">
            読み込みに失敗しました: {state.error.message}
            <button onClick={state.reload} className="ml-2 underline">再試行</button>
        </p>
    );
    if(state.loading || state.data === undefined) return <p>読み込み中...</p>;
    return <>{children(state.data)}</>;
}