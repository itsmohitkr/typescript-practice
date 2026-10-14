import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { apiError } from "../helpers/api/apiResponse.types";
import { AppError } from "./appError";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    // 1. Operational App Errors (404, 401, 403, 400, etc.)
    if (err instanceof AppError) {
        res.status(err.statusCode).json(apiError(err.message, err.errorCode));
        return;
    }

    // 2. Malformed JSON Body (Express json parser SyntaxError)
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json(apiError("Invalid JSON payload in request body", "INVALID_JSON_BODY"));
        return;
    }

    // 3. Prisma Database Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (err.code === "P2002") {
            const fields = Array.isArray(err.meta?.target)
                ? (err.meta.target as string[]).join(", ")
                : (err.meta?.target as string) || "field";
            res.status(409).json(
                apiError(`Duplicate value for unique ${fields}`, "DUPLICATE_RESOURCE"),
            );
            return;
        }

        // P2025: Record not found to update/delete
        if (err.code === "P2025") {
            res.status(404).json(apiError("Record not found", "RECORD_NOT_FOUND"));
            return;
        }

        // P2003: Foreign key constraint failed
        if (err.code === "P2003") {
            res.status(400).json(
                apiError("Foreign key constraint failed", "FOREIGN_KEY_VIOLATION"),
            );
            return;
        }
    }

    // 4. Unknown / Unexpected Server Errors (500)
    console.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, err);

    const isProduction = process.env.NODE_ENV === "production";
    const errorMessage = isProduction
        ? "Internal Server Error"
        : err instanceof Error
          ? err.message
          : String(err);

    res.status(500).json(apiError(errorMessage, "INTERNAL_SERVER_ERROR"));
};

export default errorHandler;
