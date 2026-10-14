import { z } from "zod";

// Base schemas
const productBodySchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().positive("price must be >0"),
    category: z.string().min(1, "Category is required"),
});

const productIdParamSchema = z.object({
    productId: z.uuid("Invalid product ID"),
});

const productCategoryParamSchema = z.object({
    category: z.string().min(1, "Category is required"),
});

// Endpoint schemas bundling body, params, and query
export const createProductSchema = {
    body: productBodySchema,
};

export const getProductSchema = {
    params: productIdParamSchema,
};

export const getProductsByCategorySchema = {
    params: productCategoryParamSchema,
};

export const updateProductSchema = {
    params: productIdParamSchema,
    body: productBodySchema.partial(),
};

export const deleteProductSchema = {
    params: productIdParamSchema,
};

// Inferred types
export type CreateProductInput = z.infer<typeof productBodySchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema.body>;
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type ProductCategoryParam = z.infer<typeof productCategoryParamSchema>;
