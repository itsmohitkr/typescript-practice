import { Router } from "express";
import userRoutes from "../domain/user/user.router";
import productRoutes from "../domain/product/product.router";

const router = Router();

router.use("/user", userRoutes);
router.use("/product", productRoutes);

export default router;
