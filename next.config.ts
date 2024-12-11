import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NEXT_NEWT_SPACE_UID: process.env.NEXT_NEWT_SPACE_UID || "",
        NEXT_NEWT_API_TOKEN: process.env.NEXT_NEWT_API_TOKEN || "",
        NEXT_NEWT_API_TYPE: process.env.NEXT_NEWT_API_TYPE || "cdn",
        NEXT_NEWT_APP_UID: process.env.NEXT_NEWT_APP_UID || "",
        NEXT_GOOGLE_MAP_API: process.env.NEXT_GOOGLE_MAP_API || "",
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "maps.googleapis.com",
            },
            {
                protocol: "https",
                hostname: `${process.env.NEXT_NEWT_SPACE_UID}.assets.newt.so`,
            },
        ],
    },
};

export default nextConfig;
