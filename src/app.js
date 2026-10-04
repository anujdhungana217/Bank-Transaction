import express from "express";
import authRuouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import cookieParser from "cookie-parser";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRuouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRoutes)

export default app;
