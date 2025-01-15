// 目的: 環境変数のバリデーションを行う
// 基本的にこのファイルを経由して環境変数を取得する

const env_validation: EnvVariables = {
    newt_space_uid: process.env.NEXT_NEWT_SPACE_UID as string,
    newt_token: process.env.NEXT_NEWT_API_TOKEN as string,
    newt_api_type: process.env.NEXT_NEWT_API_TYPE as "cdn" | "api",
    newt_app_uid: process.env.NEXT_NEWT_APP_UID as string,
    google_map_api: process.env.NEXT_GOOGLE_MAP_API as string,
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    supabase_key: process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
};

const validateEnvVariables = (env: EnvVariables): void => {
    const missingVars = Object.entries(env)
        .filter(([, value]) => value === undefined || value === "")
        .map(([key]) => key);
    if (missingVars.length > 0) {
        console.error(`Error: Missing or invalid environment variables: ${missingVars.join(", ")}`);
        process.exit(1);
    }
};

// 環境変数のバリデーションを実行
validateEnvVariables(env_validation);

// 環境変数をエクスポート
export { env_validation };

interface EnvVariables {
    newt_space_uid: string;
    newt_token: string;
    newt_api_type: "cdn" | "api";
    newt_app_uid: string;
    google_map_api: string;
    supabase_url: string;
    supabase_key: string;
}
