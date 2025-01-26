import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = await createServerSupabaseClient();
        const { id } = params;

        const { data, error } = await supabase
            .from("temporary_spots")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
