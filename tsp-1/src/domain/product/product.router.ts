import express from "express";
import productController from "./product.module";
import { validate } from "../../middleware/validate";
import {
    createProductSchema,
    updateProductSchema,
    getProductSchema,
    getProductsByCategorySchema,
    deleteProductSchema,
} from "./product.schema";

const router = express.Router();

router
    .route("/category/:category")
    .get(validate(getProductsByCategorySchema), productController.getProductsByCategory);

router
    .route("/:productId")
    .get(validate(getProductSchema), productController.getProduct)
    .patch(validate(updateProductSchema), productController.updateProduct)
    .delete(validate(deleteProductSchema), productController.deleteProduct);

router
    .route("/")
    .get(productController.getAllProducts)
    .post(validate(createProductSchema), productController.createProduct);

export default router;
