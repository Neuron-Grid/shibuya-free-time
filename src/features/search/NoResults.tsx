import type React from "react";

const NoResults: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col justify-center items-center">
            <h1 className="text-2xl m-0 mb-1 p-0">見つかりませんでした。</h1>
            <p className="text-lg m-0 p-0 text-center">
                見つかりませんでした。他のキーワードで検索してみてください。
            </p>
        </div>
    );
};

export default NoResults;
