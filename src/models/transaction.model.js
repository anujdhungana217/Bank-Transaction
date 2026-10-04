import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with from account"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with to account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message: "status can be either PENDING,COMPLETED,FAILED and REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Ammount is required for creating transaction"],
      min: [0, "Transaction amount can not be Negative"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "IdempotencyKey is required for creating Transaction"],
      index: true,
      unique: true,
    },
  },
  {
    timestamp: true,
  },
);

const transactionModel = new mongoose.model("transaction", transactionSchema);

export default transactionModel
