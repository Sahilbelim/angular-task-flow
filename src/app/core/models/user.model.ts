export interface User {
    id?: string;

    name: string;
    email: string;
    password: string;

    parentId: string | null; // null = root parent (registered user)

    permissions: {
        createTask?: boolean;
        editTask?: boolean;
        deleteTask?: boolean;
        createUser?: boolean;
    };

    createdAt: string;
}
