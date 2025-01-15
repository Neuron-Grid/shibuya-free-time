import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Rowデータを使うために Category をエイリアスとして扱う
type Category = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        // request.json() の結果に対し CategoryInsert としてアサーション
        const body = (await request.json()) as CategoryInsert;

        // バリデーションは必要に応じて追加
        const payload: CategoryInsert = body;

        const { data, error } = await supabase
            .from("categories")
            .insert(payload)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 作成されたレコードを Category 型でキャスト
        const createdCategory = data as Category;
        return NextResponse.json(createdCategory, { status: 201 });
    } catch (error: unknown) {
        // error は unknown 型なので、Error の場合のみ message を取得
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// READ (GET)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("categories").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 配列で取得した結果を Category[] 型でキャスト
        const categories = data as Category[];
        return NextResponse.json(categories, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// UPDATE (PATCH)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        // PATCH の場合は id が含まれるオブジェクトが送られてくるので、
        // それを CategoryUpdate とマージした型にアサーション
        const body = (await request.json()) as { id?: string } & CategoryUpdate;

        const { id, ...rest } = body;
        const payload: CategoryUpdate = rest;

        if (!id) {
            return NextResponse.json(
                { error: "Missing 'id' for update." },
                {
                    status: 400,
                },
            );
        }

        const { data, error } = await supabase
            .from("categories")
            .update(payload)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 更新後のレコードを Category 型でキャスト
        const updatedCategory = data as Category;
        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// DELETE (DELETE)
export async function DELETE(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "Missing 'id' for delete." },
                {
                    status: 400,
                },
            );
        }

        const { data, error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 削除されたレコードを Category 型でキャスト
        const deletedCategory = data as Category;
        return NextResponse.json(deletedCategory, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
