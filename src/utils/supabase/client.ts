import { createBrowserClient } from "@supabase/ssr";
import { env_validation } from "@/utils/env_validation";

export function createBrowserSupabaseClient() {
    // プロジェクトの認証情報を使ってブラウザ上にスーパーベースクライアントを作成する。
    return createBrowserClient(
        env_validation.supabase_url,
        env_validation.supabase_key,
        {
            db: { schema: "public" },
        },
    );
}
