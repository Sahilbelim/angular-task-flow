// export interface Task {
//     _id?: string;
//     title: string;
//     description: string;
//     dueDate: string;
//     status: 'pending' | 'in-progress' | 'completed';
//     createdBy: string;

//     assignedTo: string[];

//     permissions: {
//         view: string[];
//         edit: string[];
//         delete: string[];
//     };

//     createdAt?: string;
//     updatedAt?: string;
// }

export interface Task {
    id?: string;

    title: string;
    description?: string;

    status: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';

    dueDate: string;

    createdBy: string;          // userId who created
    parentId: string;           // root parent id (VERY IMPORTANT)

    assignedUsers: string[];    // array of userIds

    createdAt: string;
    
    order_id?: number;
}
