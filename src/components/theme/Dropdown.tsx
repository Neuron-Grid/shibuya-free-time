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
        <div className="relative w-full max-w-full Flexbox">
            {isOpen && <Overlay onClick={closeDropdown} onKeyDown={handleKeyDown} />}

            <div className="relative inline-block text-left">
                <button
                    type="button"
                    className="focus:outline-none flex items-center px-2 py-1"
                    onClick={toggleDropdown}
                >
                    {item.title}
                </button>
                {isOpen && <MenuItems menuItems={menuItems} closeDropdown={closeDropdown} />}
            </div>
        </div>
    );
};

export default Dropdown;

const Overlay: React.FC<OverlayProps> = ({ onClick, onKeyDown }) => (
    <div
        className="fixed inset-0 z-20"
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
    />
);

const MenuItems: React.FC<MenuItemsProps> = ({ menuItems, closeDropdown }) => (
    <div className="absolute top-10 z-30 min-h-24 flex-col py-4 dark:border-gray-500 rounded shadow-lg transition-all flex w-full sm:left-0 sm:w-full md:w-64">
        {menuItems.map((subItem) =>
            subItem.route ? (
                <Link
                    key={subItem.route}
                    href={subItem.route}
                    onClick={closeDropdown}
                    className=" px-4 py-2 flex items-center gap-2 w-full"
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
                    className="text-left px-4 py-2 flex gap-2 w-full"
                >
                    {subItem.title}
                </button>
            ),
        )}
    </div>
);

interface Props {
    item: MenuItem;
}

interface OverlayProps {
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

interface MenuItemsProps {
    menuItems: MenuItem[];
    closeDropdown: () => void;
}
