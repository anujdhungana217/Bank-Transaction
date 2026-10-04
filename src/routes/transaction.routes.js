import { Router } from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import transactionController from "../controllers/transaction.controller.js"

const TransactionRoutes=Router()

transactionRoutes.post("/",authMiddleware.middleware , transactionController.createTransaction)

export default transactionRoutes