"use client";

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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* リソースの管理ページへのリンク一覧 */}
            <ul className="space-y-2">
                {adminLinks.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-blue-600 underline">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// リンク先と表示文字列をまとめた型を用意
type AdminLink = {
    href: string;
    label: string;
};
