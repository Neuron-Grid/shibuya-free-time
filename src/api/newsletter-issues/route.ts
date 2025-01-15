import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type NewsletterIssue = Database["public"]["Tables"]["newsletter_issues"]["Row"];
type NewsletterIssueInsert = Database["public"]["Tables"]["newsletter_issues"]["Insert"];
type NewsletterIssueUpdate = Database["public"]["Tables"]["newsletter_issues"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as NewsletterIssueInsert;

        const { data, error } = await supabase
            .from("newsletter_issues")
            .insert(body)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const createdIssue = data as NewsletterIssue;
        return NextResponse.json(createdIssue, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// READ (GET)
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("newsletter_issues").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as NewsletterIssue[], { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// UPDATE (PATCH)
export async function PATCH(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as { id?: string } & NewsletterIssueUpdate;

        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing 'id' for update." }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("newsletter_issues")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const updatedIssue = data as NewsletterIssue;
        return NextResponse.json(updatedIssue, { status: 200 });
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
            .from("newsletter_issues")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const deletedIssue = data as NewsletterIssue;
        return NextResponse.json(deletedIssue, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
