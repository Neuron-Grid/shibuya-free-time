import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase/database.types';
import { notFound } from 'next/navigation';
import { SpotCard } from '@/components/partials/supabase/SpotCard';

// temporary_spots テーブルの行データ型
type TemporarySpotRow = Database['public']['Tables']['temporary_spots']['Row'];

interface TemporarySpotForCard {
    id: string;
    slug: string;
    title: string;
    imageUrl?: string;
}

type Props = {
    params: {
        slug: string;
    };
};

// row.image が文字列 / JSON の両方に対応
function mapRowToTemporarySpot(row: TemporarySpotRow): TemporarySpotForCard {
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

export default async function LimitedFreeDetailPage({ params }: Props) {
    const supabase = createServerComponentClient<Database>({ cookies });

    // slugをキーに1件取得
    const { data, error } = await supabase
        .from('temporary_spots')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (error) {
        console.error('[LimitedFreeDetailPage Error]', error.message);
        notFound();
    }
    if (!data) {
        notFound();
    }

    // SpotCard で扱う構造に変換
    const spot = mapRowToTemporarySpot(data);

    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">期間限定無料スポット 詳細</h1>
        {/* 詳細ページなのでリンク先は不要 */}
        <SpotCard spot={spot} href={undefined} />
        {/* 詳細内容などはお好みで追記 */}
            <div className="mt-6">
                <p>ここにスポットの詳細情報を自由に記載してください（例: 期間, 住所など）。</p>
            </div>
        </main>
    );
}