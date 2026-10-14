import type { Response } from "express";

export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errorCode: string;
    errors?: unknown;
    timestamp: string;
    requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(
    data: T,
    message: string = "Success",
    meta?: Record<string, unknown>,
): ApiSuccessResponse<T> {
    return {
        success: true,
        message,
        data,
        ...(meta && { meta }),
    };
}

export function apiError(
    message: string,
    errorCode: string = "INTERNAL_SERVER_ERROR",
    errors: unknown = null,
    requestId?: string,
): ApiErrorResponse {
    return {
        success: false,
        message,
        errorCode,
        ...(errors ? { errors } : {}),
        timestamp: new Date().toISOString(),
        ...(requestId && { requestId }),
    };
}

export function sendSuccessResponse<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
    meta?: Record<string, unknown>,
): Response {
    return res.status(statusCode).json(apiSuccess(data, message, meta));
}

export function sendErrorResponse(
    res: Response,
    message: string,
    errorCode: string = "INTERNAL_SERVER_ERROR",
    statusCode: number = 500,
    errors: unknown = null,
    requestId?: string,
): Response {
    return res.status(statusCode).json(apiError(message, errorCode, errors, requestId));
}

// Backwards-compatible legacy helper
export default function apiResponse<T>(
    data: T,
    message: string = "success",
    success: boolean = true,
): ApiResponse<T> {
    if (success) {
        return apiSuccess(data, message);
    }
    return apiError(message, "OPERATION_FAILED", data);
}
