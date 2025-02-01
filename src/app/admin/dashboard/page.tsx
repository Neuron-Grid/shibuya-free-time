import Link from "next/link";
import React from "react";

export default function AdminDashboardPage() {
    return (
        <div className="bg-light-background dark:bg-dark-background min-h-screen">
            <div className="container py-8 px-4">
                <h1 className="text-3xl font-bold mb-8 text-light-text dark:text-dark-text">
                    管理者用ダッシュボード
                </h1>

                {/* リソースの管理ページへのリンク一覧をカード風に表示 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                block p-6 rounded bg-light-background text-light-text hover:bg-light-hover dark:bg-dark-background dark:text-dark-text dark:hover:bg-dark-hover hover:shadow-lg transition-shadow
                            `}
                        >
                            <h2 className="text-xl font-semibold mb-2">{link.label}</h2>
                            {/* ここでのテキストカラーは淡めにする例として gray-400 or カスタム定義 */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click to manage {link.label.toLowerCase().replace("manage ", "")}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// リソース管理ページへのリンクを配列で管理
const adminLinks: AdminLink[] = [
    { href: "/admin/dashboard/categories", label: "カテゴリーの管理" },
    { href: "/admin/dashboard/tags", label: "タグの管理" },
    { href: "/admin/dashboard/newsletter-issues", label: "ニュースレターの課題を管理" },
    { href: "/admin/dashboard/newsletter-sends", label: "ニュースレターの送信を管理" },
    {
        href: "/admin/dashboard/newsletter-subscribers",
        label: "ニュースレターのサブスクを管理",
    },
    { href: "/admin/dashboard/temporary-spots", label: "期間限定の記事管理" },
    { href: "/admin/dashboard/photo", label: "写真の管理" },
];

type AdminLink = {
    href: string;
    label: string;
};
