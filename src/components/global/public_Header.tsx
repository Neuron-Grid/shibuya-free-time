"use client";
import ColorThemeSelector from "@/components/theme/ColorThemeSelector";
import Link from "next/link";
import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

const navLinks: NavLink[] = [
    { href: "/public/AlwaysFree", label: "常時無料" },
    { href: "/public/limited-free", label: "期間限定無料" },
];

const public_Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="bg-light-background dark:bg-dark-background">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* サイトタイトルとナビゲーション */}
                <div className="flex items-center space-x-6">
                    <Link
                        className="text-light-text dark:text-dark-text font-semibold text-xl"
                        href="/"
                    >
                        渋谷フリータイム
                    </Link>
                    <nav className="hidden md:block">
                        <ul className="flex space-x-4">
                            {navLinks.map((link) => (
                                <li key={link.href} className="text-light-text dark:text-dark-text">
                                    <Link
                                        href={link.href}
                                        className="hover:text-light-hover dark:hover:text-dark-hover"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* テーマセレクターとハンバーガーメニューボタン */}
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

            {/* キャッチフレーズ */}
            <div className="container mx-auto bg-light-background dark:bg-dark-background py-1 px-4 text-left">
                <p className="text-light-text dark:text-dark-text tracking-wide">
                    無料でこんなに楽しめる！渋谷の隠れた魅力を発見
                </p>
            </div>

            {/* モバイルナビゲーションメニュー */}
            {isOpen && (
                <nav
                    id="mobile-menu"
                    className="md:hidden bg-light-background dark:bg-dark-background"
                >
                    <ul className="flex flex-col space-y-2 p-4">
                        {navLinks.map((link) => (
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
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default public_Header;

interface NavLink {
    href: string;
    label: string;
}
