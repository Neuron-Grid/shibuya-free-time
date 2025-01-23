export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    slug: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            newsletter_issues: {
                Row: {
                    content: string;
                    id: string;
                    sent_at: string | null;
                    subject: string;
                };
                Insert: {
                    content: string;
                    id?: string;
                    sent_at?: string | null;
                    subject: string;
                };
                Update: {
                    content?: string;
                    id?: string;
                    sent_at?: string | null;
                    subject?: string;
                };
                Relationships: [];
            };
            newsletter_sends: {
                Row: {
                    id: string;
                    newsletter_issue_id: string;
                    sent_at: string | null;
                    subscriber_id: string;
                };
                Insert: {
                    id?: string;
                    newsletter_issue_id: string;
                    sent_at?: string | null;
                    subscriber_id: string;
                };
                Update: {
                    id?: string;
                    newsletter_issue_id?: string;
                    sent_at?: string | null;
                    subscriber_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName:
                            "newsletter_sends_newsletter_issue_id_fkey";
                        columns: ["newsletter_issue_id"];
                        isOneToOne: false;
                        referencedRelation: "newsletter_issues";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "newsletter_sends_subscriber_id_fkey";
                        columns: ["subscriber_id"];
                        isOneToOne: false;
                        referencedRelation: "newsletter_subscribers";
                        referencedColumns: ["id"];
                    },
                ];
            };
            newsletter_subscribers: {
                Row: {
                    email: string;
                    id: string;
                    subscribed_at: string | null;
                };
                Insert: {
                    email: string;
                    id?: string;
                    subscribed_at?: string | null;
                };
                Update: {
                    email?: string;
                    id?: string;
                    subscribed_at?: string | null;
                };
                Relationships: [];
            };
            photo: {
                Row: {
                    caption: string | null;
                    created_at: string | null;
                    file_hash: string;
                    file_path: string;
                    id: string;
                    public_url: string | null;
                    temporary_spot_id: string;
                };
                Insert: {
                    caption?: string | null;
                    created_at?: string | null;
                    file_hash: string;
                    file_path: string;
                    id?: string;
                    public_url?: string | null;
                    temporary_spot_id: string;
                };
                Update: {
                    caption?: string | null;
                    created_at?: string | null;
                    file_hash?: string;
                    file_path?: string;
                    id?: string;
                    public_url?: string | null;
                    temporary_spot_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "photo_temporary_spot_id_fkey";
                        columns: ["temporary_spot_id"];
                        isOneToOne: false;
                        referencedRelation: "temporary_spots";
                        referencedColumns: ["id"];
                    },
                ];
            };
            tags: {
                Row: {
                    created_at: string | null;
                    id: string;
                    name: string;
                    slug: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    name: string;
                    slug: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    name?: string;
                    slug?: string;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            temporary_spot_tags: {
                Row: {
                    created_at: string | null;
                    tag_id: string;
                    temporary_spot_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    tag_id: string;
                    temporary_spot_id: string;
                };
                Update: {
                    created_at?: string | null;
                    tag_id?: string;
                    temporary_spot_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "temporary_spot_tags_tag_id_fkey";
                        columns: ["tag_id"];
                        isOneToOne: false;
                        referencedRelation: "tags";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName:
                            "temporary_spot_tags_temporary_spot_id_fkey";
                        columns: ["temporary_spot_id"];
                        isOneToOne: false;
                        referencedRelation: "temporary_spots";
                        referencedColumns: ["id"];
                    },
                ];
            };
            temporary_spots: {
                Row: {
                    address_lat: number;
                    address_lng: number;
                    category_id: string;
                    created_at: string | null;
                    description: string;
                    end_date: string;
                    id: string;
                    meta: Json | null;
                    nearest_station: string | null;
                    opening_hours: string | null;
                    slug: string;
                    start_date: string;
                    status: Database["public"]["Enums"]["spot_status"];
                    title: string;
                    updated_at: string | null;
                };
                Insert: {
                    address_lat: number;
                    address_lng: number;
                    category_id: string;
                    created_at?: string | null;
                    description: string;
                    end_date: string;
                    id?: string;
                    meta?: Json | null;
                    nearest_station?: string | null;
                    opening_hours?: string | null;
                    slug: string;
                    start_date: string;
                    status?: Database["public"]["Enums"]["spot_status"];
                    title: string;
                    updated_at?: string | null;
                };
                Update: {
                    address_lat?: number;
                    address_lng?: number;
                    category_id?: string;
                    created_at?: string | null;
                    description?: string;
                    end_date?: string;
                    id?: string;
                    meta?: Json | null;
                    nearest_station?: string | null;
                    opening_hours?: string | null;
                    slug?: string;
                    start_date?: string;
                    status?: Database["public"]["Enums"]["spot_status"];
                    title?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "temporary_spots_category_id_fkey";
                        columns: ["category_id"];
                        isOneToOne: false;
                        referencedRelation: "categories";
                        referencedColumns: ["id"];
                    },
                ];
            };
            votes: {
                Row: {
                    created_at: string | null;
                    id: string;
                    ip_address: unknown | null;
                    temporary_spot_id: string;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    ip_address?: unknown | null;
                    temporary_spot_id: string;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    ip_address?: unknown | null;
                    temporary_spot_id?: string;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "votes_temporary_spot_id_fkey";
                        columns: ["temporary_spot_id"];
                        isOneToOne: false;
                        referencedRelation: "temporary_spots";
                        referencedColumns: ["id"];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            spot_status: "draft" | "published" | "deleted";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof Database } ? keyof (
            & Database[PublicTableNameOrOptions["schema"]]["Tables"]
            & Database[PublicTableNameOrOptions["schema"]]["Views"]
        )
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
        & Database[PublicTableNameOrOptions["schema"]]["Tables"]
        & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )[TableName] extends {
        Row: infer R;
    } ? R
    : never
    : PublicTableNameOrOptions extends keyof (
        & PublicSchema["Tables"]
        & PublicSchema["Views"]
    ) ? (
            & PublicSchema["Tables"]
            & PublicSchema["Views"]
        )[PublicTableNameOrOptions] extends {
            Row: infer R;
        } ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends
        {
            Insert: infer I;
        } ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I;
        } ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof Database }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends
        {
            Update: infer U;
        } ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U;
        } ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
            "CompositeTypes"
        ]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
        CompositeTypeName
    ]
    : PublicCompositeTypeNameOrOptions extends
        keyof PublicSchema["CompositeTypes"]
        ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
