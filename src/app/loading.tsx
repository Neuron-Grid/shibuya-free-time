import type React from "react";

const Loading: React.FC = () => {
    return (
        <div className="mt-12 flex items-center justify-center gap-6" aria-label="Loading">
            <div className="size-10 animate-spin rounded-full border-[5px] border-sky-400 border-t-transparent" />
            <p className="text-[30px] font-bold">Loading</p>
        </div>
    );
};

export default Loading;
