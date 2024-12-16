import { getCategories, getSpots, getTags } from "@/libs/newt";
import ClientDataDisplay from "@/test/ClientDataDisplay";

export default async function DataDisplayPage() {
    const { spots } = await getSpots();
    const tags = await getTags();
    const categories = await getCategories();

    return (
        <div className="container">
            <ClientDataDisplay spots={spots} tags={tags} categories={categories} />
        </div>
    );
}
