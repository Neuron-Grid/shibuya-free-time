"use client";

import ColorThemeSelector from "@/components/theme/ColorThemeSelector";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

// 管理者用リンク例
const adminNavLinks: NavLink[] = [{ href: "/admin/dashboard", label: "ダッシュボード" }];

const AdminHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();

    // ハンバーガーメニューの開閉制御
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    // ログアウト処理
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // ログアウト後に管理者ログインページなど任意のページへリダイレクト
        router.push("/admin/login");
    };

    return (
        <header>
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* タイトル（管理者ページの明示） */}
                <div className="flex items-center space-x-6">
                    <Link
                        href="/admin"
                        className="text-light-text dark:text-dark-text font-semibold text-xl"
                    >
                        渋谷フリータイム（管理者ページ）
                    </Link>
                    {/* PC向けナビゲーション */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4">
                            {adminNavLinks.map((link) => (
                                <li key={link.href} className="text-light-text dark:text-dark-text">
                                    <Link
                                        href={link.href}
                                        className="hover:text-light-hover dark:hover:text-dark-hover"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-light-text dark:text-dark-text hover:text-light-hover dark:hover:text-dark-hover"
                                >
                                    ログアウト
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* テーマセレクター + ハンバーガーボタン */}
                <div className="flex items-center space-x-4">
                    <ColorThemeSelector />
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="md:hidden text-light-text dark:text-dark-text hover:text-light-hover dark:hover:text-dark-hover focus:outline-none"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? (
                            <RxCross2 className="h-6 w-6" />
                        ) : (
                            <RxHamburgerMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* モバイルナビゲーションメニュー */}
            {isOpen && (
                <nav
                    id="mobile-menu"
                    className="md:hidden bg-light-background dark:bg-dark-background"
                >
                    <ul className="flex flex-col space-y-2 p-4">
                        {adminNavLinks.map((link) => (
                            <li key={link.href} className="text-light-text dark:text-dark-text">
                                <Link
                                    href={link.href}
                                    className="block hover:text-light-hover dark:hover:text-dark-hover"
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    closeMenu();
                                    handleLogout();
                                }}
                                className="w-full text-left text-light-text dark:text-dark-text hover:text-light-hover dark:hover:text-dark-hover"
                            >
                                ログアウト
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default AdminHeader;

interface NavLink {
    href: string;
    label: string;
}
