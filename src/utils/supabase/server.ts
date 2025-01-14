import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env_validation } from "@/utils/env_validation";

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();
    //  ユーザーのセッションを維持するために使用できる、新しく設定されたクッキーでサーバーのスーパーベース・クライアントを作成する。
    return createServerClient(
        env_validation.supabase_url,
        env_validation.supabase_key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // setAll` メソッドが Server Component から呼び出されました。
                        // ミドルウェアがユーザーセッションを更新している場合、このメソッドは無視できます。
                    }
                },
            },
        },
    );
}
