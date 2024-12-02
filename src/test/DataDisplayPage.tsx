import { getCategories, getSpots, getTags } from "@/libs/newt";
import ClientDataDisplay from "./ClientDataDisplay";

export default async function DataDisplayPage() {
    const { spots } = await getSpots();
    const tags = await getTags();
    const categories = await getCategories();

    return <ClientDataDisplay spots={spots} tags={tags} categories={categories} />;
}
