// 目的: 環境変数のバリデーションを行う
// 基本的にこのファイルを経由して環境変数を取得する

const env_validation: EnvVariables = {
    newt_space_Uid: process.env.NEXT_NEWT_SPACE_UID as string,
    newt_token: process.env.NEXT_NEWT_API_TOKEN as string,
    newt_api_Type: process.env.NEXT_NEWT_API_TYPE as "cdn" | "api",
    newt_app_Uid: process.env.NEXT_NEWT_APP_UID as string,
    newt_article_Model_Uid: process.env.NEXT_NEWT_ARTICLE_MODEL_UID as string,
    newt_category_Model_Uid: process.env.NEXT_NEWT_CATEGORY_MODEL_UID as string,
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
    newt_space_Uid: string;
    newt_token: string;
    newt_api_Type: "cdn" | "api";
    newt_app_Uid: string;
    newt_article_Model_Uid: string;
    newt_category_Model_Uid: string;
}
