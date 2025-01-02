"use client";
import { supabaseClient } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                // Supabaseからサインアウト
                await supabaseClient.auth.signOut();
                // Cookieを削除（※他のCookieがあればセキュアに処理できる仕組みを検討）
                document.cookie = "supabase-auth-token=; Max-Age=0; path=/;";
                // ログインページにリダイレクト
                router.replace("/admin/login");
            } catch (error) {
                console.error("Logout error:", error);
            }
        };
        logout();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-lg">ログアウト中...</p>
        </div>
    );
}
