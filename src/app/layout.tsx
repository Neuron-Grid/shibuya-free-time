import Loading from "@/app/loading";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: "渋谷フリータイム",
    description: "無料でこんなに楽しめる！渋谷の隠れた魅力を発見",
    keywords: ["渋谷", "フリータイム", "無料", "格安", "休憩"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <Suspense fallback={<Loading />}>
                <body>
                    <Header />
                    <div className="h-4" />
                    {children}
                    <div className="h-4" />
                    <Footer />
                </body>
            </Suspense>
        </html>
    );
}
