import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env_validation } from "@/utils/env_validation";

export async function createServerSupabaseClient() {
    const cookieStore = cookies();
    // 本番環境の場合、secure と sameSite のオプションを追加
    const defaultCookieOptions = process.env.NODE_ENV === "production"
        ? { secure: true, sameSite: "lax" as const }
        : {};

    return createServerClient(
        env_validation.supabase_url,
        env_validation.supabase_key,
        {
            cookies: {
                async getAll() {
                    return (await cookieStore).getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(
                            async ({ name, value, options }) => {
                                const mergedOptions = {
                                    ...options,
                                    ...defaultCookieOptions,
                                };
                                (await cookieStore).set(
                                    name,
                                    value,
                                    mergedOptions,
                                );
                            },
                        );
                    } catch {
                        // setAll メソッドが Server Component から呼び出された場合などは無視できます
                    }
                },
            },
        },
    );
}
