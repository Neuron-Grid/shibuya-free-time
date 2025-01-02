import { supabaseClient } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useState } from "react";

export const experimental_ppr = true;

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    alert("ログインに失敗しました");
                    console.error(error);
                } else {
                    alert("ログイン成功！");
                    // Next.js のルーターを使用してページ遷移
                    router.push("/admin");
                }
            } catch (err) {
                alert("ログインに失敗しました");
                console.error(err);
            }
        },
        [email, password, router],
    );

    return (
        <div className="container">
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-4">管理者ログイン</h1>
                <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded p-2"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition-colors"
                    >
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
}
