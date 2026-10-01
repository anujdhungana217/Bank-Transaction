import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account Must Be associated with User"],
      index: true,
    },
    status: {
      type:String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message:"status can be Active, Frozen and Closed",
      },
      default:"ACTIVE"
    },
    currency: {
      type: String,
      required: [true, "Currency is required for creating an account"],
      default: "NPR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("account", accountSchema);

export default accountModel;
