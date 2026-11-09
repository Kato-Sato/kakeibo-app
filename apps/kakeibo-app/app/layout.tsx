import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderMenu } from "@/components/HeaderMenu";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "家計簿",
    description: "個人用家計簿アプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="ja"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-paper text-ink">
                <HeaderMenu />
                <main className="mx-auto w-full max-w-4xl flex-1 space-y-10 px-4 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}
