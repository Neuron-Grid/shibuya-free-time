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
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AdminHeader />
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
