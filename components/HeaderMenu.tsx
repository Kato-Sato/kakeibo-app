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
                    <a href="/reports" className="hover:underline">月次</a>
                </li>
            </ul>
        </header>
    );
}