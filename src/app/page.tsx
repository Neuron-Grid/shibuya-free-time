import Loading from "@/app/loading";
import Footer from "@/components/global/Footer";
import Header from "@/components/global/public_Header";
import Side from "@/components/partials/Side";
import { Suspense } from "react";
import type React from "react";
import "./globals.css";

const MainPage: React.FC = async () => {
    return (
        <body className="min-h-screen flex flex-col">
            <div className="bg-light-background dark:bg-dark-background flex flex-col flex-grow">
                <Suspense fallback={<Loading />}>
                    <Header />
                    <div className="container flex flex-col lg:flex-row flex-grow">
                        <main className="lg:w-3/4 flex-grow">
                            <h1 className="text-4xl">渋谷フリータイム</h1>
                        </main>
                        <aside className="lg:w-1/4">
                            <Side />
                        </aside>
                    </div>
                    <Footer />
                </Suspense>
            </div>
        </body>
    );
};

export default MainPage;
