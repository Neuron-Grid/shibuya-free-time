"use client";

import type { MenuItem } from "@/types/MenuItem";
import Link from "next/link";
import type React from "react";
import { useCallback, useState } from "react";

const Dropdown: React.FC<Props> = ({ item }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuItems = item?.children || [];

    const toggleDropdown = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            closeDropdown();
        }
    };

    return (
        <div className="relative w-full max-w-full">
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40"
                    onClick={closeDropdown}
                    onKeyDown={handleKeyDown}
                    role="button"
                    tabIndex={0}
                />
            )}

            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="hover:text-blue-400 focus:outline-none flex items-center px-2 py-1"
                    onClick={toggleDropdown}
                >
                    {item.title}
                </button>
                <div
                    className={`absolute top-10 z-30 min-h-24 flex-col py-4 bg-zinc-400 rounded-md shadow-lg transition-all duration-300 
                    ${isOpen ? "flex" : "hidden"}
                    w-full sm:left-0 sm:w-full md:w-64`}
                >
                    {menuItems.map((subItem) =>
                        subItem.route ? (
                            <Link
                                key={subItem.route}
                                href={subItem.route}
                                onClick={closeDropdown}
                                className="hover:bg-zinc-300 hover:text-zinc-500 px-4 py-2 flex items-center gap-2 w-full"
                            >
                                {subItem.title}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                key={subItem.Dropdown_id}
                                onClick={() => {
                                    if (subItem.onClick) subItem.onClick();
                                    closeDropdown();
                                }}
                                className="text-left hover:bg-zinc-300 hover:text-zinc-500 px-4 py-2 flex items-center gap-2 w-full"
                            >
                                {subItem.title}
                            </button>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;

interface Props {
    item: MenuItem;
}