import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// 既存定義を再利用
type TemporarySpot = Database["public"]["Tables"]["temporary_spots"]["Row"];

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        // status が "published" のデータのみ絞り込み
        const { data, error } = await supabase
            .from("temporary_spots")
            .select("*")
            .eq("status", "published");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as TemporarySpot[], { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
