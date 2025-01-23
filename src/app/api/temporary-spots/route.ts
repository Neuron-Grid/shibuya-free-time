import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// 型
type TemporarySpot = Database["public"]["Tables"]["temporary_spots"]["Row"];
type TemporarySpotInsert = Database["public"]["Tables"]["temporary_spots"]["Insert"];
type TemporarySpotUpdate = Database["public"]["Tables"]["temporary_spots"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as TemporarySpotInsert;

        // リクエストボディの型チェック
        const payload: TemporarySpotInsert = body;

        const { data, error } = await supabase
            .from("temporary_spots")
            .insert(payload)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as TemporarySpot, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// READ (GET)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("temporary_spots").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as TemporarySpot[], { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// UPDATE (PATCH)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as { id?: string } & TemporarySpotUpdate;

        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' for update." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("temporary_spots")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as TemporarySpot, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
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
            return NextResponse.json({ error: "Missing 'id' for delete." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("temporary_spots")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as TemporarySpot, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
