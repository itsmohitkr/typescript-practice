import type { UserRepository } from "../../shared/repository";
import type { CreateUserInput, UpdateUserInput, User } from "./user.types";
import { AppError } from "../../middleware/appError";

export interface UserService {
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(input: CreateUserInput): Promise<User>;
    updateUser(userId: string, input: UpdateUserInput): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
}

export const createUserService = (userRepo: UserRepository): UserService => {
    return {
        getAllUsers: async (): Promise<User[]> => {
            return await userRepo.findAll();
        },

        getUserById: async (id: string): Promise<User> => {
            const user = await userRepo.findById(id);
            if (!user) {
                throw new AppError("User not found", 404, "USER_NOT_FOUND");
            }
            return user;
        },

        createUser: async (input: CreateUserInput): Promise<User> => {
            const newUser: User = {
                ...input,
                id: crypto.randomUUID(),
                createdAt: new Date(),
            };
            return await userRepo.create(newUser);
        },

        updateUser: async (userId: string, input: UpdateUserInput): Promise<User> => {
            const updated = await userRepo.update(userId, input);
            if (!updated) {
                throw new AppError("User not found", 404, "USER_NOT_FOUND");
            }
            return updated;
        },

        deleteUser: async (id: string): Promise<boolean> => {
            const isDeleted = await userRepo.delete(id);
            if (!isDeleted) {
                throw new AppError("User not found", 404, "USER_NOT_FOUND");
            }
            return isDeleted;
        },
    };
};

export default createUserService;
