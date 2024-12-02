import type { Config } from "tailwindcss";

export default {
    content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        container: {
            center: true,
        },
        extend: {
            backgroundImage: {},
            colors: {
                // ダークモードの色
                dark: {
                    // ダークモードの背景色
                    background: "#252525",
                    // ダークモードのテキスト色
                    text: "#E5E5E5",
                    // ダークモードのアクセント色
                    accent: "#69C0FF",
                    // ダークモードのホバー色
                    hover: "#6b7280",
                },
                // ライトモードの色
                light: {
                    // ライトモードの背景色
                    background: "#F5F5F5",
                    // ライトモードのテキスト色
                    text: "#333333",
                    // ライトモードのアクセント色
                    accent: "#005A9C",
                    // ライトモードのホバー色
                    hover: "#dcdcdc",
                },
                // エラー色
                error: "#FF6B6B",
                // 成功色
                success: "#38D9A9",

                // グレースケール
                grayscale: {
                    50: "#FAFAFA",
                    100: "#F5F5F5", // ライトモードの背景色
                    200: "#E5E5E5", // ダークモードのテキスト色
                    300: "#D4D4D4",
                    400: "#A3A3A3",
                    500: "#737373",
                    600: "#525252",
                    700: "#404040",
                    800: "#333333", // ライトモードのテキスト色
                    900: "#252525", // ダークモードの背景色
                    950: "#1A1A1A",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
