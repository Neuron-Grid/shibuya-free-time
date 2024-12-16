import { getCategories, getSpots, getTags } from "@/libs/newt";
import ClientDataDisplay from "@/test/ClientDataDisplay";

const DataDisplayPage = async () => {
    const { spots } = await getSpots();
    const tags = await getTags();
    const categories = await getCategories();

    return (
        <div className="container">
            <ClientDataDisplay spots={spots} tags={tags} categories={categories} />
        </div>
    );
};

export default DataDisplayPage;
