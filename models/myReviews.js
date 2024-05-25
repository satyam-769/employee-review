import mongoose from "mongoose";

const myReviewSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const MyReview = mongoose.model("MyReview", myReviewSchema);

export default MyReview;
