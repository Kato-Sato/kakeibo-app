"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
    { href: "/", label: "ホーム" },
    { href: "/transactions", label: "取引" },
    { href: "/reports", label: "月次" }
];

export function HeaderMenu() {
    const pathname = usePathname();

    return (
        <header className="border-b bg-surface">
            <nav className="mx-auto flex max-w-4xl items-center gap-8 px-4 py-3">
                <span className="text-lg font-bold">家計簿</span>
                <ul className="flex gap-4">
                    {MENU_ITEMS.map((item) => {
                        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={
                                        isActive
                                            ? "font-semibold underline underline-offset-4"
                                            : "text-ink-muted hover:text-ink"
                                    }
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}