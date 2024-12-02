import Side from "@/components/partials/Side";
import { getCategories, getTags } from "@/libs/newt";
import DataDisplayPage from "@/test/DataDisplayPage";

export default async function Page() {
    const tags = await getTags();
    const categories = await getCategories();

    return (
        <div className="container">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-3/4">
                    <DataDisplayPage />
                </div>
                <div className="lg:w-1/4">
                    <Side tags={tags} categories={categories} />
                </div>
            </div>
        </div>
    );
}
