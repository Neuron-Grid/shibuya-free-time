import Loading from "@/app/loading";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import Side from "@/components/partials/Side";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";

export async function layoutgenerateMetadata(): Promise<Metadata> {
    return {
        robots: {
            index: true,
            follow: true,
            nocache: true,
            nosnippet: true,
            noarchive: true,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Suspense fallback={<Loading />}>
                    <body>
                        <Header />
                        <div className="flex flex-col lg:flex-row">
                            <main className="lg:w-3/4">{children}</main>
                            <aside className="lg:w-1/4">
                                <Side />
                            </aside>
                        </div>
                        <Footer />
                    </body>
                </Suspense>
            </ThemeProvider>
        </html>
    );
}
