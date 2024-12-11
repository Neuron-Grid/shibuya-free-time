import { getCategories, getTags } from "@/libs/newt";

export default async function Page() {
    const tags = await getTags();
    const categories = await getCategories();

    return (
        // <div className="container">
        //     <div className="flex flex-col lg:flex-row">
        //         <div className="lg:w-3/4">{/* 無料スポットのまとめ */}</div>
        //         <div className="lg:w-1/4">
        //             <Side tags={tags} categories={categories} />
        //         </div>
        //     </div>
        // </div>
        <div className="container">
            <div className="text-center">
                <h1 className="text-3xl">Main Page</h1>
            </div>
        </div>
    );
}
