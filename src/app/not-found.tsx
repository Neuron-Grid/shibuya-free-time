import Link from "next/link";
import type React from "react";

const NotFound: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl">404 Not Found</h1>
                <p className="mt-4 text-lg">お探しのページは見つかりませんでした。</p>
                <Link
                    href="/"
                    className="mt-6 inline-block rounded bg-blue-600 px-6 py-3 text-lg font-semibold text-dark-text transition duration-300 ease-in-out hover:bg-blue-700"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
