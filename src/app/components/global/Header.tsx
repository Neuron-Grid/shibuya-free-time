"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

const navLinks: NavLink[] = [
    { href: "always-free", label: "常時無料" },
    { href: "limited-free", label: "期間限定無料" },
];

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <header className="bg-light-background dark:bg-dark-background">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* サイトタイトル */}
                <div className="flex-shrink-0">
                    <h1 className="text-light-text dark:text-dark-text font-semibold text-xl">
                        渋谷フリータイム
                    </h1>
                </div>

                {/* デスクトップナビゲーション */}
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

                {/* モバイルメニューボタン */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className="text-light-text dark:text-dark-text hover:text-light-hover dark:hover:text-dark-hover focus:outline-none"
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
                <p className="text-light-text dark:text-dark-text text-sm tracking-wide">
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

export default Header;

interface NavLink {
    href: string;
    label: string;
}
