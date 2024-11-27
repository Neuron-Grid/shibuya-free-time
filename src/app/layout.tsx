import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "渋谷フリータイム",
    description: "無料でこんなに楽しめる！渋谷の隠れた魅力を発見",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
