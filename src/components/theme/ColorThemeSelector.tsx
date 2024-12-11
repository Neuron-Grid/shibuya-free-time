"use client";

import Dropdown from "@/components/theme/Dropdown";
import type { MenuItem } from "@/types/MenuItem";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMdDesktop } from "react-icons/io";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ColorThemeSelector = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="rounded border p-2 dark:border-gray-500">
                <div className="size-6" />
            </div>
        );
    }

    const currentThemeIcon =
        resolvedTheme === "light" ? (
            <MdOutlineLightMode className="text-xl" />
        ) : resolvedTheme === "dark" ? (
            <MdOutlineDarkMode className="text-xl" />
        ) : (
            <IoMdDesktop className="text-xl" />
        );

    const menuItems: MenuItem[] = [
        {
            Dropdown_id: "light",
            title: (
                <>
                    <MdOutlineLightMode className="text-lg" />
                    <span className="ml-2">Light</span>
                </>
            ),
            onClick: () => setTheme("light"),
        },
        {
            Dropdown_id: "dark",
            title: (
                <>
                    <MdOutlineDarkMode className="text-lg" />
                    <span className="ml-2">Dark</span>
                </>
            ),
            onClick: () => setTheme("dark"),
        },
        {
            Dropdown_id: "system",
            title: (
                <>
                    <IoMdDesktop className="text-lg" />
                    <span className="ml-2">System</span>
                </>
            ),
            onClick: () => setTheme("system"),
        },
    ];

    const dropdownItem: MenuItem = {
        Dropdown_id: "theme-selector",
        title: currentThemeIcon,
        children: menuItems,
    };

    return (
        <div className="relative w-full max-w-full px-4">
            <Dropdown item={dropdownItem} />
        </div>
    );
};

export default ColorThemeSelector;