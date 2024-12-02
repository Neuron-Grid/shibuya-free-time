import { getSpots } from "@/libs/newt";
import type { Spot } from "@/types/newt/spot";

export default async function SpotListPage() {
    const { spots } = await getSpots();

    return (
        <div>
            <h1>スポット一覧</h1>
            <ul>
                {spots.map((spot: Spot) => (
                    <li key={spot._id}>
                        <h2>{spot.title}</h2>
                        <p>{spot.Description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
