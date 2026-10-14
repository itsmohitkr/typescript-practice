import prisma from "../../shared/prisma";
import { Prisma } from "../../generated/prisma/client";
import type { ProductRepository } from "../../shared/repository";
import type { Product } from "./product.types";

export const createProductRepo = (): ProductRepository => {
    return {
        findAll: async (): Promise<Product[]> => {
            return prisma.product.findMany();
        },

        findById: async (id: string): Promise<Product | null> => {
            return prisma.product.findUnique({
                where: { id },
            });
        },

        findByCategory: async (category: string): Promise<Product[]> => {
            return prisma.product.findMany({
                where: { category },
            });
        },

        create: async (input: Product): Promise<Product> => {
            return prisma.product.create({
                data: input,
            });
        },

        update: async (id: string, input: Partial<Product>): Promise<Product | null> => {
            try {
                return await prisma.product.update({
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
                await prisma.product.delete({
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
