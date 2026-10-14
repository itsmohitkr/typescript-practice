import type { Request, Response } from "express";
import type { UserService } from "./user.service";
import { sendSuccessResponse } from "../../helpers/api/apiResponse.types";

export const createUserController = (userService: UserService) => {
    const getUser = async (req: Request, res: Response) => {
        const id = req.params?.userId as string;
        const result = await userService.getUserById(id);
        sendSuccessResponse(res, result, "fetched successfully");
    };

    const getAllUsers = async (req: Request, res: Response) => {
        const data = await userService.getAllUsers();
        sendSuccessResponse(res, data, "success");
    };

    const createUser = async (req: Request, res: Response) => {
        const createdUser = await userService.createUser(req.body);
        sendSuccessResponse(res, createdUser, "user created successfully", 201);
    };

    const updateUser = async (req: Request, res: Response) => {
        const result = await userService.updateUser(req.params?.userId as string, req.body);
        sendSuccessResponse(res, result, "user updated successfully");
    };

    const deleteUser = async (req: Request, res: Response) => {
        await userService.deleteUser(req.params?.userId as string);
        sendSuccessResponse(res, null, "user deleted successfully");
    };

    return {
        getUser,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
    };
};

export type UserController = ReturnType<typeof createUserController>;
export default createUserController;
