import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: "渋谷フリータイム",
    description: "無料でこんなに楽しめる！渋谷の隠れた魅力を発見",
    robots: {
        index: false,
        follow: false,
        nocache: false,
        nosnippet: false,
        noarchive: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
