import express from "express";
import userController from "./user.module";
import { validate } from "../../middleware/validate";
import { createUserSchema, updateUserSchema, getUserSchema, deleteUserSchema } from "./user.schema";

const router = express.Router();

router
    .route("/:userId")
    .get(validate(getUserSchema), userController.getUser)
    .patch(validate(updateUserSchema), userController.updateUser)
    .delete(validate(deleteUserSchema), userController.deleteUser);

router
    .route("/")
    .get(userController.getAllUsers)
    .post(validate(createUserSchema), userController.createUser);

export default router;
