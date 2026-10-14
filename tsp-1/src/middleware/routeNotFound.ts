import type { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export const routeNotFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, "ROUTE_NOT_FOUND"));
};

export default routeNotFoundHandler;
