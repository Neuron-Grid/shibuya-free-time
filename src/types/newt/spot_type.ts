import type { Category } from "@/types/newt/Category_type";
import type { Tag } from "@/types/newt/Tag_type";
import type { Content, Image } from "newt-client-js";

export interface Spot extends Content {
    title: string; // 必須: タイトルに利用されています。
    slug: string; // 必須: uniqueID
    nearest_station?: string; // 任意
    opening_hours?: string; // 任意
    image?: Image; // 任意: 1枚だけが設定されています。
    Description: string; // 必須: マークダウン記法が利用されています。
    category: Category; // 任意: Categoryモデルを参照
    tags: Tag[]; // 必須: 複数値選択許可、最小選択値が1、Tagモデルを参照
    meta?: SpotMeta; // 任意: 特殊フィールド
    address: Address; // 必須
}

export interface Address {
    lat: number; // 緯度
    lng: number; //経度
}

export interface SpotMeta {
    title?: string; // タイトル（1行）
    description?: string; // ディスクリプション（1行）
    ogImage?: Image; // 画像（1枚）
}
