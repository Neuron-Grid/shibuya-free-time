import { createServerSupabaseClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // request.json() はデフォルトでは unknown 型を返すため、明示的に型を指定
        const { email } = (await request.json()) as NewsletterRequestBody;

        // 入力値の検証
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                {
                    status: 400,
                },
            );
        }

        // サーバーサイド用の Supabase クライアントを作成
        const supabase = await createServerSupabaseClient();

        // newsletter_subscribers テーブルに insert
        const { error } = await supabase.from("newsletter_subscribers").insert({
            email,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 成功レスポンスを返却
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: unknown) {
        // catch 節では err が unknown になるため、Error クラスかどうか判定してメッセージを取り出す
        let errorMessage = "An unexpected error occurred.";
        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// リクエストボディの型
interface NewsletterRequestBody {
    email: string;
}
