import mongoose from "mongoose";
import accountModel from "../models/account.model.js";
import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import emailService from "../services/email.service.js";

async function createTransaction(req, res) {
  /**
   * 1. validate Request
   */

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(401).json({
      message: "fromAccount ,toAccount,amount and idempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount and fromAccount",
    });
  }

  /**
   * 2. validate idempotencyKey
   */

  const isTransactionAlreadyExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExist) {
    if (isTransactionAlreadyExist.status === "COMPLETED") {
      return res.status(201).json({
        message: "Transaction already completed",
      });
    }
    if (isTransactionAlreadyExist.status === "PENDING") {
      return res.status(201).json({
        message: "Transaction is already in progress",
      });
    }
    if (isTransactionAlreadyExist.status === "FAILED") {
      return res.status(201).json({
        message: "Transaction already failed",
      });
    }
    if (isTransactionAlreadyExist.status === "REVERSED") {
      return res.status(201).json({
        message: "Transaction already reversed",
      });
    }
  }

  /**
   * 3. check Account Status
   */
  if (toUserAccount !== "ACTIVE" || fromUserAccount !== "ACTIVE") {
    return res.status(500).json({
      message:
        "Both toAccount and fromAccount user must be active to process transaction",
    });
  }

  /**
   * 4.Drive sender balance from Ledger
   */
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient Balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }
  /**
   * 5. Create Transaction(Pending)
   * 6. create DEBIT ledger Entry
   * 7. create CREDIT ledger entry
   * 8. mark Transaction completed
   * 9. commit mongoDB session
   */
  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  /**
   * 6.send email notification
   */

  await emailService.sendRegistrationEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount
  )
  return res.status(201).json({
    message:"Transaction Completed Successfully",
    transaction:transaction
  })
}

export default {createTransaction}