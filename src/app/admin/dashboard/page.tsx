import Link from "next/link";
import React from "react";

export default function AdminDashboardPage() {
    // リソース管理ページへのリンクを配列で管理
    const adminLinks: AdminLink[] = [
        { href: "/admin/dashboard/categories", label: "Manage Categories" },
        { href: "/admin/dashboard/tags", label: "Manage Tags" },
        { href: "/admin/dashboard/newsletter-issues", label: "Manage Newsletter Issues" },
        { href: "/admin/dashboard/newsletter-sends", label: "Manage Newsletter Sends" },
        { href: "/admin/dashboard/newsletter-subscribers", label: "Manage Newsletter Subscribers" },
        { href: "/admin/dashboard/temporary-spots", label: "Manage Temporary Spots" },
    ];

    return (
        <div className="container">
            <div className="py-8 px-4 bg-light-background dark:bg-dark-background min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-light-text dark:text-dark-text">
                    Admin Dashboard
                </h1>

                {/* リソースの管理ページへのリンク一覧をカード風に表示 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block p-6 rounded dark:bg-dark.hover dark:text-dark-text hover:shadow-lg transition-shadow dark:hover:bg-dark.hover"
                        >
                            <h2 className="text-xl font-semibold mb-2">{link.label}</h2>
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

// リンク先と表示文字列をまとめた型を用意
type AdminLink = {
    href: string;
    label: string;
};
