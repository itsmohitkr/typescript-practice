import prisma from "../../shared/prisma";
import { Prisma } from "../../generated/prisma/client";
import type { UserRepository } from "../../shared/repository";
import type { User } from "./user.types";

export const createUserRepo = (): UserRepository => {
    return {
        findAll: async (): Promise<User[]> => {
            return prisma.user.findMany();
        },

        findById: async (id: string): Promise<User | null> => {
            return prisma.user.findUnique({
                where: { id },
            });
        },

        findByEmail: async (email: string): Promise<User | null> => {
            return prisma.user.findUnique({
                where: { email },
            });
        },

        create: async (input: User): Promise<User> => {
            return prisma.user.create({
                data: input,
            });
        },

        update: async (id: string, input: Partial<User>): Promise<User | null> => {
            try {
                return await prisma.user.update({
                    where: { id },
                    data: input,
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    return null;
                }
                throw error;
            }
        },

        delete: async (id: string): Promise<boolean> => {
            try {
                await prisma.user.delete({
                    where: { id },
                });
                return true;
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    return false;
                }
                throw error;
            }
        },
    };
};
