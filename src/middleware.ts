import { createServerSupabaseClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

// ミドルウェア適用除外パス
const EXCLUDED_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 除外パスはスキップ
    const isExcluded = EXCLUDED_PATHS.some((exclude) => pathname.startsWith(exclude));
    if (isExcluded) {
        return NextResponse.next();
    }

    // サーバーサイド用のSupabaseクライアントを作成
    // utils/supabase/server.ts 内部で next/headers の cookies() を利用
    const supabase = await createServerSupabaseClient();

    // 3. ユーザー情報を取得 (内部でトークンリフレッシュも実施)
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // ログインしていない or エラーの場合は強制リダイレクト
    if (error || !user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // 正常に認証されていればそのまま処理を進める
    return NextResponse.next();
}

// /admin 以下に対してミドルウェアを適用
export const config = {
    matcher: ["/admin/:path*"],
};
