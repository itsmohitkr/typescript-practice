import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserService } from "./user.service";
import type { UserRepository } from "../../shared/repository";
import type { CreateUserInput, User } from "./user.types";
import { AppError } from "../../middleware/appError";

describe("createUserService", () => {
    let mockUserRepo: UserRepository;
    let userService: ReturnType<typeof createUserService>;

    const mockUser: User = {
        id: "user-123",
        name: "Mohit",
        email: "mohit@example.com",
        age: 25,
        role: "user",
        createdAt: new Date(),
    };

    beforeEach(() => {
        mockUserRepo = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };

        userService = createUserService(mockUserRepo);
    });

    describe("createUser", () => {
        it("should create a user with generated id and createdAt", async () => {
            const input: CreateUserInput = {
                name: "Mohit",
                email: "mohit@example.com",
                age: 25,
                role: "user",
            };

            vi.mocked(mockUserRepo.create).mockImplementation(async (user: User) => user);

            const result = await userService.createUser(input);

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.name).toBe(input.name);
            expect(result.email).toBe(input.email);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(mockUserRepo.create).toHaveBeenCalledOnce();
            expect(mockUserRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: input.name,
                    email: input.email,
                    age: input.age,
                    role: input.role,
                    id: expect.any(String),
                    createdAt: expect.any(Date),
                }),
            );
        });
    });

    describe("getUserById", () => {
        it("should return the user if found", async () => {
            vi.mocked(mockUserRepo.findById).mockResolvedValue(mockUser);

            const result = await userService.getUserById("user-123");

            expect(result).toEqual(mockUser);
            expect(mockUserRepo.findById).toHaveBeenCalledWith("user-123");
        });

        it("should throw AppError if user is not found", async () => {
            vi.mocked(mockUserRepo.findById).mockResolvedValue(null);

            await expect(userService.getUserById("non-existent-id")).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "USER_NOT_FOUND",
            });
        });
    });

    describe("getAllUsers", () => {
        it("should return all users from repository", async () => {
            vi.mocked(mockUserRepo.findAll).mockResolvedValue([mockUser]);

            const result = await userService.getAllUsers();

            expect(result).toEqual([mockUser]);
            expect(mockUserRepo.findAll).toHaveBeenCalledOnce();
        });
    });

    describe("updateUser", () => {
        it("should update and return the user", async () => {
            const updatedUser = { ...mockUser, name: "Updated Name" };
            vi.mocked(mockUserRepo.update).mockResolvedValue(updatedUser);

            const result = await userService.updateUser("user-123", { name: "Updated Name" });

            expect(result).toEqual(updatedUser);
            expect(mockUserRepo.update).toHaveBeenCalledWith("user-123", { name: "Updated Name" });
        });

        it("should throw AppError if user to update does not exist", async () => {
            vi.mocked(mockUserRepo.update).mockResolvedValue(null);

            await expect(
                userService.updateUser("non-existent-id", { name: "Test" }),
            ).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "USER_NOT_FOUND",
            });
        });
    });

    describe("deleteUser", () => {
        it("should return true when user is deleted", async () => {
            vi.mocked(mockUserRepo.delete).mockResolvedValue(true);

            const result = await userService.deleteUser("user-123");

            expect(result).toBe(true);
            expect(mockUserRepo.delete).toHaveBeenCalledWith("user-123");
        });

        it("should throw AppError if user to delete does not exist", async () => {
            vi.mocked(mockUserRepo.delete).mockResolvedValue(false);

            await expect(userService.deleteUser("non-existent-id")).rejects.toMatchObject({
                statusCode: 404,
                errorCode: "USER_NOT_FOUND",
            });
        });
    });
});
