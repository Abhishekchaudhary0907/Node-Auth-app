import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  refreshTokenHash: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  replacedByTokenId: {
    type: String,
    default: null,
  },
  revokedAt: {
    type: Date,
    default: null,
  },
  revokedReason: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  tokenId: {
    type: String, //random UUID
    required: true,
    index: true,
  },
  familyId: {
    type: String,
    required: true,
    index: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export { RefreshToken };
