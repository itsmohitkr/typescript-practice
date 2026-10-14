import { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";
import { apiError } from "../helpers/api/apiResponse.types";

export interface RequestValidationSchemas {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export const validate = (schemas: RequestValidationSchemas) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: Record<string, unknown> = {};

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                errors.params = z.flattenError(result.error).fieldErrors;
            } else {
                req.params = result.data as Record<string, string>;
            }
        }

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                errors.body = z.flattenError(result.error).fieldErrors;
            } else {
                req.body = result.data;
            }
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                errors.query = z.flattenError(result.error).fieldErrors;
            } else {
                req.query = result.data as any;
            }
        }

        if (Object.keys(errors).length > 0) {
            res.status(400).json(apiError("Validation failed", "VALIDATION_ERROR", errors));
            return;
        }
        next();
    };
};
