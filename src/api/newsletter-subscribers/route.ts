import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type NewsletterSubscriber =
    Database["public"]["Tables"]["newsletter_subscribers"]["Row"];
type NewsletterSubscriberInsert =
    Database["public"]["Tables"]["newsletter_subscribers"]["Insert"];
type NewsletterSubscriberUpdate =
    Database["public"]["Tables"]["newsletter_subscribers"]["Update"];

// CREATE (POST)
export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const body = (await request.json()) as NewsletterSubscriberInsert;

        const { data, error } = await supabase
            .from("newsletter_subscribers")
            .insert(body)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const createdSubscriber = data as NewsletterSubscriber;
        return NextResponse.json(createdSubscriber, { status: 201 });
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
        const { data, error } = await supabase
            .from("newsletter_subscribers")
            .select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data as NewsletterSubscriber[], {
            status: 200,
        });
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
        const body = (await request.json()) as
            & { id?: string }
            & NewsletterSubscriberUpdate;

        const { id, ...rest } = body;
        if (!id) {
            return NextResponse.json(
                { error: "Missing 'id' for update." },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("newsletter_subscribers")
            .update(rest)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const updatedSubscriber = data as NewsletterSubscriber;
        return NextResponse.json(updatedSubscriber, { status: 200 });
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
            .from("newsletter_subscribers")
            .delete()
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const deletedSubscriber = data as NewsletterSubscriber;
        return NextResponse.json(deletedSubscriber, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
