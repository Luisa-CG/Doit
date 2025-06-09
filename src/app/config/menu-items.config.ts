export interface MenuItem {
    title: string;
    icon: string;
    route: string;
}

export const MENU_ITEMS: MenuItem[] = [
    {
        title: 'Gestionar Tareas',
        icon: 'list-outline',
        route: '/home',
    },
    {
        title: 'Categorías',
        icon: 'folder-open-outline',
        route: '/manage-categories',
    }
];
