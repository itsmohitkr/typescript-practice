import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProductService } from "./product.service";
import type { ProductRepository } from "../../shared/repository";
import type { CreateProductInput, Product } from "./product.types";
import { AppError } from "../../middleware/appError";

describe("createProductService", () => {
    let mockProductRepo: ProductRepository;
    let productService: ReturnType<typeof createProductService>;

    const mockProduct: Product = {
        id: "prod-123",
        name: "Mechanical Keyboard",
        price: 99.99,
        category: "electronics",
    };

    beforeEach(() => {
        mockProductRepo = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByCategory: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };

        productService = createProductService(mockProductRepo);
    });

    describe("createProduct", () => {
        it("should create a product with generated id", async () => {
            const input: CreateProductInput = {
                name: "Mechanical Keyboard",
                price: 99.99,
                category: "electronics",
            };

            vi.mocked(mockProductRepo.create).mockImplementation(
                async (product: Product) => product,
            );

            const result = await productService.createProduct(input);

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBe(input.name);
            expect(result.price).toBe(input.price);
            expect(result.category).toBe(input.category);
            expect(mockProductRepo.create).toHaveBeenCalledOnce();
            expect(mockProductRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: input.name,
                    price: input.price,
                    category: input.category,
                    id: expect.any(String),
                }),
            );
        });
    });

    describe("getProductById", () => {
        it("should return the product if found", async () => {
            vi.mocked(mockProductRepo.findById).mockResolvedValue(mockProduct);

            const result = await productService.getProductById("prod-123");

            expect(result).toEqual(mockProduct);
            expect(mockProductRepo.findById).toHaveBeenCalledWith("prod-123");
        });

        it("should throw AppError if product is not found", async () => {
            vi.mocked(mockProductRepo.findById).mockResolvedValue(null);

            await expect(productService.getProductById("non-existent-id")).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "PRODUCT_NOT_FOUND",
            });
        });
    });

    describe("getProductsByCategory", () => {
        it("should return products matching category", async () => {
            vi.mocked(mockProductRepo.findByCategory).mockResolvedValue([mockProduct]);

            const result = await productService.getProductsByCategory("electronics");

            expect(result).toEqual([mockProduct]);
            expect(mockProductRepo.findByCategory).toHaveBeenCalledWith("electronics");
        });

        it("should return an empty array if no products match category", async () => {
            vi.mocked(mockProductRepo.findByCategory).mockResolvedValue([]);

            const result = await productService.getProductsByCategory("books");

            expect(result).toEqual([]);
            expect(mockProductRepo.findByCategory).toHaveBeenCalledWith("books");
        });
    });

    describe("getAllProducts", () => {
        it("should return all products from repository", async () => {
            vi.mocked(mockProductRepo.findAll).mockResolvedValue([mockProduct]);

            const result = await productService.getAllProducts();

            expect(result).toEqual([mockProduct]);
            expect(mockProductRepo.findAll).toHaveBeenCalledOnce();
        });
    });

    describe("updateProduct", () => {
        it("should update and return the product", async () => {
            const updatedProduct = { ...mockProduct, price: 89.99 };
            vi.mocked(mockProductRepo.update).mockResolvedValue(updatedProduct);

            const result = await productService.updateProduct("prod-123", { price: 89.99 });

            expect(result).toEqual(updatedProduct);
            expect(mockProductRepo.update).toHaveBeenCalledWith("prod-123", { price: 89.99 });
        });

        it("should throw AppError if product to update does not exist", async () => {
            vi.mocked(mockProductRepo.update).mockResolvedValue(null);

            await expect(
                productService.updateProduct("non-existent-id", { price: 50 }),
            ).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "PRODUCT_NOT_FOUND",
            });
        });
    });

    describe("deleteProduct", () => {
        it("should return true when product is deleted", async () => {
            vi.mocked(mockProductRepo.delete).mockResolvedValue(true);

            const result = await productService.deleteProduct("prod-123");

            expect(result).toBe(true);
            expect(mockProductRepo.delete).toHaveBeenCalledWith("prod-123");
        });

        it("should throw AppError if product to delete does not exist", async () => {
            vi.mocked(mockProductRepo.delete).mockResolvedValue(false);

            await expect(productService.deleteProduct("non-existent-id")).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "PRODUCT_NOT_FOUND",
            });
        });
    });
});
