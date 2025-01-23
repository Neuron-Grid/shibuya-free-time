import type { Database } from "@/types/supabase/database.types";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Photo = Database["public"]["Tables"]["photo"]["Row"];
type PhotoInsert = Database["public"]["Tables"]["photo"]["Insert"];
type PhotoUpdate = Database["public"]["Tables"]["photo"]["Update"];

// PATCH用: PhotoUpdateにはない"追加フィールド"を受けられるように拡張
type PhotoUpdateBody = {
    id: PhotoUpdate["id"]; // 更新時に必須
    file_hash?: PhotoUpdate["file_hash"];
    file_path?: PhotoUpdate["file_path"];
    temporary_spot_id?: PhotoUpdate["temporary_spot_id"];
    public_url?: PhotoUpdate["public_url"];
    // 追加で受ける可能性があるフィールド
    name?: string; // file_pathにマッピング
    url?: string; // public_urlにマッピング
};

const BUCKET_NAME = "Photo-only";

// エラー文字列を取り出すユーティリティ
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

// GET: 写真一覧を全件取得
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.from("photo").select("*");
        if (error) throw error;

        return NextResponse.json(data); // 200 OK
    } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
    }
}

// POST: 写真の新規作成 or アップロード
export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const contentType = req.headers.get("content-type") || "";

        // multipart/form-data (ファイルアップロード)の場合
        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("file") as Blob | null;
            const fileName = formData.get("name") as string | undefined;
            const fileHash = formData.get("file_hash") as string | undefined;
            const temporarySpotId = (formData.get("temporary_spot_id") as string) || "temp_spot_id";

            if (!file || !fileName || !fileHash) {
                return NextResponse.json(
                    {
                        error: "Missing file, name, or file_hash in multipart form data.",
                    },
                    { status: 400 },
                );
            }

            // 1. file_hash重複チェック
            const { data: existingHash, error: hashCheckErr } = await supabase
                .from("photo")
                .select("id")
                .eq("file_hash", fileHash)
                .maybeSingle();
            if (hashCheckErr) throw hashCheckErr;
            if (existingHash) {
                return NextResponse.json(
                    {
                        error: "A photo with the same file_hash already exists.",
                    },
                    { status: 409 }, // Conflict
                );
            }

            // 2. file_path重複チェック (同名ファイルの登録がNGの場合)
            const { data: existingPath, error: existErr } = await supabase
                .from("photo")
                .select("id")
                .eq("file_path", fileName)
                .maybeSingle();
            if (existErr) throw existErr;
            if (existingPath) {
                return NextResponse.json(
                    { error: `File path '${fileName}' already exists.` },
                    { status: 409 },
                );
            }

            // 3. Supabase Storageへアップロード
            const { data: uploadData, error: uploadErr } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, file, { upsert: false });
            if (uploadErr) throw uploadErr;

            // 4. 公開URLを取得 (公開バケット前提)
            const {
                data: { publicUrl },
            } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

            // 5. photoテーブルにINSERT
            const { data: inserted, error: insertErr } = await supabase
                .from("photo")
                .insert<PhotoInsert>({
                    file_path: fileName,
                    file_hash: fileHash,
                    temporary_spot_id: temporarySpotId,
                    public_url: publicUrl,
                })
                .single();

            if (insertErr) {
                // DB登録失敗時、ストレージにアップしたファイルを削除 (ロールバック)
                await supabase.storage.from(BUCKET_NAME).remove([fileName]);
                throw insertErr;
            }

            return NextResponse.json(inserted, { status: 201 });
        }

        // JSON (URL登録などファイルアップロード以外)の場合
        const jsonBody = await req.json();

        // (任意) file_hashがあれば重複チェック
        if (jsonBody.file_hash) {
            const { data: existingHash, error: hashCheckErr } = await supabase
                .from("photo")
                .select("id")
                .eq("file_hash", jsonBody.file_hash)
                .maybeSingle();
            if (hashCheckErr) throw hashCheckErr;
            if (existingHash) {
                return NextResponse.json(
                    {
                        error: "A photo with the same file_hash already exists.",
                    },
                    { status: 409 },
                );
            }
        }

        // INSERTペイロード作成
        const payload: PhotoInsert = {
            file_path: jsonBody.file_path || jsonBody.name || "no_file_path",
            file_hash: jsonBody.file_hash || "hash_placeholder",
            temporary_spot_id: jsonBody.temporary_spot_id || "temp_spot_id",
            public_url: jsonBody.public_url || jsonBody.url || null,
        };

        // (任意) file_path重複チェック
        const { data: existingPath, error: existPathErr } = await supabase
            .from("photo")
            .select("id")
            .eq("file_path", payload.file_path)
            .maybeSingle();
        if (existPathErr) throw existPathErr;
        if (existingPath) {
            return NextResponse.json(
                { error: `File path '${payload.file_path}' already exists.` },
                { status: 409 },
            );
        }

        const { data: inserted, error } = await supabase
            .from("photo")
            .insert<PhotoInsert>(payload)
            .single();
        if (error) throw error;

        return NextResponse.json(inserted, { status: 201 });
    } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
    }
}

// PATCH: 写真情報の更新 (temporary_spot_idなど)
export async function PATCH(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const jsonBody = (await req.json()) as PhotoUpdateBody;
        const { id, name, url, ...rest } = jsonBody;

        if (!id) {
            return NextResponse.json({ error: "Missing 'id' for update." }, { status: 400 });
        }

        // PhotoUpdate型のペイロード
        const updatePayload: PhotoUpdate = { ...rest };

        // "name" -> file_path
        if (typeof name === "string") {
            updatePayload.file_path = name;
        }
        // "url" -> public_url
        if (typeof url === "string") {
            updatePayload.public_url = url;
        }

        // file_hashを更新する場合は重複チェックする (任意)
        if (updatePayload.file_hash) {
            const { data: existingHash, error: hashCheckErr } = await supabase
                .from("photo")
                .select("id")
                .eq("file_hash", updatePayload.file_hash)
                .maybeSingle();
            if (hashCheckErr) throw hashCheckErr;
            // 自分以外で重複があればNG
            if (existingHash && existingHash.id !== id) {
                return NextResponse.json(
                    { error: "Another photo with the same file_hash exists." },
                    { status: 409 },
                );
            }
        }

        // 実際にUPDATE
        const { data, error } = await supabase
            .from("photo")
            .update<PhotoUpdate>(updatePayload)
            .eq("id", id)
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
    }
}

// DELETE: 写真の削除
export async function DELETE(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing 'id' for delete." }, { status: 400 });
        }

        // DBレコード削除
        const { data, error } = await supabase.from("photo").delete().eq("id", id).single();
        if (error) throw error;

        // ストレージファイルの削除も必要なら
        // if (data?.file_path) {
        //   await supabase.storage.from(BUCKET_NAME).remove([data.file_path]);
        // }

        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
    }
}
