import Loading from "@/app/loading";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { Suspense } from "react";
import "./globals.css";
import Side from "@/components/partials/Side";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <Head>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Suspense fallback={<Loading />}>
                    <body className="min-h-screen">
                        <Header />
                        <div className="flex flex-col lg:flex-row">
                            <main className="lg:w-3/4">{children}</main>
                            <aside className="lg:w-1/4">
                                <Side tags={[]} categories={[]} />
                            </aside>
                        </div>
                        <Footer />
                    </body>
                </Suspense>
            </ThemeProvider>
        </html>
    );
}
