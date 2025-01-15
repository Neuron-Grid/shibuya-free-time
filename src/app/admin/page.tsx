import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="container">
            <div className="bg-light-background dark:bg-dark-background">
                <h1 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
                    管理者専用ページ
                </h1>
                <p className="mb-4 text-grayscale-500 dark:text-grayscale-200">
                    こちらは管理者専用のページです。
                </p>
                <p className="mb-4 text-grayscale-500 dark:text-grayscale-200">
                    管理者用のログインページは
                    <Link
                        href="/admin/login"
                        className="mx-1 text-light-accent dark:text-dark-accent font-semibold hover:underline"
                    >
                        こちら
                    </Link>
                </p>
            </div>
        </div>
    );
}
