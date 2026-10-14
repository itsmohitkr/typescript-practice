import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

// Process-level safety nets
process.on("unhandledRejection", (reason: unknown) => {
    console.error("[Fatal] Unhandled Promise Rejection:", reason);
    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (error: Error) => {
    console.error("[Fatal] Uncaught Exception:", error);
    server.close(() => {
        process.exit(1);
    });
});
