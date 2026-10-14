import type { ProductRepository } from "../../shared/repository";
import type { CreateProductInput, Product, UpdateProductInput } from "./product.types";
import { AppError } from "../../middleware/appError";

export interface ProductService {
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Product[]>;
    createProduct(input: CreateProductInput): Promise<Product>;
    updateProduct(productId: string, input: UpdateProductInput): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;
}

export const createProductService = (productRepo: ProductRepository): ProductService => {
    return {
        getAllProducts: async (): Promise<Product[]> => {
            return await productRepo.findAll();
        },

        getProductById: async (id: string): Promise<Product> => {
            const product = await productRepo.findById(id);
            if (!product) {
                throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
            }
            return product;
        },

        getProductsByCategory: async (category: string): Promise<Product[]> => {
            return await productRepo.findByCategory(category);
        },

        createProduct: async (input: CreateProductInput): Promise<Product> => {
            const newProduct: Product = {
                ...input,
                id: crypto.randomUUID(),
            };
            return await productRepo.create(newProduct);
        },

        updateProduct: async (productId: string, input: UpdateProductInput): Promise<Product> => {
            const updated = await productRepo.update(productId, input);
            if (!updated) {
                throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
            }
            return updated;
        },

        deleteProduct: async (id: string): Promise<boolean> => {
            const isDeleted = await productRepo.delete(id);
            if (!isDeleted) {
                throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND");
            }
            return isDeleted;
        },
    };
};

export default createProductService;
