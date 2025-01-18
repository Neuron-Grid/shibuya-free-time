import Loading from "@/app/loading";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/public_Header";
import Side from "@/components/partials/Side";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import "../globals.css";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <body className="min-h-screen flex flex-col">
                    <div className="bg-light-background dark:bg-dark-background flex flex-col flex-grow">
                        <Suspense fallback={<Loading />}>
                            <Header />
                            <div className="flex flex-col lg:flex-row flex-grow">
                                <main className="lg:w-3/4 flex-grow">{children}</main>
                                <aside className="lg:w-1/4">
                                    <Side />
                                </aside>
                            </div>
                            <Footer />
                        </Suspense>
                    </div>
                </body>
            </ThemeProvider>
        </html>
    );
}
