import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: "class",
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
            typography: (theme: PluginAPI["theme"]) => ({
                DEFAULT: {
                    css: {
                        // テーブル関連
                        table: {
                            borderCollapse: "collapse",
                            width: "100%",
                            marginTop: theme("spacing.4"),
                            marginBottom: theme("spacing.4"),
                        },
                        "th, td": {
                            border: `1px solid ${theme("colors.grayscale.300")}`,
                            padding: theme("spacing.2"),
                        },
                        th: {
                            backgroundColor: theme("colors.grayscale.100"),
                            fontWeight: "600",
                        },
                        // チェックボックス
                        'input[type="checkbox"]': {
                            marginRight: theme("spacing.2"),
                            borderColor: theme("colors.grayscale.400"),
                        },
                        // 取り消し線
                        del: {
                            color: theme("colors.grayscale.500"),
                        },
                    },
                },
                // ダークモード時の上書き
                dark: {
                    css: {
                        "--tw-prose-body": theme("colors.dark.text"),
                        "--tw-prose-headings": theme("colors.dark.accent"),
                        "--tw-prose-links": theme("colors.dark.accent"),
                        "--tw-prose-pre-bg": theme("colors.dark.background"),
                        "th, td": {
                            borderColor: theme("colors.grayscale.600"),
                        },
                        th: {
                            backgroundColor: theme("colors.grayscale.800"),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography")({
            className: "prose",
        }),
    ],
} satisfies Config;

export default config;
