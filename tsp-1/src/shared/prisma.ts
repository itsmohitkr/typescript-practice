import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/tsp_db?schema=public";

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

export default prisma;
