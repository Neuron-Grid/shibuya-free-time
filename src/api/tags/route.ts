import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Rowデータを使うために Tag をエイリアスとして扱う
type Tag = Database["public"]["Tables"]["tags"]["Row"];
type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as TagInsert;

        // 必要に応じてバリデーション
        const payload: TagInsert = body;

        const { data, error } = await supabase
            .from("tags")
            .insert(payload)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // 作成されたレコードを Tag 型でキャスト
        const createdTag = data as Tag;
        return NextResponse.json(createdTag, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// READ (GET)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("tags").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const tags = data as Tag[];
        return NextResponse.json(tags, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// UPDATE (PATCH)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as { id?: string } & TagUpdate;

        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json(
                { error: "Missing 'id' for update." },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("tags")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const updatedTag = data as Tag;
        return NextResponse.json(updatedTag, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
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
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("tags")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const deletedTag = data as Tag;
        return NextResponse.json(deletedTag, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
