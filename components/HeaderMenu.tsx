// "use client";

export function HeaderMenu() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <ul>
                <li className="inline-block mr-4">
                    <a href="/" className="hover:underline">ホーム</a>
                </li>
                <li className="inline-block mr-4">
                    <a href="/transactions" className="hover:underline">取引</a>
                </li>
                <li className="inline-block mr-4">
                    <a href="/expenses" className="hover:underline">支出</a>
                </li>
                <li className="inline-block mr-4">
                    <a href="/incomes" className="hover:underline">収入</a>
                </li>
                <li className="inline-block mr-4">
                    <a href="/liabilities" className="hover:underline">債務</a>
                </li>
            </ul>
        </header>
    );
}