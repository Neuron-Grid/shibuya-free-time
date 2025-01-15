import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type NewsletterSend = Database["public"]["Tables"]["newsletter_sends"]["Row"];
type NewsletterSendInsert = Database["public"]["Tables"]["newsletter_sends"]["Insert"];
type NewsletterSendUpdate = Database["public"]["Tables"]["newsletter_sends"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as NewsletterSendInsert;

        const { data, error } = await supabase
            .from("newsletter_sends")
            .insert(body)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const createdSend = data as NewsletterSend;
        return NextResponse.json(createdSend, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// READ (GET)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("newsletter_sends").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as NewsletterSend[], { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// UPDATE (PATCH)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as { id?: string } & NewsletterSendUpdate;

        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' for update." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("newsletter_sends")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const updatedSend = data as NewsletterSend;
        return NextResponse.json(updatedSend, { status: 200 });
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
            .from("newsletter_sends")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const deletedSend = data as NewsletterSend;
        return NextResponse.json(deletedSend, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
