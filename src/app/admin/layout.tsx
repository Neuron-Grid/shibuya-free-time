import { ThemeProvider } from "next-themes";
import type React from "react";
import "../globals.css";
import AdminHeader from "@/components/admin/admin_header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <body>
                    <AdminHeader />
                    <main>{children}</main>
                </body>
            </ThemeProvider>
        </html>
    );
}
