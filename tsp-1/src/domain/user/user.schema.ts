import { z } from "zod";

// Base schemas
const userBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    age: z.number().int().positive("Age must be a positive integer"),
    role: z.enum(["admin", "user"]),
});

const userIdParamSchema = z.object({
    userId: z.uuid("Invalid user ID"),
});

// Endpoint schemas bundling body, params, and query
export const createUserSchema = {
    body: userBodySchema,
};

export const getUserSchema = {
    params: userIdParamSchema,
};

export const updateUserSchema = {
    params: userIdParamSchema,
    body: userBodySchema.partial(),
};

export const deleteUserSchema = {
    params: userIdParamSchema,
};

// Inferred types
export type CreateUserInput = z.infer<typeof userBodySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema.body>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
