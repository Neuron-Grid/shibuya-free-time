export interface MenuItem {
    Dropdown_id: string;
    title: React.ReactNode;
    route?: string;
    onClick?: () => void;
    children?: MenuItem[];
}
