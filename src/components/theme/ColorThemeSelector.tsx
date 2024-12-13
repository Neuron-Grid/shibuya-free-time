"use client";

import Dropdown from "@/components/theme/Dropdown";
import type { MenuItem } from "@/types/MenuItem";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoMdDesktop } from "react-icons/io";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const Placeholder: React.FC = () => (
    <div className="rounded border p-2">
        <div className="size-6" />
    </div>
);

const getCurrentThemeIcon = (resolvedTheme: string | undefined) => {
    switch (resolvedTheme) {
        case "light":
            return <MdOutlineLightMode className="text-xl" />;
        case "dark":
            return <MdOutlineDarkMode className="text-xl" />;
        default:
            return <IoMdDesktop className="text-xl" />;
    }
};

const generateMenuItems = (setTheme: (theme: string) => void): MenuItem[] => {
    const createMenuItem = (id: string, Icon: React.ElementType, label: string) => ({
        Dropdown_id: id,
        title: (
            <div className="flex items-center gap-x-2 md:gap-x-4 lg:gap-x-6">
                <Icon className="text-xl md:text-2xl lg:text-3xl" />
                <span className="text-center hidden sm:inline md:text-sm lg:text-base xl:text-lg">{label}</span>
            </div>
        ),
        onClick: () => setTheme(id),
    });

    return [
        createMenuItem("light", MdOutlineLightMode, "Light"),
        createMenuItem("dark", MdOutlineDarkMode, "Dark"),
        createMenuItem("system", IoMdDesktop, "System"),
    ];
};

const ColorThemeSelector: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Placeholder />;
    }

    const currentThemeIcon = getCurrentThemeIcon(resolvedTheme);
    const menuItems = generateMenuItems(setTheme);

    const dropdownItem: MenuItem = {
        Dropdown_id: "theme-selector",
        title: currentThemeIcon,
        children: menuItems,
    };

    return (
        <div className="relative w-full max-w-full px-4 flex justify-between gap-2">
            <Dropdown item={dropdownItem} />
        </div>
    );
};

export default ColorThemeSelector;
