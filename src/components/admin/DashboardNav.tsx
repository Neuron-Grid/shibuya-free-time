"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard Home", href: "/dashboard" },
    { name: "Categories", href: "/dashboard/categories" },
    { name: "Tags", href: "/dashboard/tags" },
    { name: "Temporary Spots", href: "/dashboard/temporary-spots" },
  ];

  return (
    <nav>
      <ul className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded hover:bg-gray-100 ${
                  active ? "bg-gray-100 font-bold" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
