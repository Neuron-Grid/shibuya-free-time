import { env_validation } from "@/utils/env_validation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env_validation.supabase_url;
const supabaseKey = env_validation.supabase_key;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
