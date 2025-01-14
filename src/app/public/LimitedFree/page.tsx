import { createServerSupabaseClient } from "@/utils/supabase/server";

export default async function SpotsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: spots } = await supabase.from("temporary_spots").select("*");

    return (
        <div>
            <h1>Spots</h1>
            <ul>
                {spots?.map((spot) => (
                    <li key={spot.id}>{spot.title}</li>
                ))}
            </ul>
        </div>
    );
}
