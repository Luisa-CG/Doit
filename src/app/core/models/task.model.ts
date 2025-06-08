export interface Task {
    id: number;
    title: string;
    done: boolean;
    categoryId?: number | null;
}