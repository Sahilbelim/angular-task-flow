export interface Task {
    _id?: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdBy: string;

    assignedTo: string[];

    permissions: {
        view: string[];
        edit: string[];
        delete: string[];
    };

    createdAt?: string;
    updatedAt?: string;
}
