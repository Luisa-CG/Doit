export interface Task {
    id: string;
    title: string;
    categoryId?: string;
    done?: boolean;
}