import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase/database.types';
import { SpotCard } from '@/components/partials/supabase/SpotCard';
import Link from 'next/link';

// Supabase "temporary_spots" テーブルの行データ型
type TemporarySpotRow = Database['public']['Tables']['temporary_spots']['Row'];

// SpotCard に渡すためのデータ構造
interface TemporarySpotForCard {
    id: string;
    slug: string;
    title: string;
    imageUrl?: string;
}

// Supabaseのtemporary_spotsテーブルのrowをSpotCardで使いやすい構造に変換するヘルパー
function mapRowToTemporarySpot(row: TemporarySpotRow): TemporarySpotForCard {
    // row.image が文字列(publicUrl)の場合と { src: string } の2パターンに対応
    let imageUrl = '';
    if (row.image) {
        if (typeof row.image === 'string') {
            imageUrl = row.image;
        } else if (typeof row.image === 'object' && 'src' in row.image) {
            imageUrl = (row.image as any).src as string;
        }
    }

    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        imageUrl,
    };
}

export default async function LimitedFreeListPage() {
    const supabase = createServerComponentClient<Database>({ cookies });

    // 「status = published」「end_date >= 現在」のレコードを取得
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('temporary_spots')
        .select('*')
        .eq('status', 'published')
        .gte('end_date', now)
        .order('start_date', { ascending: true });

    if (error) {
        console.error('[LimitedFreeListPage Error]', error.message);
        return (
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">期間限定無料スポット一覧</h1>
                <p className="text-red-500">データ取得エラーが発生しました</p>
            </main>
        );
    }

    if (!data || data.length === 0) {
        return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">期間限定無料スポット一覧</h1>
            <p>現在、該当するスポットはありません。</p>
        </main>
        );
    }

    // 取得したレコードを SpotCard 用のデータに変換
    const spots = data.map(mapRowToTemporarySpot);

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">期間限定無料スポット一覧</h1>
            <div className="space-y-8">
                {spots.map((spot) => (
                <SpotCard
                    key={spot.id}
                    spot={spot}
                    // 詳細ページへのリンク
                    href={`/public/LimitedFree/${spot.slug}`}
                />
                ))}
            </div>
        </main>
    );
}