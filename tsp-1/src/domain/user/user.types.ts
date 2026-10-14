export type User = {
    id: string;
    name: string;
    email: string;
    age: number;
    role: "admin" | "user";
    createdAt: Date;
};

export type CreateUserInput = Omit<User, "id" | "createdAt">;

export type UpdateUserInput = Partial<Omit<User, "id" | "createdAt">>;
