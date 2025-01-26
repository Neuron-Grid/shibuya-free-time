import { env_validation } from "@/utils/env_validation";
import { createClient } from "newt-client-js";

// Newtのクライアントを作成
export const newt_client = createClient({
    spaceUid: env_validation.newt_space_uid,
    token: env_validation.newt_token,
    apiType: env_validation.newt_api_type,
});
