import { supabaseClient } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 除外パスの定数
const EXCLUDED_PATHS = ["/admin/login", "/admin/logout"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ログイン・ログアウトページはミドルウェア処理を除外
    const isExcluded = EXCLUDED_PATHS.some((excludePath) => pathname.startsWith(excludePath));
    if (isExcluded) {
        return NextResponse.next();
    }

    // Cookieからトークンを取得
    const accessToken = request.cookies.get("supabase-auth-token")?.value;
    if (!accessToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // トークン検証
    const {
        data: { user },
        error,
    } = await supabaseClient.auth.getUser(accessToken);

    if (error || !user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 有効なトークンであれば次へ
    return NextResponse.next();
}

export const config = {
    // /admin以下すべてに適用
    matcher: "/admin/:path*",
};
