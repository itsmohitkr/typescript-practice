import type { Request, Response } from "express";
import type { ProductService } from "./product.service";
import { sendSuccessResponse } from "../../helpers/api/apiResponse.types";

export const createProductController = (productService: ProductService) => {
    const getProduct = async (req: Request, res: Response) => {
        const id = req.params?.productId as string;
        const result = await productService.getProductById(id);
        sendSuccessResponse(res, result, "fetched successfully");
    };

    const getAllProducts = async (req: Request, res: Response) => {
        const data = await productService.getAllProducts();
        sendSuccessResponse(res, data, "success");
    };

    const getProductsByCategory = async (req: Request, res: Response) => {
        const category = req.params?.category as string;
        const data = await productService.getProductsByCategory(category);
        sendSuccessResponse(res, data, "success");
    };

    const createProduct = async (req: Request, res: Response) => {
        const createdProduct = await productService.createProduct(req.body);
        sendSuccessResponse(res, createdProduct, "product created successfully", 201);
    };

    const updateProduct = async (req: Request, res: Response) => {
        const result = await productService.updateProduct(
            req.params?.productId as string,
            req.body,
        );
        sendSuccessResponse(res, result, "product updated successfully");
    };

    const deleteProduct = async (req: Request, res: Response) => {
        await productService.deleteProduct(req.params?.productId as string);
        sendSuccessResponse(res, null, "product deleted successfully");
    };

    return {
        getProduct,
        getAllProducts,
        getProductsByCategory,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};

export type ProductController = ReturnType<typeof createProductController>;
export default createProductController;
